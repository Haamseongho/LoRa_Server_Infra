package com.example.haams.myapplication.sign_up;

import android.app.Activity;
import android.app.Application;
import android.content.Context;

import com.kakao.auth.ApprovalType;
import com.kakao.auth.AuthType;
import com.kakao.auth.IApplicationConfig;
import com.kakao.auth.ISessionConfig;
import com.kakao.auth.KakaoAdapter;
import com.kakao.auth.KakaoSDK;
import com.facebook.*;

/**
 * Created by haams on 2017-07-26.
 */

public class GlobalApplication extends Application {
    private static volatile GlobalApplication instance = null;
    private static volatile Activity currentActivity = null;

    public static GlobalApplication getGlobalApplicationContext() {
        if(instance == null)
            throw new IllegalStateException("앱 상속 실패");
        return instance;
    }

    public static Activity getCurrentActivity() {
        return currentActivity;
    }

    public static void setCurrentActivity(Activity currentActivity) {
        GlobalApplication.currentActivity = currentActivity;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        KakaoSDK.init(new KakaoSDKAdapter());
    }

    private static class FacebookSDKAdapter extends FacebookActivity{

    }


    private static class KakaoSDKAdapter extends KakaoAdapter{
        // KakaoSDKAdapter는 Kakao와 관련된 SDK를 Application과 접목시켜 활용하고자
        // 사용하는 클래스입니다. 이는 KakaoAdapter를 상속받아 진행됩니다.
        // 여기서 어플리케이션 정보를 얻고 로그인을 위한 Session을 생성하빈다.
        // 관련된 추상 클래스를 변경함으로써 세션 정보를 달리 받을 수 있습니다.
        // 기본은 KakaoAdapter


        @Override
        public ISessionConfig getSessionConfig() { // Application 정보 그리고 Session 설정 정리
            return new ISessionConfig() {
                @Override
                public AuthType[] getAuthTypes() {
                    // 로그인시 인증받을 타입 지정 --> 카카오 로그인
                    return new AuthType[]{ AuthType.KAKAO_LOGIN_ALL };
                }

                @Override
                public boolean isUsingWebviewTimer() {
                    // SDK로그인 시 사용되는 WebView 진행 시 pause나 resume이 진행될 경우
                    // 타이머 설정으로 cpu 소모를 절약하는 방법
                    // true면 타이머 설정해야한다. (CPU 소모 방지)
                    return false;
                }

                @Override
                public ApprovalType getApprovalType() {
                    /*
                    일반 사용자가 아닌 Kakao의 제후된 앱에서 사용되는 값으로
                    값을 채워주지 않을 경우 ApprovalType.INDIVIDUAL 값을 사용한다.
                     */
                    return ApprovalType.INDIVIDUAL;
                }

                @Override
                public boolean isSaveFormData() {
                    // Kakao SDK에서 사용되는 WebView에서 email 입력폼에 데이터 save 할 지 여부 결정
                    return true;
                }

            };

        }

        @Override
        public IApplicationConfig getApplicationConfig() {
            return new IApplicationConfig() {
                @Override
                public Activity getTopActivity() {
                    return GlobalApplication.getCurrentActivity();
                }

                @Override
                public Context getApplicationContext() {
                    return GlobalApplication.getGlobalApplicationContext();
                }
            };
        }
    }


}
