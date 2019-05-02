var http = require('http');

var options = {
    hostname:'localhost',
    port: '8080'
};

function handleResponse(response){//서버의 응답을 받았을 때 발생하는 response 이벤트
    var serverData = '';
    response.on('data', function (chunk){//'data' 이벤트 이름, 타입 , on 메소드는 이벤트를 연결하는 메소드
        serverData += chunk;
    });
    response.on('end', function(){
        console.log("Response Status:", response.statusCode);
        console.log("Response Headers:", response.headers);
        console.log(serverData);
    });
}
http.request(options, function(response){//1
    handleResponse(response);
}).end();