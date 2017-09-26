package com.example.haams.myapplication.proxy;

import com.example.haams.myapplication.data.MedForm;
import com.example.haams.myapplication.server.Service;

import java.util.ArrayList;
import java.util.Date;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;

/**
 * Created by haams on 2017-08-17.
 */

public class MedProxy {
    private Service service;

    public MedProxy(Retrofit retrofit) {
        service = retrofit.create(Service.class);
    }

    public void setMedFormDataToServer(String LTID,String medName, ArrayList<Integer> hours, ArrayList<Integer> minutes, Date startDate, Date endDate , Callback<MedForm> callback) {
        Call<MedForm> call = service.setMedFormDataToServer(LTID,medName,hours,minutes,startDate,endDate);
        call.enqueue(callback);
    }
}
