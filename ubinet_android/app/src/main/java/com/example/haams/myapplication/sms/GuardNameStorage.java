package com.example.haams.myapplication.sms;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by haams on 2017-09-04.
 */

public class GuardNameStorage {
    private Context context;

    public GuardNameStorage(Context context) {
        this.context = context;
    }

    public void saveUserName(String key, String value) {
        SharedPreferences pref = context.getSharedPreferences("pref", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public String getUserName(String key) {
        SharedPreferences pref = context.getSharedPreferences("pref", Context.MODE_PRIVATE);
        return pref.getString(key, "");
    }

    public void saveUserNumber(String key, String value) {
        SharedPreferences pref2 = context.getSharedPreferences("pref2", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref2.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public String getUserNumber(String key) {
        SharedPreferences pref2 = context.getSharedPreferences("pref2", Context.MODE_PRIVATE);
        return pref2.getString(key, "");
    }

    public void saveUserLTID(String key,String value){
        SharedPreferences pref3 = context.getSharedPreferences("pref3",Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref3.edit();
        editor.putString(key,value);
        editor.commit();
    }
    public String getUserLTID(String key){
        SharedPreferences pref3 = context.getSharedPreferences("pref3",Context.MODE_PRIVATE);
        return pref3.getString(key,"");
    }
}
