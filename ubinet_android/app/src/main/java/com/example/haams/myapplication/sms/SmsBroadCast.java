package com.example.haams.myapplication.sms;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.UnsupportedSchemeException;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.telephony.SmsMessage;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.haams.myapplication.MainActivity;
import com.example.haams.myapplication.R;

/**
 * Created by haams on 2017-08-28.
 */

public class SmsBroadCast extends BroadcastReceiver {

    String authStr = null;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")) {
            Intent smsIntent = new Intent(context,
                    CheckAuthNumber.class);

            smsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(smsIntent);
        }
    }
}
