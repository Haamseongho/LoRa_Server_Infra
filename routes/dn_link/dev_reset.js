/**
 * Created by haams on 2017-10-04.
 */
var http = require("https");

module.exports = function (LTID) {
    console.log(LTID + "__devReset");
    var options = {
        "method": "put",
        "hostname": "thingplugpf.sktiot.com",
        "port": "9443",
        "path": "/9999991000000309/v1_0/mgmtCmd-" + LTID + "_DevReset",
        "headers": {
            "accept": "application/xml",
            "x-m2m-ri": LTID+"_0012",
            "x-m2m-origin": LTID,
            "content-type": "application/vnd.onem2m-res+xml;ty=12",
            "ukey": "UXFQdEE1TkQzRU15Zlk1ay85SWNBSUNDek9DTFpmaWtXZnorTW1mT2lOTmhOMDcrRnhKN0FrRldOdGNSbHN4NA==",
            "cache-control": "no-cache",
	    "postman-token" : "35c289be-54cd-8e47-821a-9741743138d0"
           // "postman-token": "0d480701-cb4a-653f-3b96-b7dcd0a77f7d"
        }
    };
    var req = http.request(options,function (res) {
        var chunks = [];
        res.on('data',function (chunk) {
            chunks.push(chunk);
            for(var elem in chunks){
                console.log(chunks[elem]);
            }
        });
        res.on('end',function () {
            var body = Buffer.concat(chunks);
            console.log('//'+body.toString()+"입니다.");
        });
    });

    req.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<m2m:mgc \n    " +
        "xmlns:m2m=\"http://www.onem2m.org/xml/protocols\" \n    " +
        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n    " +
        "<exe>true</exe>\n    <exra></exra>\n</m2m:mgc>");
  
   req.end();

};
