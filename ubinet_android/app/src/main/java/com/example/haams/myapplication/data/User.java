package com.example.haams.myapplication.data;

import java.util.ArrayList;

/**
 * Created by haams on 2017-09-04.
 */

public class User {
    private String LTID;
    private double lat;
    private double lon;
    private String tel;
    private ArrayList<MedForm> medFormList;
    private double pulse;

    public User(String LTID, double lat, double lon, String tel, ArrayList<MedForm> medFormList, double pulse) {
        this.LTID = LTID;
        this.lat = lat;
        this.lon = lon;
        this.tel = tel;
        this.medFormList = medFormList;
        this.pulse = pulse;
    }

    public String getLTID() {
        return LTID;
    }

    public double getLat() {
        return lat;
    }

    public double getLon() {
        return lon;
    }

    public String getTel() {
        return tel;
    }

    public ArrayList<MedForm> getMedFormList() {
        return medFormList;
    }

    public double getPulse() {
        return pulse;
    }

    public void setLTID(String LTID) {
        this.LTID = LTID;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public void setMedFormList(ArrayList<MedForm> medFormList) {
        this.medFormList = medFormList;
    }

    public void setPulse(double pulse) {
        this.pulse = pulse;
    }
}
