

var http = require('http');
var log=[],cnt=0;
function speak(dd){
    cnt++;
    log[cnt]=dd;
}
function print(){
    var st='',i;
    for(i=1;i<=cnt;i++){
        st=st+`console.log("${log[i]}");`
    }
    console.log(st);
    return st;
}
function baseForm(){
    return`
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
    <form method="post" onsubmit="return send()">
        <input type="text" name="message">
        <input type="submit">
    </form>
    <script type="text/javascript">
        function send(){
            return true;
        }
        ${print()}
    </script>
</body>
</html>
`
}
http.createServer(function (req, res){
    if(req.method=='POST'){
        req.on('data',(data)=>{
            speak(data);
            res.setHeader("Content-Type", "text/html");//req에 대한 res 전송
            res.writeHead(200);//statusCode의 이유
            res.end(baseForm());
        });
    }
    else if(req.method=='GET'){
        res.setHeader("Content-Type", "text/html");//req에 대한 res 전송
        res.writeHead(200);//statusCode의 이유
        res.end(baseForm());
    }
}).listen(8080);//서버 객체를 생성한 후 listen() 함수를 호출해 요청을 수신한다.
