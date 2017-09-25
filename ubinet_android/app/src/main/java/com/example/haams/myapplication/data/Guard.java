package com.example.haams.myapplication.data;

/**
 * Created by haams on 2017-09-04.
 */

public class Guard {
    private String name;
    private String LTID;

    public Guard(String name, String LTID) {
        this.name = name;
        this.LTID = LTID;
    }

    public String getName() {
        return name;
    }

    public String getLTID() {
        return LTID;
    }
}
