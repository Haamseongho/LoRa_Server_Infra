package com.example.haams.myapplication.sms;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.haams.myapplication.MainActivity;
import com.example.haams.myapplication.R;
import com.example.haams.myapplication.data.Guard;
import com.example.haams.myapplication.server.Network;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CheckAuthNumber extends AppCompatActivity {

    RandomAuthNumber randAuth;
    String authStr = "n";
    private static final String TAG = "CheckAuthNumber";
    GuardNameStorage guardNameStorage;
    Network network;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_check_auth_number);
        isAuthNumRight();
    }

    private void isAuthNumRight() {

        randAuth = new RandomAuthNumber(this);
        guardNameStorage = new GuardNameStorage(this);
        final AlertDialog.Builder dlg = new AlertDialog.Builder(this);
        final View itemView = LayoutInflater.from(this).inflate(R.layout.activity_auth_number_box, null);
        dlg.setView(itemView);
        final EditText edtAuthNum = (EditText) itemView.findViewById(R.id.dev_auth_num);
        final Button btnAuthCheck = (Button) itemView.findViewById(R.id.btn_check_isAuthNum);



        Log.e(TAG,randAuth.getAuthRandNum("authNum"));
        randAuth = new RandomAuthNumber(this);

        /*
        인증 번호와 이 전에 저장해 둔 번호가 일치하는 지 확인
         */
        btnAuthCheck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                authStr = authStr + edtAuthNum.getText().toString();
                isCorrectNumber();
            }

            private void isCorrectNumber() {
                Log.e(TAG,authStr);
                String str = randAuth.getAuthRandNum("authNum");
                Log.e(TAG,"인증번호:  "+str);
                if (str.equals(authStr)) {
                    /*
                    인증 번호 완료
                     */
                    Intent smsIntent = new Intent(CheckAuthNumber.this,
                            MainActivity.class);

                    String name = guardNameStorage.getUserName("guard_name");
                    network = Network.getNetworkInstance();
                    network.getGuardProxy().saveGuardNameToServer(name, new Callback<Guard>() {
                        @Override
                        public void onResponse(Call<Guard> call, Response<Guard> response) {
                            if(response.isSuccessful()){
                                Log.i(TAG,"사용자 정보 저장 완료");
                            }
                        }

                        @Override
                        public void onFailure(Call<Guard> call, Throwable t) {
                            Log.e(TAG,t.toString());
                        }
                    });


                    smsIntent.putExtra("auth_index", 1);
                    smsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(smsIntent);

                } else {
                    Toast.makeText(CheckAuthNumber.this, "인증번호가 틀립니다.", Toast.LENGTH_LONG).show();
                    authStr = "n"; // 초기화
                }
            }
        });
        dlg.show();
    }
}
