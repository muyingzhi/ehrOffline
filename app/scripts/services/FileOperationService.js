define(['services/services'], function(services) {
    services.service("FileOperationService", ['$rootScope',
        function($rootScope) {
            var fso;
            checkSupported = function(){
        	    var supported = true;
                if ("ActiveXObject" in window) {
                    fso = new ActiveXObject("Scripting.FileSystemObject");
                    supported = true;
                }else{
                    supported = false;
                    alert("该浏览器不支持ActiveXObject，请更换至IE10或更高版本IE浏览器");
                }
                return supported;
            };

            this.createLocalDir = function(dirPath) {
            	if(checkSupported() == false){
            		return false;
            	}
                var bRet = false;
                var pathArr = [];
                var destPath = "";
                try {
                    if (dirPath.indexOf("\\") > 0) {
                        pathArr = dirPath.split("\\");
                    } else {
                        alert("请输入正确的路径");
                        return false;
                    }
                    if (pathArr.length > 0) {
                        destPath = pathArr[0];
                    }
                    for (var i = 1; i < pathArr.length; i++) {
                        destPath = destPath + "\\" + pathArr[i];
                        bRet = fso.FolderExists(destPath);
                        if (!bRet) {
                            fso.CreateFolder(destPath);
                        }
                    };
                    return true;
                } catch (e) {
                    alert(e.message);
                    return false;
                }
            };

            this.readLocalFile = function(filePath) {
            	if(checkSupported() == false){
            		return false;
            	}
                var result = "";
                try {
                    var f1 = fso.GetFile(filePath);
                    var ts = f1.OpenAsTextStream();
                    result = ts.readAll();
                } catch (e) {
                    alert(e.message);
                    return false;
                } finally {
                    ts.close();
                }
                return result;
            };
            
        }
    ])
});