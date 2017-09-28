package com.example.haams.myapplication.adapters;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.icu.text.SimpleDateFormat;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.CalendarView;
import android.widget.EditText;
import android.widget.TimePicker;
import android.widget.Toast;

import com.example.haams.myapplication.MainActivity;
import com.example.haams.myapplication.R;
import com.example.haams.myapplication.data.MedForm;
import com.example.haams.myapplication.database.DBHelper;
import com.example.haams.myapplication.listener.ButtonClickListener;
import com.example.haams.myapplication.server.Network;
import com.example.haams.myapplication.server.Service;
import com.example.haams.myapplication.sms.GuardNameStorage;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by haams on 2017-08-06.
 */

public class MedFormAdapter extends BaseAdapter implements View.OnClickListener {
    private ArrayList<MedForm> medFormList;
    private Context context;
    private ArrayList<Integer> hours;
    private ArrayList<Integer> minutes;
    private Date startDate;
    private Date endDate;
    private Network network;
    String medName;
    GuardNameStorage guardNameStorage;

    private final String TAG = "MedFormAdapter";
    DBHelper dbhelper;
    int index = 0;
    int index2 = 0;

    public MedFormAdapter(ArrayList<MedForm> medFormList, Context context) {
        this.medFormList = medFormList;
        this.context = context;
        guardNameStorage = new GuardNameStorage(context);
        hours = new ArrayList<>();
        minutes = new ArrayList<>();
    }

