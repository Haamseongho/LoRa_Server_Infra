package com.example.haams.myapplication.server.firebase;

import android.util.Log;
import android.widget.Toast;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

/**
 * Created by haams on 2017-07-27.
 */

public class MyFirebaseInstanceIDService extends FirebaseInstanceIdService {
    private static final String TAG = "firebaseID";

    @Override
    public void onTokenRefresh() {
        super.onTokenRefresh();
        String refreshToken = FirebaseInstanceId.getInstance().getToken();
       // Toast.makeText(MyFirebaseInstanceIDService.this,refreshToken,Toast.LENGTH_LONG).show();
        Log.d(TAG,  " refreshToken = " + refreshToken);
    }
}
