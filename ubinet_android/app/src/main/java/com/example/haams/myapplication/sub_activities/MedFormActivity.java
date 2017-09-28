package com.example.haams.myapplication.sub_activities;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ListView;

import com.example.haams.myapplication.R;
import com.example.haams.myapplication.adapters.MedFormAdapter;
import com.example.haams.myapplication.data.MedForm;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class MedFormActivity extends AppCompatActivity {

    private ListView medList;
    private MedFormAdapter medFormAdapter;
    private ArrayList<MedForm> medFormList;
    private ArrayList<Integer> hours;
    private ArrayList<Integer> minutes;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_medform);

        initViews();
    }

    private void initViews() {
        medList = (ListView) findViewById(R.id.medListView);
        medFormList = new ArrayList<>();
        hours = new ArrayList<>();
        minutes = new ArrayList<>();

        hours.add(10);
        hours.add(13);
        hours.add(15);
        minutes.add(30);
        minutes.add(20);
        minutes.add(10);

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, Calendar.YEAR);
        cal.set(Calendar.MONTH, Calendar.MONTH);
        cal.set(Calendar.DAY_OF_MONTH, Calendar.DAY_OF_MONTH);
        Date startDate = cal.getTime();
        Date endDate = cal.getTime();
        /*
        기본 예제만 추가 // 이 부분 서버를 연결해서 데이터 넣는거 해줘야함.
         */
        medFormList.add(new MedForm("약 이름1", hours, minutes, startDate, endDate));
        medFormAdapter = new MedFormAdapter(medFormList, this);
        medList.setAdapter(medFormAdapter);
    }
}
