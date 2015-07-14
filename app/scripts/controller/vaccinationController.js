console.log("vaccinationController...");
define(['controller/controllers','jquery','dictsConstant',
        'directives/hysNoneDatebox'
       ],function(app){
	    app.controller("vaccinationController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
                //---------用于存放参数信息
	            $scope.vaccinationList=[];
	    		//---------设置顶端菜单
		        $rootScope.topNav = [{}];
		        
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
	            
		        $scope.getListVaccination = function(){
		        	if($scope.cxtype!=undefined &&  $scope.cxtype!=''){
		        		var myQuery=$indexedDB.queryBuilder().$index($scope.cxtype).$eq($scope.cxvalue);
	        			$indexedDB.objectStore("EHEALTH_IMMU_INOCUCARD").each(function(cursors){
			 	            if(cursors){
			 	            	cursors.value.gender = (cursors.value.gender=="HR481_1")?"男":"女";
			 	            	$scope.vaccinationList.push(cursors.value);
			 	                cursors.continue();
			 	            }
	    				},queryS).then(function(){},function(){alert("error");});
		        	}else{
		        		$indexedDB.objectStore("EHEALTH_IMMU_INOCUCARD").getAll().then(function(list){
		        			if(list){
		        				for(var i=0;i<list.length;i++){
		        					list[i].gender = (list[i].gender=="HR481_1")?"男":"女";
		        				}
		        				$scope.vaccinationList=list;
		        			}
		                },function(){
		                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
		                }).then(function(){});
		        	}
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
	            //检查校验项目
	            function checkValid(){
	            	var bHasInvalidElm = false;
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if(!$scope.bgdj.discover_date){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>发现时间</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.bgdj.info_type){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>信息类别</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.bgdj.report_user){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>报告人</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.scdj.report_date){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>报告时间</font>]" + "<br>";	
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