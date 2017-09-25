package com.example.haams.myapplication.data;

/**
 * Created by haams on 2017-06-29.
 */

public class Admin {
    private String Ltid;
    private String Password;

    public Admin(String ltid, String password) {
        Ltid = ltid;
        Password = password;
    }

    public String getLtid() {
        return Ltid;
    }

    public String getPassword() {
        return Password;
    }
}
