### TinyGPS 
---
- GPS센서 역할을 하여 기본적으로 위도와 경도를 측정하여 제공해준다.

## Download 

<a href="http://arduiniana.org/libraries/tinygps/"> TinyGPS 라이브러리 다운로드 및 예제 설명 </a>


---

### 사용 센서 
<br />

<img src="../images/tinyGPS.JPG"/>


<br />

### 작업 순서 

---

1 .위 링크를 따라 tinyGPS 라이브러리를 다운로드 받는다

2 .아래 그림 처럼 zip파일로 받은 라이브러리를 아두이노에 추가한다.

<br />
<img src="../images/tinyGPS_library_added.JPG"/> 

3 .추가한 라이브러리는 include를 써서 사용할 수 있다

```

	#include <TinyGPS.h>
	TinyGPS gps;

	#include <SoftwareSerial.h>
	//GPS는 UART를 사용하지 않고 Serial 사용해 통신하기 떄문에  Serial라이브러리 사용


```

4 . 시리얼 통신으로 Software Serial 사용 - 핀 번호 설정 
```

	
	SoftwareSerial ss(0, 1); 
	//Built-in 된 Serial 통신을 원할 경우 Software Serial 을 사용하여 0,1 핀 사용 설정

	

```

5 . TinyGPS 객체에 시리얼 통신으로 읽어 온 정보를 인코딩하여 넣는다.

```

	static void smartdelay(unsigned long ms)
	{
  		unsigned long start = millis();// millis는 현재시간을 밀리단위로 리턴 
                            // 이를 이용해 시작 시간 확인  
  		do 
  		{
    	while (ss.available()) //시리얼 읽어 올 수 있는 상태인지 확인하고
      		gps.encode(ss.read()); // encode가 true반환 하면 읽어온 값으로 값 변경 
  		} while (millis() - start < ms);
	// 시작 시간으로 부터 얼마나 지난지 확인 위치 입력한 delay보다 작은 범위에서 나오도록
	}


```

6 . GPS 측정 값을 얻어와서 SoftwareSerial 통신을 통해 값을 시리얼 모니터로 출력 

```

	static void print_float(float val, float invalid, int len, int prec)
	{
  		if (val == invalid) // GPS의 위치가 잡히지 않는 경우 ***로 출력
  		{
    		while (len-- > 1)
      			Serial.print('*');
    		Serial.print(' ');
  		}
  		Else // 위치가 잡힌 경우 매개변수 length 만큼 
  		{
    		Serial.print(val, prec);
    		int vi = abs((int)val); //  gps.f_get_position 으로 얻어온 위치를 절대값으로 변환
    		int flen = prec + (val < 0.0 ? 2 : 1); 
    		flen += vi >= 1000 ? 4 : vi >= 100 ? 3 : vi >= 10 ? 2 : 1;  
		// . 삼항 연산자를 통해 길이 조절
    		for (int i=flen; i<len; ++i)
      			Serial.print(' ');
  		}
  		smartdelay(0);
	}


	// GPS의 오차와 값이 타당한지 검사 후 사용자에 맞춰 길이 조절하여 출력

```

--- 

cf. (별첨) ***  Wire라이브러리 : 심박 데이터 측정 

> Wire 라이브러리를 통해서 심박센서를 통해 1바이트씩 받아온 값 읽어와 시리얼 모니터 출력



```

	#include <Wire.h>
	//Wire를 이용 SDA, SCL 통신해서 값 가져올수 있도록 라이브러리 사용
	Wire.begin();
	Wire.requestFrom(0xA0 >> 1, 1); // SDA, SCL에 1바이트씩 요구해서 받아 옴
	rateValue = Wire.read(); //< I2C를 통해 요청한 심박 데이터 읽어옴



```

---


### 참조 자료 및 사이트

<a href="http://arduiniana.org/libraries/tinygps/"> 라이브러리 소개 및 다운로드(위 링크와 같음) </a>

---
