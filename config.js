module.exports = {
  AppEUI : '0000000000000004',                   		// Application EUI
  DevEUI : 'd02544fffef0018',								// Device EUI
  version : 'v1_0',                             	// Application의 version
  TPhost : 'onem2m.sktiot.com',      				// ThingPlug의 HOST Addresss
  TPport : '9000',                             		// ThingPlug의 HTTP PORT 번호

    responseAddress : 'http://52.79.83.51',         	// HTTP버전에서 디바이스 제어를 위한 디바이스의 물리적 주소 mga
    responsePORT : '2721',                          	// HTTP버전에서 디바이스제어를 위한 디바이스의 물리적 주소의 로컬 포트

    userID : 'genius9208',                            	// MQTT버전에서 Broker 접속을 위한 ID, 포털 ID 사용
    mqttClientId : function(){						// MQTT버전에서 Broker 접속을 위한 client ID(ex : ThingPlugID_0001)
        var POST_FIX = 'ThingPlugID_0001';
        return this.userID+'_'+POST_FIX;
    },


    nodeID : '00000004d02544fffef00189',         	// Device 구분을 위한 LTID, 디바이스 고유 ID 사용
    passCode : '920803',                          	// ThingPlug에 Device등록 시 사용할 Device의 비밀번호
    uKey : 'Nk9pWGxHOUFtaDFkaXVFVTlNcEVXOTJtNy9jT2liY2JRUTBQa2tTM1FxMFB6cWhHTE02ZnJHNlJwaW9WaUdtWg==',

    containerName:'LoRa',                         	// starter kit에서 생성하고 사용할 container 이름 (임의지정)
    DevReset : 'DevReset',                        	// starter kit에서 생성하고 사용할 제어 명령 DevReset
    extDevMgmt : 'extDevMgmt',						// starter kit에서 생성하고 사용할 제어 명령 extDevMgmt
  
  UPDATE_CONTENT_INTERVAL : 1000,					//contentInstance 생성주기
  
  content : function(data){
     var receivedData = data.cid;
     return receivedData; 
}
};


