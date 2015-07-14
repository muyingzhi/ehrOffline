define(['services/services'
], function(services) {
    services.service("FtpDownloadService", ['$q', '$rootScope', 
        function($q, $rootScope) {
            // 1、默认配置
            var ftp = {
                host: "192.168.1.124",
                port: "21",
                user: "ftpuser",
                pwd: "123456",
                ocx: ""
            };
            // 2、ftp初始化
            this.init = function(ftpConfig) {
            	$.extend(ftp,ftpConfig);
            }
            // 3、ftp下载文件
            this.downloadFile = function(serverPath, localPath) {
                var result = false;
            	if(ftpCheckConnect() == true){
                    if(ftpGetFile(serverPath,localPath) == true){
                        result = true;
                    }
                }
                ftpDisconnect();
                return result;
            }
            // 4、ftp测试连接
            this.testConnect = function(ftpConfig) {
            	init(ftpConfig);
            	if(ftpCheckConnect() == true){
                	if(ftpGetState()!=0){
                		alert("ftp连接成功");
                	}
                }
            }
            
            function ftpGetState(){
                return ftp.ocx.state;
            }
            function ftpDisconnect(){
                try{
                    ftp.ocx.disconnect();
                }catch (e){

                }
            }
            //检查ftp连接
            function ftpCheckConnect(){
                var result = true;
            	if(ftpGetState()==0){
            		if(ftpConnect() == true){
                        result = true
                    }else{
                        result = false;
                    }
            	}
                return result;
            }
            //连接ftp服务器
            function ftpConnect() {
                try {
                    ftp.ocx.Host = ftp.host;
                    ftp.ocx.Port = ftp.port;
                    ftp.ocx.Connect(ftp.user, ftp.pwd);
                    return true;
                } catch (e) {
                    alert("ftp连接失败; "+e.description);
                    return false;
                }
            }
            //下载ftp服务器上的文件
            function ftpGetFile(serverPath,localPath) {
                try {
                    ftp.ocx.object.GetFile(serverPath,localPath);
                    return true;
                } catch (e) {
                    alert("下载ftp服务器上的文件失败； "+e.description);
                    return false;
                }
            }
        }
    ])
});