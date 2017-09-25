package com.example.haams.myapplication.sms;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by haams on 2017-08-28.
 */

public class RandomAuthNumber {
    Context context;

    public RandomAuthNumber(Context context) {
        this.context = context;
    }
    public void saveAuthRandNum(String key,String authNum){
        SharedPreferences prefs = context.getSharedPreferences("prefs",Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(key,authNum);
        editor.commit();
    }

    public String getAuthRandNum(String key){
        SharedPreferences prefs = context.getSharedPreferences("prefs",Context.MODE_PRIVATE);
        return prefs.getString(key,"");
    }
}
