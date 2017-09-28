package com.example.haams.myapplication.sub_activities;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.example.haams.myapplication.R;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.LatLng;
import com.mapbox.mapboxsdk.Mapbox;
import com.mapbox.mapboxsdk.maps.MapboxMap;
import com.mapbox.mapboxsdk.maps.OnMapReadyCallback;
import com.mapbox.services.android.navigation.v5.MapboxNavigation;
import com.mapbox.services.android.telemetry.location.LocationEngine;
import com.mapbox.services.commons.models.Position;
import com.mapbox.services.commons.utils.TextUtils;
import com.pubnub.api.PubNub;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

public class MapTrackActivity extends AppCompatActivity implements com.google.android.gms.maps.OnMapReadyCallback, OnMapReadyCallback {

    private GoogleMap gMap;
    private static final String TAG = "MapTrackActivity";
    double lat, lon;
    private static final String PUBLISH_KEY = "pub-c-545328a6-74e7-4435-b324-93df28e9855e";
    private static final String SUBSCRIBE_KEY = "sub-c-987d4508-8344-11e7-ac3a-f2b7c362e666";
    private PubNub mPubNub;
    private ArrayList<LatLng> mPoints = new ArrayList<>();
    private static final String channel = "test-channel-0.33636080802927126";
    private GoogleApiClient mGoogleApiClient;
    private com.mapbox.mapboxsdk.maps.MapView mapView;
    private MapboxMap mapBoxMap;
    private MapboxNavigation navigation;
    private LocationEngine locationEngine;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Mapbox.getInstance(this, getString(R.string.MapBox_Access_token));
         navigation = new MapboxNavigation(this,getString(R.string.MapBox_Access_token));
        setContentView(R.layout.activity_map_track);
        mapView = (com.mapbox.mapboxsdk.maps.MapView)findViewById(R.id.mapView);
        mapView.onCreate(savedInstanceState);
        mapView.getMapAsync(MapTrackActivity.this);


        //initPubNun();
       /* SupportMapFragment mapFragm ent = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.mapTrack);*/

