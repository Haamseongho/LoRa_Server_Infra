package com.example.haams.myapplication.database;

import android.content.Context;
import android.database.Cursor;
import android.database.DatabaseErrorHandler;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.Date;

/**
 * Created by haams on 2017-08-15.
 */

public class DBHelper extends SQLiteOpenHelper {

    public DBHelper(Context context, String name, SQLiteDatabase.CursorFactory factory, int version) {
        super(context, name, factory, version);
    }

    public DBHelper(Context context, String name, SQLiteDatabase.CursorFactory factory, int version, DatabaseErrorHandler errorHandler) {
        super(context, name, factory, version, errorHandler);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String createSQL = "CREATE TABLE medTable (_id INTEGER PRIMARY KEY AUTOINCREMENT, medName TEXT, hour INTEGER, minute INTEGER, startDate VARCHAR, endDate VARCHAR);";
        db.execSQL(createSQL);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }

    public void insertMedName(String medName) {
        SQLiteDatabase db = getWritableDatabase();
        db.execSQL("INSERT INTO medTable VALUES(null, '" + medName + "','" + null + "','" + null + "','" + null + "','" + null + "');");
        db.close();
    }

    public void insertMedForm(String medName, int[] hours, int[] minutes, String startDate, String endDate) {
        SQLiteDatabase db = getWritableDatabase();
        db.execSQL("INSERT INTO medTable VALUES(null,'" + medName + "','" + hours + "','" + minutes + "','" + startDate + "','" + endDate + "');");
        db.close();
    }

/*
    public void updateMedForm(String medName, int time, int date) {
        SQLiteDatabase db = getWritableDatabase();+

        db.execSQL("UPDATE medTable SET alarmTime= '" + time + "', alarmDate='" + date + "' WHERE medName = '" + medName + "');");
        // 약 이름 가지고 날짜 및 시간 조정
        db.close();
    }
*/

    public String selectMedDataByName(String medName) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM medTable WHERE medName= '" + medName + "'", null);
        String result = "";
        while (cursor.moveToNext()) {
            result += "약 이름:" + cursor.getString(1) + "\n"
                    + "시작 날짜  : " + cursor.getString(4) + "\n"
                    + "종료 날짜 : " + cursor.getString(5) + "\n";
        }
        db.close();
        return result;
    }
}

