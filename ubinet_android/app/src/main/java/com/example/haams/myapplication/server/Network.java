package com.example.haams.myapplication.server;

import com.example.haams.myapplication.data.Guard;
import com.example.haams.myapplication.data.User;
import com.example.haams.myapplication.proxy.AdminProxy;
import com.example.haams.myapplication.proxy.GuardProxy;
import com.example.haams.myapplication.proxy.MedProxy;
import com.example.haams.myapplication.proxy.UserProxy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kakao.usermgmt.response.model.UserProfile;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by haams on 2017-06-29.
 */

public class Network {
    public static Network network;
    private Retrofit retrofit;
    private AdminProxy adminProxy;
    private MedProxy medProxy;
    private GuardProxy guardProxy;
    private UserProxy userProxy;

    public static Network getNetworkInstance() {
        if (network == null) {
            network = new Network();
        }
        return network;
    }

    public Network() {
        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();
        Gson gson = new GsonBuilder().setLenient().create();

        retrofit = new Retrofit.Builder().baseUrl("http://52.79.83.51:2721/")
                .addConverterFactory(GsonConverterFactory.create(gson))
                .client(httpClient.build()).build();

        adminProxy = new AdminProxy(retrofit);
        medProxy = new MedProxy(retrofit);
        guardProxy = new GuardProxy(retrofit);
        userProxy = new UserProxy(retrofit);
    }

    public AdminProxy getAdminProxy() {
        return adminProxy;
    }

    public MedProxy getMedProxy() {
        return medProxy;
    }

    public GuardProxy getGuardProxy() {
        return guardProxy;
    }

    public UserProxy getUserProxy() {
        return userProxy;
    }
}
