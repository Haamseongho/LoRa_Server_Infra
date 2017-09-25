package com.example.haams.myapplication.sign_up;

import android.content.Context;
import android.content.SharedPreferences;

import static android.content.Context.MODE_PRIVATE;

/**
 * Created by haams on 2017-08-05.
 */

public class TokenStorage {
    Context context;

    public TokenStorage(Context context) {
        this.context = context;
    }

    public void savePreferences(String key, String value) {
        SharedPreferences pref = context.getSharedPreferences("pref", MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public String getPreferences(String key) {
        SharedPreferences pref = context.getSharedPreferences("pref", MODE_PRIVATE);
        return pref.getString(key, "");
    }

    public void removePreferences(String key) {
        SharedPreferences pref = context.getSharedPreferences("pref", MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.remove(key);
        editor.commit();
    }
}
