console.log("healthEducationUpsertController...");
define(['controller/controllers','jquery','dictsConstant',
        'directives/isFloat',
        'directives/hysNoneDatebox',
        'directives/checkboxArchivesMeans'
       ],function(app){
	    app.controller("healthEducationUpsertController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
              
		    	//----------读取参数，为表单赋值
		        var aid = $routeParams.id;
		        //---------设置顶端菜单
		        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/healthEducation"}];
		        //---------用于存放参数信息
	            $scope.jkjy={};
	            $scope.isTRUE=false;
		        //---------字典加载
	            $scope.edutypes = dataDicts.edutype;
		        $scope.eduobjects = dataDicts.eduobject;
		        $scope.publicitytypes = dataDicts.publicitytype;
		        $scope.categorys = dataDicts.category;
		        $scope.checkresults = dataDicts.checkresult;
		        //----人员
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	            });
	            //----机构
	            datadictService.listTGOV().then(function(list){
	                $scope.dictTgov = list;
	            });
	            
	            if(aid>-1){
	            	$indexedDB.objectStore("EHEALTH_USER_HEALTHEDUACTION").find(aid).then(function(data){
	            		if(data){
	            			$scope.jkjy=data;
	                        if(data.storeSign == "1"){$scope.isTRUE=true;}
	            		}
		            },function(){
		                $.messager.alert(dataDicts.alertTitle,'取记录数错误');
		            }).then(function(){});
	            }else{
	            	$scope.jkjy.fillformdate=getDate();
	            	$scope.isTRUE=true;
	            };
	            
	            $scope.save = function(){
	            	if(checkValid()){
	                    return;
	                }
	                if(!$scope.jkjy.healtheduactionid || $scope.jkjy.healtheduactionid==0){
	                	$indexedDB.objectStore("EHEALTH_USER_HEALTHEDUACTION").count().then(function(num){
	                        $scope.jkjy.healtheduactionid = (num + 1).toString();
	                    },function(){
	                        $.messager.alert(dataDicts.alertTitle,'取记录数错误');
	                    }).then(function(){
	                        //-----------插入新记录
	                        saveOne();
	                    });
	                }else{
	                    saveOne();
	                }
	            };
	            
	            function saveOne(){
	            	$scope.jkjy.crtime = getCrtime();
	                $scope.jkjy.icpcode =  $rootScope.currentUser.icpcode;
	                $scope.jkjy.cruser =  $rootScope.currentUser.userid;//-----当前用户
	            	$scope.jkjy.storeSign = "1";
	                $indexedDB.objectStore("EHEALTH_USER_HEALTHEDUACTION").upsert($scope.jkjy).then(function(result){
	                	$.messager.alert(dataDicts.alertTitle,"保存成功");
	                },function(result){
	                	$.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
	                });
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
	            };
	            function getDate(){
	            	var _crdate = new Date();
		        	var _month = _crdate.getMonth()+1;
		        	var _date = _crdate.getDate();
		        	var _crtime = _crdate.getFullYear() +"-"+ ("00"+ _month).substr((""+ _month).length) + "-"+
		        				("00"+ _date).substr((""+ _date).length) ;
		        	return _crtime;
	            };
	            //检查校验项目
	            function checkValid(){
	            	var bHasInvalidElm = false;
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if(!$scope.jkjy.edudate){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>活动日期</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.publicitytype){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>宣传主题</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.address){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>活动地点</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.edutype){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>活动形式</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.eduobject){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>活动对象</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.category){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>参与人群</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.organizers){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>主办单位</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.peoplecount){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>参与人数</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.doctor){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>负责人</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.jkjy.fillformdate){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>填表时间</font>]" + "<br>";	
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
