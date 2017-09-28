package com.example.haams.myapplication.listener;

import android.content.Context;
import android.content.SharedPreferences;

import static android.content.Context.MODE_PRIVATE;

/**
 * Created by haams on 2017-08-06.
 */

public class IndexSendMsg {
    Context context;

    public IndexSendMsg(Context context) {
        this.context = context;
    }

    public void savePreferences(String key, int value) {
        SharedPreferences pref2 = context.getSharedPreferences("pref2", MODE_PRIVATE);
        SharedPreferences.Editor editor = pref2.edit();
        editor.putInt(key, value);
        editor.commit();
    }

    public int getPreferences(String key) {
        SharedPreferences pref2 = context.getSharedPreferences("pref2", MODE_PRIVATE);
        return pref2.getInt(key, 0);
    }

    public void removePreferences(String key) {
        SharedPreferences pref2 = context.getSharedPreferences("pref2", MODE_PRIVATE);
        SharedPreferences.Editor editor = pref2.edit();
        editor.remove(key);
        editor.commit();
    }
}
