package com.example.haams.myapplication.proxy;

import com.example.haams.myapplication.data.Guard;
import com.example.haams.myapplication.server.Service;
import com.mapbox.services.android.ui.geocoder.GeocoderAutoCompleteView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;

/**
 * Created by haams on 2017-09-04.
 */

public class GuardProxy {
    private Service service;
    public GuardProxy(Retrofit retrofit){
        service = retrofit.create(Service.class);
    }
    public void saveGuardInfoToServer(String LTID, String name, Callback<Guard> callback){
        Call<Guard> call = service.saveGuardInfoToServer(LTID,name);
        call.enqueue(callback);
    }
    public void saveGuardNameToServer(String name,Callback<Guard> callback){
        Call<Guard> call = service.loginGuardName(name);
        call.enqueue(callback);
    }
}
