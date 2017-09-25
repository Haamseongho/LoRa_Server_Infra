package com.example.haams.myapplication;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.telephony.SmsManager;
import android.util.Base64;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.haams.myapplication.listener.ButtonClickListener;
import com.example.haams.myapplication.sign_up.CustomUtils;
import com.example.haams.myapplication.sign_up.TokenStorage;
import com.example.haams.myapplication.sms.GuardNameStorage;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;
import com.google.firebase.iid.FirebaseInstanceIdService;
import com.kakao.auth.ISessionCallback;
import com.kakao.auth.Session;
import com.kakao.usermgmt.response.model.UserProfile;
import com.kakao.util.exception.KakaoException;

import org.json.JSONException;
import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

public class IntroActivity extends AppCompatActivity {

    private Button btnSignUp;
    private static final String TAG = "IntroActivity";
    private LoginButton btnFacebookLogin;
    private Intent fIntent;

    /*
    페이스북 계정 sms 인증과정
     */

    private EditText edtAuthUser;
    private Button btnAuth;
    private static final int PERMISSION_SEND_SMS = 0;
    String userName;

    /*
    Session 관리
     */
    private SessionCallback callback; // -- KAkao ISession
    private CallbackManager callbackManager; // Facebook Session 관리 매니저
    private TokenStorage tokenStorage; // 각 SNS 세션의 Token SharedPreference에 저장 (임시 저장소)
    private GuardNameStorage guardNameStorage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_intro);
        initViews();
        getSessionCallback();

    }


    private void getSessionCallback() {
        // 각 SNS 세션 받아오기
        try {
            PackageInfo info = getPackageManager().getPackageInfo(
                    this.getPackageName(),
                    PackageManager.GET_SIGNATURES
            );
            for (Signature signature : info.signatures) {
                // 인증 후 서명 --> 암호화
                MessageDigest md = null;
                try {
                    md = MessageDigest.getInstance("SHA");
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                }
                md.update(signature.toByteArray());

                // SHA 알고리즘으로 암호화 (Hashing 하기 전 Digest 메시지로 변환 //

                Log.i("KeyHash", Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "??");
            e.printStackTrace();
        }
        callback = new SessionCallback();
        Session.getCurrentSession().addCallback(callback);
        tokenStorage.savePreferences("k_token", Session.getCurrentSession().getAccessToken());
        Log.i(TAG + "/token/", tokenStorage.getPreferences("k_token"));
        // 카카오톡 토큰 정리
    }


    private void initViews() {
        findViewById(R.id.btn_kakao_login).setOnClickListener(new ButtonClickListener(this));
        btnFacebookLogin = (LoginButton) findViewById(R.id.btn_facebook_login);

        initFaceBookLogin(); // 페이스북 연동 로그인 정리
    }

    private void initFaceBookLogin() {
        tokenStorage = new TokenStorage(this);
        guardNameStorage = new GuardNameStorage(this);
        callbackManager = CallbackManager.Factory.create();
        // Facebook callbackManager
        btnFacebookLogin.setReadPermissions(Arrays.asList("public_profile", "email"));
        // 로그인 할 경우에 보여줄 퍼미션 설정 (public_profile : 기본 프로필 전부 ,  email : 이메일
        btnFacebookLogin.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(final LoginResult loginResult) {
                GraphRequest graphRequest = GraphRequest.newMeRequest(loginResult.getAccessToken(), new GraphRequest.GraphJSONObjectCallback() {
                    @Override
                    public void onCompleted(JSONObject object, GraphResponse response) {
                        Log.i("facebook_login", object.toString());
                        try {
                            tokenStorage.savePreferences("f_token", String.valueOf(loginResult.getAccessToken()));
                            Log.i(TAG + "/token/", tokenStorage.getPreferences("f_token"));
                            check_auth_dev_user(object.getString("name"));

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });

                Bundle bundle = new Bundle();
                bundle.putString("fields", "id,name,email,gender,birthday");
                graphRequest.setParameters(bundle);
                graphRequest.executeAsync();
            }

            @Override
            public void onCancel() {

            }

            @Override
            public void onError(FacebookException error) {
                Log.e("facebook_login_error", error.toString());
            }
        });
    }

    /*
    페이스북 계정 인증 및 SMS 확인
     */
    private void check_auth_dev_user(final String name) {
        final AlertDialog.Builder dlg = new AlertDialog.Builder(this);
        final View itemView = LayoutInflater.from(this).inflate(R.layout.activity_auth_dev_user, null);
        dlg.setView(itemView);
        btnAuth = (Button) itemView.findViewById(R.id.btn_check_isUser);
        edtAuthUser = (EditText) itemView.findViewById(R.id.dev_user_num);

        guardNameStorage.saveUserName("guard_name",name);
        // 페이스북 로그인 후 이름 저장 .

        this.userName = name;
        // 매핑
        btnAuth.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                auth_by_phoneNum(edtAuthUser.getText().toString(), userName);
            }
        });

        /*
        핸드폰 번호 인증 --> LTID 가져오기 // 서버 들렸다오세요~
         */
        dlg.show();
    }

    private void auth_by_phoneNum(String phoneNum, String userName) {
        if (CustomUtils.validatePhoneNumber(phoneNum)) {
            Toast.makeText(getApplicationContext(), "핸드폰 번호의 양식에 맞게 다시 입력해주세요.", Toast.LENGTH_LONG).show();
        } else {
            Log.i(TAG, "휴대폰 패턴 인증 완료");
            checkPermission(phoneNum, userName);
        }
    }


    @TargetApi(Build.VERSION_CODES.M)
    private void checkPermission(String phoneNum, String userName) {
        if (ContextCompat.checkSelfPermission(IntroActivity.this, android.Manifest.permission.READ_CONTACTS)
                != PackageManager.PERMISSION_GRANTED) {
            // request permission (see result in onRequestPermissionsResult() method)
            ActivityCompat.requestPermissions(IntroActivity.this,
                    new String[]{android.Manifest.permission.SEND_SMS},
                    PERMISSION_SEND_SMS);
        } else {
            // permission already granted run sms send
            auth_msg_send_to_User(phoneNum, userName);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        switch (requestCode) {
            case PERMISSION_SEND_SMS: {

                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // permission was granted
                    auth_msg_send_to_User(edtAuthUser.getText().toString(), userName);
                } else {
                    // permission denied
                }
                return;
            }
        }
    }

    private void auth_msg_send_to_User(String sNum, String userName) {

        Log.i(TAG, userName.toString());

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
                        Toast.makeText(IntroActivity.this, "서비스 지역이 아닙니다.", Toast.LENGTH_LONG).show();
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
                        break;
                    case Activity.RESULT_CANCELED:
                        Log.e(TAG, "SMS 수신 실패");
                        break;

                }
            }
        }, new IntentFilter("SMS_DELIVERED_ACTION"));
        SmsManager mSmsMAnager = SmsManager.getDefault();
        mSmsMAnager.sendTextMessage(sNum, null,
                "사용자 인증 과정 중입니다. 디바이스 사용자라면 확인 버튼을 눌러주세요",
                sentIntent, deliveryIntent);

    }


    /*
    카카오톡 로그인
     */


    private class SessionCallback implements ISessionCallback {

        @Override
        public void onSessionOpened() {
            Log.i(TAG, "세션 성공");
            redirectSignUp();
        }

        @Override
        public void onSessionOpenFailed(KakaoException exception) {
            Toast.makeText(IntroActivity.this, exception + "///", Toast.LENGTH_LONG).show();
            Log.e(TAG, "세션 실패");
        }
    }

    // 카카오 API 로그인

    private void redirectSignUp() {
        startActivity(new Intent(IntroActivity.this, SignUpActivity.class));
        finish();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (Session.getCurrentSession().handleActivityResult(requestCode, resultCode, data)) {
            Log.i(TAG + "111", Session.getCurrentSession() + "/" + requestCode + "/" + data + "입니다.");
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
        callbackManager.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Session.getCurrentSession().removeCallback(callback);
    }

}