    public MedFormAdapter(ArrayList<MedForm> medFormList, Context context, ArrayList<Integer> hours, ArrayList<Integer> minutes, Date startDate, Date endDate) {
        this.medFormList = medFormList;
        this.context = context;
        this.hours = hours;
        this.minutes = minutes;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    @Override
    public int getCount() {
        return medFormList.size();
    }

    @Override
    public Object getItem(int position) {
        return medFormList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }


    class Holder {
        EditText medListEdt;
        Button btnSetAlarm;
        Button btnSetDate;
        Button btnMedConfirm;
        Button btnSetName;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View itemView = LayoutInflater.from(context).inflate(R.layout.activity_med_form_list_items, parent, false);

        final Holder holder = new Holder();
        holder.medListEdt = (EditText) itemView.findViewById(R.id.medListEdt);
        holder.btnSetAlarm = (Button) itemView.findViewById(R.id.btnSetAlarm);
        holder.btnSetDate = (Button) itemView.findViewById(R.id.btnSetDate);
        holder.btnMedConfirm = (Button) itemView.findViewById(R.id.btn_med_confirm);
        holder.btnSetName = (Button) itemView.findViewById(R.id.btnSetName);

        holder.btnSetName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                medName = holder.medListEdt.getText().toString();
                Toast.makeText(context, "약 이름 설정 완료", Toast.LENGTH_LONG).show();
                Log.e(TAG + "약이름추가", medName);
            }
        });



        /*
        뷰가지고 와서 이걸 서버에 넘겨야 한다.
        여기서 작업을 해야함
         */

        holder.btnMedConfirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveMedFormDataToServer(holder.medListEdt);
            }
        });


        holder.btnSetAlarm.setOnClickListener(this);
        holder.btnSetDate.setOnClickListener(this);

        return itemView;
    }

    // 약 이름 , 투약 알림 시간 ( 시 : (int) 1,2,3 / 분 : (int) 1,2,3 ) , 투약 시작 날짜 (Date startDate) , 투약 종료 날짜 (Date endDate) 입력 --> 서버 전송
    private void saveMedFormDataToServer(EditText medListEdt) {
        network = Network.getNetworkInstance();
        String LTID = guardNameStorage.getUserLTID("LTID");
        Log.e(TAG, "LTID : " + LTID);
        Log.i(TAG + ":" + "최종 확인", "[시]" + medListEdt.getText().toString() + "/" + hours.get(0) + "/" + hours.get(1) + "/" + hours.get(2)
                + "[분]" + minutes.get(0) + "/" + minutes.get(1) + "/" + minutes.get(2) + "[시작 날짜]" + "[" + startDate + "]" +
                "[종료 날짜]" + "[" + endDate + "]");
        network.getMedProxy().setMedFormDataToServer(LTID, medName, hours, minutes, startDate, endDate, new Callback<MedForm>() {
            @Override
            public void onResponse(Call<MedForm> call, Response<MedForm> response) {
                if (response.isSuccessful()) {
                    Log.i(TAG, response.body().toString() + "입니다.");
                    context.startActivity(new Intent(context, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY));
                }
            }

            @Override
            public void onFailure(Call<MedForm> call, Throwable t) {
                Log.e(TAG, "서버 전송 실패");
            }
        });
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnSetAlarm:
                setAlarmBox();
                break;
            case R.id.btnSetDate:
                setCalendar();
                break;
        }
    }


    private void setAlarmBox() {
        final AlertDialog.Builder alarmBox = new AlertDialog.Builder(context);
        final View alarmView = LayoutInflater.from(context).inflate(R.layout.activity_med_form1, null);
        alarmBox.setView(alarmView); // 알람 설정
        final TimePicker timePicker = (TimePicker) alarmView.findViewById(R.id.medTimePicker);
        alarmBox.setTitle("투약 알림 시간 설정");
        alarmBox.setMessage("세 차례 알림 설정 해주세요");
        alarmBox.setPositiveButton("설정완료", new AlarmListener(timePicker));

        alarmBox.show();

    }

    private class AlarmListener implements DialogInterface.OnClickListener {
        private TimePicker timePicker;

        public AlarmListener(TimePicker timePicker) {
            this.timePicker = timePicker;
        }

        @Override
        public void onClick(DialogInterface dialog, int which) {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                int hour = timePicker.getHour();
                int minute = timePicker.getMinute();
                setAlarmTime(hour, minute);
            }
            dialog.dismiss();
        }
    }

    private void setAlarmTime(int hour, int minute) {
        Log.i(TAG, hour + ":" + minute);
        if (index < 3) {
            hours.add(index, hour); // 시간 저장
            minutes.add(index, minute); // 분 저장
            index += 1;
        } else {
            index = 0;
            Toast.makeText(context, "더이상 설정할 수 없습니다.", Toast.LENGTH_LONG).show();
        }
    }

    private void setCalendar() {
        final AlertDialog.Builder dlg2 = new AlertDialog.Builder(context);
        final View calView = LayoutInflater.from(context).inflate(R.layout.activity_med_form2, null);
        dlg2.setView(calView);
        dlg2.setTitle("날짜 설정하기");
        if (index2 == 0) {
            dlg2.setMessage("시작 날짜를 선택해주세요");
        } else {
            dlg2.setMessage("종료 날짜를 선택해주세요");
        }

        final CalendarView calendar = (CalendarView) calView.findViewById(R.id.medCalendar);
        calendar.setOnDateChangeListener(new CalendarView.OnDateChangeListener() {
            @Override
            public void onSelectedDayChange(CalendarView view, int year, int month, int dayOfMonth) {
//                SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd", Locale.KOREAN);
                if (index2 == 0) {
                    Calendar cal = Calendar.getInstance();
                    cal.set(Calendar.YEAR, year);
                    cal.set(Calendar.MONTH, month);
                    cal.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                    startDate = cal.getTime();

                    Log.i(TAG + "startDate", String.valueOf(startDate));
                    index2 = 1;
                } else {
                    Calendar cal = Calendar.getInstance();
                    cal.set(Calendar.YEAR, year);
                    cal.set(Calendar.MONTH, month);
                    cal.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                    endDate = cal.getTime();

                    Log.i(TAG + "endDate", String.valueOf(endDate));
                    index2 = 0;
                }
            }
        });
        dlg2.setPositiveButton("설정 확인", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if (index2 == 1)
                    Toast.makeText(context, "시작 시간이 설정되었습니다.", Toast.LENGTH_LONG).show();
                else
                    Toast.makeText(context, "종료 시간이 설정되었습니다.", Toast.LENGTH_LONG).show();
            }
        });
        dlg2.show();
    }
}
