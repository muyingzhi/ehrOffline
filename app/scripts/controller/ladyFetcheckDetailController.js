console.log("ladyFetcheckDetailController...");
define(['controller/controllers',
        'jquery','dictsConstant',
        'directives/hysDatebox',
        'directives/checkboxZhidaoFetcheck',
        'directives/checkboxGestationyc'],function(app){
	    app.controller("ladyFetcheckDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
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
	            });

		        //---------随访方式字典
		        $scope.dictFetalmove  = dataDicts.fetalmove;
		        $scope.dicAlbuminuria = dataDicts.albuminuria;
		        $scope.dicBlood_sugar = dataDicts.isnormal;
		        $scope.dicHepatitisC  = dataDicts.pandn;
		        $scope.dicBchao = dataDicts.isnormal;
		        $scope.dicChest_dis = dataDicts.haved;
		        $scope.dicEdema = dataDicts.haved;
		        $scope.dicJaundice = dataDicts.haved;
		        $scope.dicPalpitations = dataDicts.haved;
		        $scope.dicFenlei = dataDicts.isnormal;

		        $scope.fetcheck = {
		        		checkdate : getDT("T")
			    }

		        //----------读取一个档案
	            LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
            	.then(function(data){
                    if(data){
                        $scope.arch = data;
                        $scope.fetcheck.archiveid = data.archid;
                        $scope.fetcheck.archid = aid;
                        $scope.fetcheck.taicione = taici;
                    }else{
                    }
                },function(error){
                    $.messager.alert(dataDicts.alertTitle,error);
                });

	            LocalDBService.objectStore("EHEALTH_LADY_FETIFEROUSCHECK").find(cid)
                .then(function(data){
                    if(!data){
                        data = {};
                    }
                    //data.firstcheckid=undefined;
                    $.extend($scope.fetcheck,data);
                },function(error){
                    $scope.fetcheck = {};
                });

	            $scope.returnA = function(){
	            	if($scope.fetcheck.fetiferouscheckid==undefined || $scope.fetcheck.fetiferouscheckid==''){
	            		$.messager.alert(dataDicts.alertTitle,"请先保存产前检查！");
	            		return false;
	            	}
	            	$("#returnA").attr('href','#/arch/ladyScoremain/'+$scope.fetcheck.archid+'&'+$scope.fetcheck.fetiferouscheckid+'&1&'+taici);
	            }
	            
	            $scope.saveFetCheck = function(){
	            	if(checkValid()){
	            		return;
	            	}
	            	$scope.fetcheck.crtime = getDT("T");
					$scope.fetcheck.icpcode =  $rootScope.currentUser.icpcode;
					$scope.fetcheck.cruser =  $rootScope.currentUser.userid;//-----当前用户
					if(!$scope.fetcheck.fetiferouscheckid  || $scope.fetcheck.fetiferouscheckid==0){
					    LocalDBService.objectStore("EHEALTH_LADY_FETIFEROUSCHECK")
					        .count()
					        .then(function(num){
					            $scope.fetcheck.fetiferouscheckid  = (num + 1).toString();
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
	            	$scope.fetcheck.storeSign = "1";
	                LocalDBService.objectStore("EHEALTH_LADY_FETIFEROUSCHECK")
	                    .upsert($scope.fetcheck)
	                    .then(function(result){
	                        $scope.fetcheck.fetiferouscheckid = result;
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
	            	if($scope.fetcheck.checkdoctor==undefined || $scope.fetcheck.checkdoctor==''){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>随访医生</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.checkdate.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>随访日期</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.pregnancyweek.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>孕周</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.nextvisitdate.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>下次随访日期</font>]" + "<br>";	
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

