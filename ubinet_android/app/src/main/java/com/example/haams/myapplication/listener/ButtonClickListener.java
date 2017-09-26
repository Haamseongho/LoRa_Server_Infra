package com.example.haams.myapplication.listener;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TimePicker;

import com.example.haams.myapplication.IntroActivity;
import com.example.haams.myapplication.R;
import com.example.haams.myapplication.SignUpActivity;
import com.example.haams.myapplication.adapters.MedFormAdapter;
import com.example.haams.myapplication.data.MedForm;
import com.example.haams.myapplication.sub_activities.MedFormActivity;

import java.util.ArrayList;

import butterknife.OnClick;

/**
 * Created by haams on 2017-08-05.
 */

public class ButtonClickListener implements View.OnClickListener {
    private Context context;
    private static final String TAG = "ButtonClickListener";
    private int index = 0;
    private IndexSendMsg indexingMsg;
    private ArrayList<MedForm> medFormList;
    private int position;
    private MedFormActivity mfActivity;

    public ButtonClickListener(Context context) {
        this.context = context;
    }

    public ButtonClickListener(Context context, ArrayList<MedForm> medFormList, int position) {
        this.context = context;
        this.medFormList = medFormList;
        this.position = position;
        mfActivity = new MedFormActivity();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_kakao_login:
                context.startActivity(new Intent(context, SignUpActivity.class));
                break;

            case R.id.btn_spot_now:
                setIndexMsg(1);
                break;

            case R.id.btn_spot_track:
                setIndexMsg(2);
                break;

            case R.id.btnSetAlarm:
                setMedAlarm(context,medFormList, position);
                break;

            case R.id.btnSetDate:
                setMedDate(context,medFormList, position);
                break;
        }
    }


    private void setMedAlarm(Context context, ArrayList<MedForm> medFormList, int position) {

    }


    private void setMedDate(Context context, ArrayList<MedForm> medFormList, int position) {
    }

    private void setIndexMsg(int n) {
        indexingMsg = new IndexSendMsg(context);
        indexingMsg.savePreferences("index", n);
    }


}
