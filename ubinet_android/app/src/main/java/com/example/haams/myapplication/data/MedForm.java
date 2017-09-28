package com.example.haams.myapplication.data;

import java.util.ArrayList;
import java.util.Date;

/**
 * Created by haams on 2017-08-06.
 */

public class MedForm {
    private String LTID;
    private String medName;   // 약 명칭
    private ArrayList<Integer> alarmHour; // 알림 시
    private ArrayList<Integer> alarmMin; // 알림 분
    private Date startDate; // 복용 시작 날짜
    private Date endDate;   // 복용 종료 날짜

    public MedForm(String LTID, String medName, ArrayList<Integer> alarmHour, ArrayList<Integer> alarmMin, Date startDate, Date endDate) {
        this.LTID = LTID;
        this.medName = medName;
        this.alarmHour = alarmHour;
        this.alarmMin = alarmMin;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public MedForm(String medName, ArrayList<Integer> alarmHour, ArrayList<Integer> alarmMin, Date startDate, Date endDate) {
        this.medName = medName;
        this.alarmHour = alarmHour;
        this.alarmMin = alarmMin;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getLTID() {
        return LTID;
    }

    public String getMedName() {
        return medName;
    }

    public ArrayList<Integer> getAlarmHour() {
        return alarmHour;
    }

    public ArrayList<Integer> getAlarmMin() {
        return alarmMin;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }
}
