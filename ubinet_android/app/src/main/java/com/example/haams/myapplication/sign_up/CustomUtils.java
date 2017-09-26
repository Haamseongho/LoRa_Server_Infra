package com.example.haams.myapplication.sign_up;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by ho on 2016-08-09.
 */
public class CustomUtils {

    public static final Pattern VALID_EMAIL_ADDRESS_REGEX
            = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
    // 대소문자 구분

    public static boolean validateEmail(String emailStr) {
        Matcher matcher = VALID_EMAIL_ADDRESS_REGEX.matcher(emailStr);
        return matcher.find();
    }

    public static final Pattern VALID_PASSWOLD_REGEX_ALPHA_NUM
            = Pattern.compile("^[a-zA-Z0-9]{10,}$"); // 10자리 이상

    public static boolean validatePassword(String pwStr) {
        Matcher matcher = VALID_PASSWOLD_REGEX_ALPHA_NUM.matcher(pwStr);
        return matcher.matches();
    }

    public static final Pattern VALID_PHONENUM_REGEX
            = Pattern.compile("^01(?:0|1|[6-9]) - (?:\\d{3}|\\d{4}) - \\d{4}$");
    // 010 -  212 - ~~ 휴대폰 번호만 입력 가능하도록 설정.

    public static boolean validatePhoneNumber(String phoneNum) {
        Matcher matcher = VALID_PHONENUM_REGEX.matcher(phoneNum);
        return matcher.matches();
    }
}