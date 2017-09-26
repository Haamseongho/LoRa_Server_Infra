package com.example.haams.myapplication;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.haams.myapplication.sign_up.CustomUtils;
import com.example.haams.myapplication.sms.GuardNameStorage;
import com.example.haams.myapplication.sms.RandomAuthNumber;
import com.kakao.auth.ErrorCode;
import com.kakao.network.ErrorResult;
import com.kakao.usermgmt.UserManagement;
import com.kakao.usermgmt.callback.MeResponseCallback;
import com.kakao.usermgmt.response.model.UserProfile;

import static android.R.id.message;

public class SignUpActivity extends AppCompatActivity {

    private static final String TAG = "SignUpActivity";
    private EditText edtAuthUser;
    private Button btnAuth;
    private static final int PERMISSION_SEND_SMS = 0;
    UserProfile userProfile;
    GuardNameStorage guardNameStorage;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);
        requestMe();
    }

    public void requestMe() {
        UserManagement.requestMe(new MeResponseCallback() {
            @Override
            public void onSessionClosed(ErrorResult errorResult) {
                ErrorCode error = ErrorCode.valueOf(errorResult.getErrorCode());
                Log.d(TAG, String.valueOf(error));
                if (error == ErrorCode.CLIENT_ERROR_CODE) {
                    finish(); // 클라이언트 에러일 경우 종료
                } else {
                    Log.i(TAG, "사용자 인증실패");
                    redirectHere(); // 사용자 인증 실패가 아닌 경우 다시 현재 페이지
                }
            }

            @Override
            public void onNotSignedUp() {
                // 카카오톡 회원이 아님
            }

            @Override
            public void onSuccess(UserProfile result) {
                Log.i(TAG, "성공!!");
                check_auth_dev_user(result);
            }
        });
    }

    private void check_auth_dev_user(final UserProfile result) {
        final AlertDialog.Builder dlg = new AlertDialog.Builder(this);
        final View itemView = LayoutInflater.from(this).inflate(R.layout.activity_auth_dev_user, null);
        dlg.setView(itemView);
        btnAuth = (Button) itemView.findViewById(R.id.btn_check_isUser);
        edtAuthUser = (EditText) itemView.findViewById(R.id.dev_user_num);

        this.userProfile = result;

        guardNameStorage = new GuardNameStorage(this);
        guardNameStorage.saveUserName("guard_name", result.getNickname());
        // 카카오 계정으로 로그인 시에 이름 뽑아서 저장하기.

        // 매핑
        btnAuth.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                auth_by_phoneNum(edtAuthUser.getText().toString(), userProfile);
            }
        });

        /*
        핸드폰 번호 인증 --> LTID 가져오기 // 서버 들렸다오세요~
         */
        dlg.show();
    }

    private void auth_by_phoneNum(String sNum, UserProfile result) {
        if (CustomUtils.validatePhoneNumber(sNum)) {
            Toast.makeText(getApplicationContext(), "핸드폰 번호의 양식에 맞게 다시 입력해주세요.", Toast.LENGTH_LONG).show();
        } else {
            Log.i(TAG, "휴대폰 패턴 인증 완료");
            guardNameStorage.saveUserNumber("phone_number", sNum);
            checkPermission(sNum, result);
        }
    }


    @TargetApi(Build.VERSION_CODES.M)
    private void checkPermission(String sNum, UserProfile result) {
        if (ContextCompat.checkSelfPermission(SignUpActivity.this, android.Manifest.permission.READ_CONTACTS)
                != PackageManager.PERMISSION_GRANTED) {
            // request permission (see result in onRequestPermissionsResult() method)
            ActivityCompat.requestPermissions(SignUpActivity.this,
                    new String[]{android.Manifest.permission.SEND_SMS},
                    PERMISSION_SEND_SMS);
        } else {
            // permission already granted run sms send
            auth_msg_send_to_User(sNum, result);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        switch (requestCode) {
            case PERMISSION_SEND_SMS: {

                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // permission was granted
                    auth_msg_send_to_User(edtAuthUser.getText().toString(), userProfile);
                } else {
                    // permission denied
                }
                return;
            }
        }
    }

    private void auth_msg_send_to_User(String sNum, final UserProfile result) {

        Log.i(TAG, result.toString());
        int[] authNum = new int[6];
        String authStr = "n";
        for (int i = 0; i < authNum.length; i++) {
            authNum[i] = (int) (Math.random() * 10);
            authStr = authStr + authNum[i];
        }

        RandomAuthNumber randAuth = new RandomAuthNumber(this);
        randAuth.saveAuthRandNum("authNum", authStr);
        Log.e(TAG, "authNum = " + authStr);
        Log.e(TAG, randAuth.getAuthRandNum("authNum"));

        PendingIntent sentIntent = PendingIntent.getBroadcast(this, PERMISSION_SEND_SMS, new Intent("SMS_SENT_INTENT"), 0);
        PendingIntent deliveryIntent = PendingIntent.getBroadcast(this, PERMISSION_SEND_SMS, new Intent("SMS_DELIVERED_ACTION"), 0);

        /*
        sendSMS_registerReceiver
         */
        registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                switch (getResultCode()) {
                    case Activity.RESULT_OK:
                        Log.i(TAG, "전송완료");
                        break;
                    case SmsManager.RESULT_ERROR_GENERIC_FAILURE:
                        Log.e(TAG, "전송실패");
                        break;
                    case SmsManager.RESULT_ERROR_NO_SERVICE:
                        Toast.makeText(SignUpActivity.this, "서비스 지역이 아닙니다.", Toast.LENGTH_LONG).show();
                        break;

                }
            }
        }, new IntentFilter("SMS_SENT_ACTION"));

        /*
        receiveSMS_registerReceiver
         */
        registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                switch (getResultCode()) {
                    case Activity.RESULT_OK:
                        Log.i(TAG, "SMS 수신 완료");
                        //redirectMainActivity(result);
                        break;
                    case Activity.RESULT_CANCELED:
                        Log.e(TAG, "SMS 수신 실패");
                        break;

                }
            }
        }, new IntentFilter("SMS_DELIVERED_ACTION"));
        SmsManager mSmsMAnager = SmsManager.getDefault();
        mSmsMAnager.sendTextMessage(sNum, null,
                "다음은 디바이스 사용자 확인 인증 과정 입니다. " +
                        "인증 번호 6자리를 입력해주세요" + "  " + authNum[0] + authNum[1] + authNum[2] + authNum[3] + authNum[4] + authNum[5],

                sentIntent, deliveryIntent);

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case PERMISSION_SEND_SMS:
                Log.i(TAG, "sendMessage_checking");
        }
    }

    private void redirectHere() {
        final Intent intent = new Intent(this, IntroActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
        startActivity(intent);
    }

    private void redirectMainActivity(UserProfile result) {
        final Intent intent = new Intent(SignUpActivity.this, MainActivity.class);
        Log.i(TAG, result.toString());
        intent.putExtra("nickname", result.getNickname());
        intent.putExtra("id", result.getServiceUserId());
        intent.putExtra("image", result.getProfileImagePath());
        startActivity(intent);
        finish();
    }
}
