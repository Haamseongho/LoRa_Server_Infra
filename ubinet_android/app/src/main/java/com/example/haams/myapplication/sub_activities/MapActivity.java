package com.example.haams.myapplication.sub_activities;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.example.haams.myapplication.R;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

public class MapActivity extends AppCompatActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    double lat, lon;
    private static final String TAG = "MapActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map);

        initMap();
        checkPermissionMap();
    }

    private void initMap() {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                        .findFragmentById(R.id.gMap);
                MapsInitializer.initialize(MapActivity.this);
                mapFragment.getMapAsync(MapActivity.this);
            }
        }, 1000);

        lat = getIntent().getDoubleExtra("lat", 0.0);
        lon = getIntent().getDoubleExtra("lng", 0.0);
    }

    private void checkPermissionMap() {
        startLocationService();
        checkDangerousPermissions();
    }

    private void startLocationService() {
        LocationManager manager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        GPSListener gpsListener = new GPSListener();

        long minTime = 10000;
        float minDistance = 0;

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        manager.requestLocationUpdates(LocationManager.GPS_PROVIDER,
                minTime, minDistance, gpsListener);

        manager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER,
                minTime, minDistance, gpsListener);
        android.location.Location lastLocation = manager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        if (lastLocation != null) {
//            lon = lastLocation.getLatitude();
//            lat = lastLocation.getLongitude();

            //   Toast.makeText(getApplicationContext(), "GPS에서 위치를 받지 못하여 최근 위치로 표시합니다. "+ latitude + "\n" + longitude, Toast.LENGTH_SHORT).show();
        }
    }

    private class GPSListener implements LocationListener {

        @Override
        public void onLocationChanged(Location location) {
//            lat = location.getLatitude();
//            lon = location.getLongitude();
            // gps로 위도 경도 불러온 것
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {

        }

        @Override
        public void onProviderEnabled(String provider) {

        }

        @Override
        public void onProviderDisabled(String provider) {

        }
    }

    private void checkDangerousPermissions() {
        String[] permissions = {
                android.Manifest.permission.ACCESS_FINE_LOCATION,
                android.Manifest.permission.ACCESS_COARSE_LOCATION
        };

        int permissionCheck = PackageManager.PERMISSION_GRANTED;
        for (int i = 0; i < permissions.length; i++) {
            permissionCheck = ContextCompat.checkSelfPermission(this, permissions[i]);
            if (permissionCheck == PackageManager.PERMISSION_DENIED) {
                break;
            }
        }

        if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
            Log.i("googleMap", "권한 있음");
//            Toast.makeText(this, "권한 있음", Toast.LENGTH_LONG).show();
        } else {
            Log.e("googleMap", "권한 있음");
//            Toast.makeText(this, "권한 없음", Toast.LENGTH_LONG).show();

            if (ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[0])) {
                Log.e("googleMap", "권한 설명 필요");
//                Toast.makeText(this, "권한 설명 필요.", Toast.LENGTH_LONG).show();
            } else {
                ActivityCompat.requestPermissions(this, permissions, 1);
            }
        }
    }

    // GPS 권한 확인
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == 1) {
            for (int i = 0; i < permissions.length; i++) {
                if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                    // Toast.makeText(this, permissions[i] + " 권한이 승인됨.", Toast.LENGTH_LONG).show();
                } else {
                    // Toast.makeText(this, permissions[i] + " 권한이 승인되지 않음.", Toast.LENGTH_LONG).show();
                }
            }
        }
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        this.mMap = googleMap;
        mMap.getUiSettings().setZoomControlsEnabled(true);
        mMap.isTrafficEnabled();
        mMap.setBuildingsEnabled(true);
        mMap.setMapType(GoogleMap.MAP_TYPE_NORMAL);
        Log.i(TAG, String.valueOf(lat) + "/" + String.valueOf(lon));
        mMap.addMarker(new MarkerOptions().position(new LatLng(lat, lon)).title("현재 위치").snippet("현재 위치"));
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(lat, lon), 16));
        mMap.animateCamera(CameraUpdateFactory.zoomTo(16));
        //googleMap.moveCamera(CameraUpdateFactory.newLatLng());
    }
}
