package com.example.haams.myapplication.proxy;

import com.example.haams.myapplication.data.Admin;
import com.example.haams.myapplication.server.Service;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;

/**
 * Created by haams on 2017-06-29.
 */

public class AdminProxy {
    private Service service;

    public AdminProxy(Retrofit retrofit) {
        service = retrofit.create(Service.class);
    }

    public void signUpWithLtid(String Ltid, String Password, Callback<Admin> callback) {
        Call<Admin> call = service.signUpWithLtid(Ltid, Password);
        call.enqueue(callback);
    }
}
