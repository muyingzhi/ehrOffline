define(['controller/controllers',
        'jquery',
        'directives/alert',
        'dictsConstant',
        'services/SysConfigService'
        ],function(controllers,$){
    controllers.controller("sysConfigSetController", 
    	['$rootScope','$scope','$routeParams','$location','$indexedDB','dataDicts','SysConfigService',
        function($rootScope,$scope,$routeParams,$location,LocalDBService,dataDicts,sysConfigService){
            //默认配置,对象命名时必须使用表的主键
            $scope.config = {
            	showAll: false,
            	checkNow:"",
            	message: "",
        		ftpinfo: {
                    configname: "ftpinfo",
                    host: "",
                    port: "21",
                    user: "ftpuser",
                    pwd: "123456"
                },
                interchg: {
                    configname: "interchg",
                    url: ""
                }
            }
            //----------读取参数，为表单赋值
            $scope.cname = $routeParams.cname;
            if($scope.cname){
            	var parentUrl = "";
            	if ($scope.cname == "ftpinfo") {
            		parentUrl = "#/hmslist"
            	}else if ($scope.cname == "interchg") {
            		parentUrl = "#/archDownload"
            	};
            	$rootScope.topNav = [
	                 {
	                	 text: "返回",iconClass: "glyphicon-circle-arrow-left",url: parentUrl
	                 }
                 ];
            	//读取维护好的内容
            	sysConfigService.findById($scope.cname).then(
                    function(data){
                        if (data) {
                        	$.extend($scope.config[$scope.cname] , data);
                        };
                    },
                    function(error){
                        $scope.config.message = "【findByIdErr】:" + error;
                    }
                );
            }else{
            	//全部配置
            	$scope.config.showAll = true;
            	$rootScope.topNav = [];
            	//读取维护好的内容
            	sysConfigService.findAll().then(
                    function(list){
                        if (list && list.length > 0) {
                        	for(var i=0; i< list.length; i++){
                        		var configVal = list[i];
                        		$.extend($scope.config[configVal.configname] , configVal);
                        	}
                        };
                    },
                    function(error){
                        $scope.config.message = "【findAllErr】:" + error;
                    }
                );
            }
            

            //----保存操作
            $scope.ftpSave = function(){
            	$scope.config.checkNow = "ftpinfo";
                if (checkValid()) {
                    return
                };
                $scope.config.ftpinfo.crtime=getCrtime();
                sysConfigService.upsert($scope.config.ftpinfo).then(
                    function(data){
                        $.messager.alert(dataDicts.alertTitle,'ftp配置保存成功');
                    },
                    function(error){
                    	$scope.config.message = "ftp配置保存失败："+error
                    }
                )
            }
 
            $scope.interchgSave = function(){
            	$scope.config.checkNow = "interchg";
                if (checkValid()) {
                    return
                };
                $scope.config.interchg.crtime=getCrtime();
                sysConfigService.upsert($scope.config.interchg).then(
                    function(data){
                        $.messager.alert(dataDicts.alertTitle,'交换平台地址保存成功');
                    },
                    function(error){
                    	$scope.config.message = "交换平台地址保存失败："+error
                    }
                )
            }

            function getCrtime(){
                var _crdate = new Date();
                var _month = _crdate.getMonth()+1;
                var _date = _crdate.getDate();
                var _hours = _crdate.getHours();
                var _minutes = _crdate.getMinutes();
                var _seconds = _crdate.getSeconds();
                var _crtime = _crdate.getFullYear() +"-"+ ("00"+ _month).substr((""+ _month).length) + "-"+
                            ("00"+ _date).substr((""+ _date).length) +" "+ ("00"+ _hours).substr((""+ _hours).length) +":"+
                            ("00"+ _minutes).substr((""+ _minutes).length) +":"+ ("00"+ _seconds).substr((""+ _seconds).length);
                return _crtime;
            }

            //检查校验项目
            function checkValid(){
                var bHasInvalidElm = false;
                $scope.config.message = "";
                if($scope.config.checkNow == "ftpinfo" && $scope.ftpForm.ftpHost.$error.required){
            		$scope.config.message +=  " 请填写FTP服务器的【ip地址】  "; 
            		bHasInvalidElm = true;
                };
                if($scope.config.checkNow == "interchg" && $scope.interchgForm.interchgUrl.$error.required){
            		$scope.config.message +=  " 请填写【交换平台地址】  "; 
            		bHasInvalidElm = true;
                };
                return bHasInvalidElm;
            };
        }])
})