        checkPermissionMap();

    }
    /*
     Log.i(TAG+"지도입니다.",origin+"/"+destination);
                MapboxDirectionsMatrix client = new MapboxDirectionsMatrix.Builder()
                        .setAccessToken(getString(R.string.MapBox_Access_token))
                        .setProfile(DirectionsCriteria.PROFILE_WALKING)
                        .setOrigin(origin).setDestination(destination)
                        .build();

                client.enqueueCall(new Callback<DirectionsMatrixResponse>() {
                    @Override
                    public void onResponse(Call<DirectionsMatrixResponse> call, Response<DirectionsMatrixResponse> response) {
                        Log.i(TAG,"client response well");
                        if(response.isSuccessful()){
                            Log.i(TAG,call.toString());

                        }
                    }

                    @Override
                    public void onFailure(Call<DirectionsMatrixResponse> call, Throwable t) {
                        Log.e(TAG,t.toString());
                    }
                });
     */

    private void initMapboxDirection() {

        final MapboxNavigation navigation = new MapboxNavigation(this,getString(R.string.MapBox_Access_token));

        final Position origin = Position.fromLngLat(36.2827,127.2381);
        final Position destination = Position.fromLngLat(37.1290,127.4328);

       /* navigation.addProgressChangeListener(new ProgressChangeListener() {
            @Override
            public void onProgressChange(Location location, RouteProgress routeProgress) {
                Log.i(TAG,location.getLatitude()+"/"+location.getLongitude());
            }
        });*/
       /* navigation.getRoute(origin, destination, new Callback<DirectionsResponse>() {
            @Override
            public void onResponse(Call<DirectionsResponse> call, Response<DirectionsResponse> response) {
            }

            @Override
            public void onFailure(Call<DirectionsResponse> call, Throwable t) {

            }
        });*/
    }


    @Override
    public void onStart() {
        super.onStart();
        mapView.onStart();
    }

    @Override
    public void onResume() {
        super.onResume();
        mapView.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        mapView.onPause();
    }

    @Override
    public void onStop() {
        super.onStop();
        mapView.onStop();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapView.onLowMemory();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mapView.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mapView.onSaveInstanceState(outState);
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
            lon = lastLocation.getLatitude();
            lat = lastLocation.getLongitude();

            //   Toast.makeText(getApplicationContext(), "GPS에서 위치를 받지 못하여 최근 위치로 표시합니다. "+ latitude + "\n" + longitude, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onMapReady(MapboxMap mapboxMap) {
        this.mapBoxMap = mapboxMap;

        initMapboxDirection();
        //new DrawGeoJson().execute();
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
      /*  googleMap.addMarker(new MarkerOptions().position(new LatLng(37.53421, 128.241324)).title("현재 위치").snippet("현재 위치"));
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(37.53421, 128.241324), 16));
        googleMap.animateCamera(CameraUpdateFactory.zoomTo(16));*/
    }


    // LocationListener --> 여기서 받은 lat,lon --> PubNub channel에 Broadcast할 것.
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

    private class DrawGeoJson extends AsyncTask<Void, Void, List<LatLng>> {
        @Override
        protected List<LatLng> doInBackground(Void... voids) {

            ArrayList<LatLng> points = new ArrayList<>();

            try {
                // Load GeoJSON file
                InputStream inputStream = getAssets().open("");
                BufferedReader rd = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("UTF-8")));
                StringBuilder sb = new StringBuilder();
                int cp;
                while ((cp = rd.read()) != -1) {
                    sb.append((char) cp);
                }

                inputStream.close();

                // Parse JSON
                JSONObject json = new JSONObject(sb.toString());
                JSONArray features = json.getJSONArray("features");
                JSONObject feature = features.getJSONObject(0);
                JSONObject geometry = feature.getJSONObject("geometry");
                if (geometry != null) {
                    String type = geometry.getString("type");

                    // Our GeoJSON only has one feature: a line string
                    if (!TextUtils.isEmpty(type) && type.equalsIgnoreCase("LineString")) {

                        // Get the Coordinates
                        JSONArray coords = geometry.getJSONArray("coordinates");
                        for (int lc = 0; lc < coords.length(); lc++) {
                            JSONArray coord = coords.getJSONArray(lc);
                            LatLng latLng = new LatLng(coord.getDouble(1), coord.getDouble(0));
                            points.add(latLng);
                        }
                    }
                }
            } catch (Exception exception) {
                Log.e(TAG, "Exception Loading GeoJSON: " + exception.toString());
            }

            return points;
        }


        @Override
        protected void onPostExecute(List<LatLng> points) {
            super.onPostExecute(points);

            if (points.size() > 0) {

                // Draw polyline on map
                Log.i(TAG+"/"+"Points" , String.valueOf(points));
                mapBoxMap.addPolyline(new com.mapbox.mapboxsdk.annotations.PolylineOptions())
                        .addPoint((com.mapbox.mapboxsdk.geometry.LatLng) points);
               /* mapBoxMap.addPolyline(new PolylineOptions()
                        .addAll(points)
                        .color(Color.parseColor("#3bb2d0"))
                        .width(2));*/
            }
        }
    }

    /*
    GPSListener
     */

    private class GPSListener implements LocationListener {

        @Override
        public void onLocationChanged(Location location) {
            lat = location.getLatitude();
            lon = location.getLongitude();
            broadcastLocation(location);
            // gps로 위도 경도 불러온 것
        }

        private void broadcastLocation(Location location) {
            JSONObject message = new JSONObject();

            try {
                message.put("lat", location.getLatitude());
                message.put("lon", location.getLongitude());
                message.put("alt", location.getAltitude());
            } catch (JSONException e) {
                e.printStackTrace();
            }


            //  mPubNub.publish("Channel_name",message,publishCallback);


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

}
