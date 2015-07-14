 console.log("eniorcitizenController...");
define(['controller/controllers','jquery','dictsConstant',
        'directives/hysNoneDatebox',
        'directives/checkboxStype'
       ],function(app){
	    app.controller("eniorcitizenController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
	            
	    		var aid = $routeParams.aid;
	            var cid = $routeParams.id;
                //---------设置顶端菜单
		        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/check/"+aid+"&"+cid}];
                //---------初始化
		        $scope.ss1=0;
		        $scope.ss2=0;
		        $scope.ss3=0;
		        $scope.ss4=0;
		        $scope.ss5=0;
		        //---------用于存放参数信息
	            $scope.oldPeople={};
	            $scope.isTRUE=true;
	            //---------初始化评价结果和得分
		        $scope.oldPeople.liveaba='0,0,0,0,0';
		        $scope.scores=0;
		        $scope.valueresults=1;
		        $scope.oldPeople.valueresult=1;
		        $scope.systemflag_show ="1";
		        
		        //---------计算评价结果和得分
	            $scope.getScore = function(){
	            	//--五项分别得分
	            	$scope.oldPeople.liveaba=$scope.ss1+','+$scope.ss2+','+$scope.ss3+','+$scope.ss4+','+$scope.ss5;
	            	//--总得分
	            	$scope.scores = parseInt($scope.ss1)+parseInt($scope.ss2)+parseInt($scope.ss3)+parseInt($scope.ss4)+parseInt($scope.ss5);
	            	//----评价结果
	            	if($scope.scores<=3){
	            		$scope.valueresults=1;
					}else if($scope.scores>3 && $scope.scores<9){
	            		$scope.valueresults=2;
					}else if($scope.scores>8&&$scope.scores<19){
	            		$scope.valueresults=3;
					}else if($scope.scores>=19){
						$scope.valueresults=4;
					}
	            	//老年人关注级别
	            	if($scope.oldPeople.stype==""){
	            		if($scope.valueresults=="1"){
	            			$scope.systemflag_show ="1";
	            		}else if($scope.valueresults=="2"){
	            			$scope.systemflag_show ="2";
	            		}else if($scope.valueresults=="3"){
	            			$scope.systemflag_show ="3";
	            		}else {
	            			$scope.systemflag_show ="4";
	            		}
	            	}else{
	            		if($scope.valueresults=="1"){
	            			$scope.systemflag_show ="2";
	            		}else if($scope.valueresults=="2"){
	            			$scope.systemflag_show ="3";
	            		}else if($scope.valueresults=="3"){
	            			$scope.systemflag_show ="4";
	            		}else {
	            			$scope.systemflag_show ="4";
	            		}
	            	}
	            	$scope.oldPeople.systemflag=$scope.systemflag_show;
	            	$scope.oldPeople.valueresult=$scope.valueresults;
	            } 
	            
	            $indexedDB.objectStore("EHEALTH_ARCH_HEALTHCHECKA").find(cid).then(function(data){
	            	if(data.eniorcitizenlist && data.eniorcitizenlist.length>0){
            			$scope.oldPeople=data.eniorcitizenlist[0];
            			if(data.eniorcitizenlist[0].liveaba!=undefined && data.eniorcitizenlist[0].liveaba.split(',').length==5){
            				$scope.ss1=data.eniorcitizenlist[0].liveaba.split(',')[0];
            		        $scope.ss2=data.eniorcitizenlist[0].liveaba.split(',')[1];
            		        $scope.ss3=data.eniorcitizenlist[0].liveaba.split(',')[2];
            		        $scope.ss4=data.eniorcitizenlist[0].liveaba.split(',')[3];
            		        $scope.ss5=data.eniorcitizenlist[0].liveaba.split(',')[4];
            		        $scope.getScore();
            			}
                        //if(data.eniorcitizenlist[0].storeSign != "1"){$scope.isTRUE=false;}
            		}
	            },function(){
	                $.messager.alert(dataDicts.alertTitle,'取记录数错误');
	            }).then(function(){});

	            $scope.save = function(){
	            	if(checkValid()){
	                    return;
	                }
		            $indexedDB.objectStore("EHEALTH_ARCH_HEALTHCHECKA").find(cid).then(function(data){
	            		if(data.eniorcitizenlist){
	            			$scope.oldPeople.eniorcitizenid="";
	    	            	$scope.oldPeople.crtime = getCrtime();
	    	                $scope.oldPeople.icpcode =  $rootScope.currentUser.icpcode;
	    	                $scope.oldPeople.cruser =  $rootScope.currentUser.userid;//-----当前用户
	    	                $scope.oldPeople.healthcheckaid = cid;
	    	                $scope.oldPeople.archid = data.arch_id;
	    	                $scope.oldPeople.archiveid = data.archiveid;
	            			data.eniorcitizenlist[0]=$scope.oldPeople;
	            			data.storeSign="1";
	            			$indexedDB.objectStore("EHEALTH_ARCH_HEALTHCHECKA").upsert(data).then(function(result){
	    	                	$.messager.alert(dataDicts.alertTitle,"保存成功");
	    	                },function(result){
	    	                	$.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
	    	                });
	            		}
		            },function(){
		                $.messager.alert(dataDicts.alertTitle,'取记录数错误');
		            }).then(function(){});
		            
	            };
	            	            
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
	            };
	            //检查校验项目
	            function checkValid(){
	            	var bHasInvalidElm = false;
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if(!$scope.oldPeople.inquiredate){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>调查日期</font>]" + "<br>";	
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