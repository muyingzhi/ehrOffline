
define(['controller/controllers',
        'jquery','dictsConstant',
        'directives/hysDatebox',
        'directives/checkboxHealthAdviceVisits'],function(app){
	    app.controller("ladyVisitsDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService){
                //----------读取参数，为表单赋值
                var aid = $routeParams.aid;
                var cid = $routeParams.cid;
                var taici = $routeParams.taici;
		        //---------设置顶端菜单
		        $rootScope.topNav = [{
			            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/visitslist/"+aid
			        }];
		        //----人员
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	            })
		        $scope.dictBreast = dataDicts.isnormal;
		        $scope.dictEl = dataDicts.isnormal;
		        $scope.dictVenter = dataDicts.isnormal;
		        $scope.dictWound = dataDicts.isnormal;
		        $scope.dictFenlei = dataDicts.isnormal;

		        $scope.visit = {
		        	checkdate : getDT("T"),
	        		breast : "HR438_001",
	        		el : "HR438_001",
	        		venter : "HR438_001",
	        		wound : "HR438_001",
	        		fenlei : "HR438_001"
		        };

		        //----------读取一个档案
	            LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
            	.then(function(data){
                    if(data){
                        $scope.arch = data;
                        $scope.visit.archiveid = data.archid;
                        $scope.visit.archid = aid;
                        $scope.visit.taicione = taici;
                    }else{
                    }
                },function(error){
                    $.messager.alert(dataDicts.alertTitle,error);
                });
	            
	            LocalDBService.objectStore("EHEALTH_LADY_VISITS").find(cid)
                .then(function(data){
                    if(!data){
                        data = {};
                    }
                    //data.firstcheckid=undefined;
                    $.extend($scope.visit,data);
                },function(error){
                    $scope.visit = {};
                });
	            
	            $scope.saveVisit = function(){
	            	if(checkValid()){
	            		return;
	            	}
	                $scope.visit.crtime = getDT("T");
	                $scope.visit.icpcode =  $rootScope.currentUser.icpcode;
	                $scope.visit.cruser =  $rootScope.currentUser.userid;//-----当前用户

		            if(!$scope.visit.visitsid  || $scope.visit.visitsid ==0){
	                    LocalDBService.objectStore("EHEALTH_LADY_VISITS")
		                    .count()
		                    .then(function(num){
		                        $scope.visit.visitsid  = (num + 1).toString();
		                    },function(){
		                        $.messager.alert(dataDicts.alertTitle,'取记录数错误');
		                    })
		                    .then(function(){
		                        //-----------插入新记录
		                        saveOne();
		                    });
	                }else{
	                    saveOne();
	                }
	            }

	            function saveOne(){
	            	$scope.visit.storeSign = "1";
	                LocalDBService.objectStore("EHEALTH_LADY_VISITS")
	                    .upsert($scope.visit)
	                    .then(function(result){
	                        $scope.visit.visitsid = result;
	                        $.messager.alert(dataDicts.alertTitle,"保存成功");
	                    },function(result){
	                        $.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
	                    });
	            }
	            
	            function getDT(dORt) {
                    var _crdate = new Date();
                    var _month = _crdate.getMonth()+1;
                    var _date = _crdate.getDate();
                    var _hours = _crdate.getHours();
                    var _minutes = _crdate.getMinutes();
                    var _seconds = _crdate.getSeconds();
                    var _crtime = "";
                    if (dORt && dORt.toUpperCase() =="T"){
                        _crtime = _crdate.getFullYear() +"-"+ ("00"+ _month).substr((""+ _month).length) + "-"+
                                ("00"+ _date).substr((""+ _date).length) +" "+ ("00"+ _hours).substr((""+ _hours).length) +":"+
                                ("00"+ _minutes).substr((""+ _minutes).length) +":"+ ("00"+ _seconds).substr((""+ _seconds).length);
                    }else{
                        _crtime = _crdate.getFullYear() +"-"+ ("00"+ _month).substr((""+ _month).length) + "-"+
                                ("00"+ _date).substr((""+ _date).length)
                    }
                    return _crtime;
                }
	            //检查校验项目
	            function checkValid(){
	            	var bHasInvalidElm = false;
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if($scope.visit.visitoridiograph==undefined || $scope.visit.visitoridiograph==''){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>随访医生</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(warning){
	            		$.messager.alert(dataDicts.alertTitle,warning);
	            	}
	            	return bHasInvalidElm;
	            };
	        }
	    ]);
    
});