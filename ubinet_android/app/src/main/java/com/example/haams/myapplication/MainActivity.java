package com.example.haams.myapplication;

import android.content.DialogInterface;
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

import com.example.haams.myapplication.data.Guard;
import com.example.haams.myapplication.data.User;
import com.example.haams.myapplication.listener.ButtonClickListener;
import com.example.haams.myapplication.listener.IndexSendMsg;
import com.example.haams.myapplication.server.Network;
import com.example.haams.myapplication.sign_up.TokenStorage;
import com.example.haams.myapplication.sms.GuardNameStorage;
import com.example.haams.myapplication.sub_activities.MapActivity;
import com.example.haams.myapplication.sub_activities.MapTrackActivity;
import com.example.haams.myapplication.sub_activities.MedFormActivity;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {
    private Intent gIntent;
    private String sLtid;
    private static final String TAG = "MainActivity";
    private IndexSendMsg indexingMsg;
    private Intent mIntent = null;
    private AlertDialog.Builder mDlg;
    private EditText edtLTID;
    private boolean checkLocationYN = true;
    private double lat,lon;

    /*
    유저 이름 가지고 오기
    입력한 전화번호 가지고 오기 --> LTID 받아오기
    LTID , 유저이름 --> 보호자 DB 저장 (서버)
     */
    GuardNameStorage guardNameStorage;
    Network network;


    @BindView(R.id.btn_spot_track)
    Button btnSpots;
    @BindView(R.id.btn_medicate_form)
    Button btnMedicate;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        Toast.makeText(getApplicationContext(), "인증에 성공하였습니다. 위치 정보 확인과 투약 알림을 설정하실 수 있습니다.", Toast.LENGTH_LONG).show();
        initViews();
    }

    private void initViews() {
        guardNameStorage = new GuardNameStorage(this);
        Log.i(TAG, guardNameStorage.getUserNumber("phone_number") + "//" + guardNameStorage.getUserName("guard_name"));
        final String phoneNum = guardNameStorage.getUserNumber("phone_number");

        /*
        전화번호 --> userDB에서 Tel 가지고 오기.
         */
        network = Network.getNetworkInstance();
        Log.i(TAG, phoneNum);
        network.getUserProxy().getLTIDByTelNum(phoneNum, new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    Log.i(TAG, "전화번호: " + phoneNum + "//" + "LTID: " + response.body().getLTID());
                    saveUserInfoToGuardDB(response.body().getLTID());
                    guardNameStorage.saveUserLTID("LTID", response.body().getLTID()); // LTID 등록 --> 투약 알림 및 위치 정보 체크할 때 사용할 주요 키
                    // SharedPreference에서 저장한 phoneNum으로 LTID를 찾아온다.
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e(TAG, t.toString());
            }
        });

    }

    private void saveUserInfoToGuardDB(final String LTID) {
        final String name = guardNameStorage.getUserName("guard_name");
        Log.i(TAG, name);
        /*
        찾아온 LTID와 SharedPreference에서 저장한 name을 가지고 guardianDB에 LTID와 name을 저장한다.
         */
        network.getGuardProxy().saveGuardInfoToServer(LTID, name, new Callback<Guard>() {
            @Override
            public void onResponse(Call<Guard> call, Response<Guard> response) {
                if (response.isSuccessful()) {
                    Log.e(TAG, response.body().toString() + "입니다. ");
                    Log.i(TAG, "보호자 데이터베이스 저장 완료: " + LTID + "," + name);
                }
            }

            @Override
            public void onFailure(Call<Guard> call, Throwable t) {
                Log.e(TAG, t.toString());
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        if (existIDInServer()) {
            // MainActivity 보여주기
        } else {

        }

    }

    private boolean existIDInServer() {
        TokenStorage tokenStorage = new TokenStorage(this);
        if ((tokenStorage.getPreferences("K_token") != null) || (tokenStorage.getPreferences("F_token")) != null) {
            return true;
        }
        return false;
    }


    @OnClick({R.id.btn_spot_track, R.id.btn_medicate_form})
    public void mainButtonClick(View v) {
        switch (v.getId()) {
            case R.id.btn_spot_track:
                spotInfoChecked();
                break;

            case R.id.btn_medicate_form:
                medicateInfoChecked();
                break;
        }
    }


    private void spotInfoChecked() {

        checkLTIDFirst();

        if (checkLocationYN) {
            final AlertDialog.Builder dlg = new AlertDialog.Builder(this);
            final View spotView = LayoutInflater.from(this).inflate(R.layout.activity_spot_info_check, null);
            final Button btnSpotNow, btnSpotTrack;
            btnSpotNow = (Button) spotView.findViewById(R.id.btn_spot_now);
            btnSpotTrack = (Button) spotView.findViewById(R.id.btn_spot_track);

            btnSpotNow.setOnClickListener(new ButtonClickListener(spotView.getContext()));
            btnSpotTrack.setOnClickListener(new ButtonClickListener(spotView.getContext()));

            indexingMsg = new IndexSendMsg(spotView.getContext());


            dlg.setView(spotView);
            dlg.setNegativeButton("취소", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    dlg.setOnDismissListener(new DialogInterface.OnDismissListener() {
                        @Override
                        public void onDismiss(DialogInterface dialog) {
                            dialog.dismiss();
                        }
                    });
                }
            });

        /*
        대화상자 --> 인덱스 값 넘기기
        // 위치 정보 or 투약 폼 정리 ( 1 -> 현재 위치 알려주기 / 2 -> 하루 전체 경로 트랙킹)
         */

            dlg.setPositiveButton("확인", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    checkSpotInfo(indexingMsg.getPreferences("index"));
                }
            });
            dlg.show();
        } else {
            Toast.makeText(MainActivity.this, "사용자 정보와 기기 LTID 정보가 다르기 때문에 위치 정보를 받아볼 수 없습니다.", Toast.LENGTH_LONG).show();
        }
    }

    private void checkLTIDFirst() {
        String LTID = guardNameStorage.getUserLTID("LTID");
        network = Network.getNetworkInstance();
        network.getUserProxy().sendLTIDToServerForDynamicData(LTID, new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    Log.i(TAG, "사용자 정보 LTID와 DynamicData - LTID 비교");
                    checkLocationYN = true;
                    /*
                     두 LTID가 일치할 경우 사용자 정보 갱신 lat,lon,pulse <-- by ThingPlug // 조건 완성
                     upLink 데이터로 갱신하기 때문에 (업링크 - LTID , lat ,lon ,pulse
                     안드로이드 클라이언트 단에서는 요청 및 응답할 내용이 없습니다.
                    */
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e(TAG, t.toString());
                checkLocationYN = false; // 사용자 정보와 동적 데이터의 LTID가 일치하지 않는다면 지도를 보여줄 의미가 없기 때문에 실패로 빠질 경우 지도 실행 시작 하지 않는다.
            }
        });
    }

    private void checkSpotInfo(int index) {
        /*
        edtLTID를 같이 넘기고 지도를 보여주는 액티비티에서 해당 LTID를 가지고
        정보를 식별하여 위치 정보를 불러온다.
         */
        if (index == 1) {
            getLatLngByServer();

            Log.i(TAG, "현재 위치");
        } else if (index == 2) {
            mIntent = new Intent(MainActivity.this, MapTrackActivity.class);
            startActivity(mIntent);
            Log.i(TAG, "오늘 하루 경로");
        } else {
            Log.e(TAG, "인덱싱 에러(맵)");
        }
    }

    private void getLatLngByServer() {
        /*
        MapActivity로 이동하기 전 LTID 정보를 가지고 lat,lon 정보를 뽑아서 넘기기.
         */
        String LTID = guardNameStorage.getUserLTID("LTID");
        Log.i(TAG,LTID+"입니다.");
        network = Network.getNetworkInstance();
        network.getUserProxy().getLatLngByLTIDFromServer(LTID, new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if(response.isSuccessful()){
                    // 사용자 정보 중 위도 / 경도 전송
                    Log.i(TAG,response.body().toString()+" \n 사용자 정보입니다.");
                    lat = response.body().getLat();
                    lon = response.body().getLon();
                    Log.i(TAG,lat+"/////"+lon);
                    mIntent = new Intent(MainActivity.this, MapActivity.class);
                    mIntent.putExtra("lat",lat);
                    mIntent.putExtra("lng",lon);
                    startActivity(mIntent);
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e(TAG,t.toString());
            }
        });
    }

    private void medicateInfoChecked() {

        mIntent = new Intent(MainActivity.this, MedFormActivity.class);
        startActivity(mIntent);
    }
}
