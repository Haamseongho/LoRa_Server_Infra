package com.example.haams.myapplication.proxy;

import com.example.haams.myapplication.data.User;
import com.example.haams.myapplication.server.Service;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;

/**
 * Created by haams on 2017-09-04.
 */

public class UserProxy {
    private Service service;

    public UserProxy(Retrofit retrofit) {
        service = retrofit.create(Service.class);
    }

    // 전화번호로 LTID 가지고오기.
    public void getLTIDByTelNum(String tel, Callback<User> callback) {
        Call<User> call = service.getUserPhoneNumber(tel);
        call.enqueue(callback);
    }

    public void sendLTIDToServerForDynamicData(String LTID,Callback<User> callback){
        Call<User> call = service.sendLTIDToServer(LTID);
        call.enqueue(callback);
    }
    // -- User 정보 / Dynamic 정보 (LTID) 비교

    public void getLatLngByLTIDFromServer(String LTID,Callback<User> callback){
        Call<User> call = service.getLatLngByLTIDFromServer(LTID);
        call.enqueue(callback);
    }
    // -- LTID 정보로 user의 lat,lon 뽑아오기
}
