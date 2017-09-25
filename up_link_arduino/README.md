## UP-link 코드 소개 

### Up-link란?

- Lora 모듈을 통해서 센서에 의해 감지된 데이터를 SK-IOT 네트워크 망인 LoRa망에 전송하는 개념 (ThingPlug server)

<img src="../images/app_uplink.JPG" /> 


<br />

> UpLink
> 
- 연결 되어 있는 여러 디바이스나 추적(Tracking) 및 모니터링 
등여러 센서에 의해 작업한 내용을 ThingPlug서버로 보내는 것
- AT+SEND 명령어로 전송한다 (LoRa모듈을 거쳐 ThingPlug서버로)
- 전송 시에 앞에 두 자리는 Hexa String으로 보내기 때문에 빼줘야 한다.

### 아두이노 작업 (Up-Link)



```

	String data = "AT+SEND 01"; 
	...
	...

	gps.f_get_position(&flat, &flon, &age);
    print_float(flat, TinyGPS::GPS_INVALID_F_ANGLE, 10, 6);
    print_float(flon, TinyGPS::GPS_INVALID_F_ANGLE, 11, 6);
    Serial.println(rateValue);

	
	
```

- gps 측정 데이터 : flat(위도) , flon(경도)


```

	  String fstring = "0";
  	  String enter = "\r\n";
	

```

데이터 전송 시 앞에 두 자리는 Hexa Data이기 때문에 빼주고 계산해야 하며 LoRa모듈로 전송 시에는 보낼 데이터 마지막에 개행과 띄어쓰기를 붙여서 보내야 합니다. 

```

	  data += String(slat);
      data += String(slon);
      data += fstring;
      data += enter;

      Serial.println(data);
      Serial3.println(data);


```

data는 앞서 "AT+SEND 01"이고 여기다가 위도와 경도를 각각 붙인 다음 개행과 띄어쓰기를 추가로 붙여줍니다.

이를 시리얼 통신으로 데이터 전송을 합니다. 
이렇게 진행할 경우 LoRa모듈을 통해서 ThingPlug서버로 전송됩니다.

전송된 데이터는 Polling방식 또는 Subscription방식을 통해서 
Application server로 받아와서 작업하게 됩니다.

작업하여 정리된 데이터는 클라이언트에게 제공될 서비스가 됩니다.