package com.example.haams.myapplication.server;

import com.example.haams.myapplication.data.Admin;
import com.example.haams.myapplication.data.Guard;
import com.example.haams.myapplication.data.MedForm;
import com.example.haams.myapplication.data.User;

import java.util.ArrayList;
import java.util.Date;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

/**
 * Created by haams on 2017-06-29.
 */

public interface Service {
    /*
    부양자녀 --> LTID == 디바이스 사용자(노인들) LTID
    Password는 제공해줄 예정정     */
    @FormUrlEncoded
    @POST("/admin/signup")
    public Call<Admin> signUpWithLtid(
            @Field("Ltid") String Ltid,
            @Field("Password") String Password
    );

    /*
    보호자(guard) - 로그인 시 (sns 계정 로그인 -> 이름 뽑아오기 ) /
     */
    @FormUrlEncoded
    @POST("/guard/insertinfo")
    public Call<Guard> saveGuardInfoToServer(
            @Field("LTID") String LTID,
            @Field("name") String name
    );

    @GET("/user/getLTID")
    public Call<User> getUserPhoneNumber(
            @Query("tel") String tel
    );

    @FormUrlEncoded
    @POST("/medform/insert")
    public Call<MedForm> setMedFormDataToServer(
            @Field("LTID") String LTID,
            @Field("medName") String medName,
            @Field("alarmHour") ArrayList<Integer> alarmHour,
            @Field("alarmMin") ArrayList<Integer> alarmMin,
            @Field("startDate") Date startDate,
            @Field("endDate") Date endDate
    );

    // LTID 전송 --> dynamicData 확인 // 위치 버튼 누를 때 LTID 보내서    // up-link로 따로 받기 때문에 (위도,경도,맥박) 앱에서 보내야할 정보는

    // 유저 정보의 LTID와 dynamicData의 LTID 비교하고 일치하면
    // dynamicData의 정보들을 뽑아내서 사용자 정보 갱신할 것
    // LTID가 전부다.

    @FormUrlEncoded
    @POST("/user/dynamics")
    public Call<User> sendLTIDToServer(
            @Field("LTID") String LTID
    );

    @GET("/user/spotinfo")
    public Call<User> getLatLngByLTIDFromServer(
            @Query("LTID") String LTID
            // LTID 보내서 위도 경도 뽑아오기 --> MapActivity.class에서 사용
    );

    @FormUrlEncoded
    @POST("/guard/login")
    public Call<Guard> loginGuardName(
            @Field("name") String name
    );
}
