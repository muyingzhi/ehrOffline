define(['controller/controllers',
        'jquery','dictsConstant',
        'directives/hysDatebox'],function(app){
	    app.controller("ladyVisit42dayDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
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
		        $scope.dictBreast = dataDicts.isnormal;
		        $scope.dictEl = dataDicts.isnormal;
		        $scope.dictVenter = dataDicts.isnormal;
		        $scope.dictWound = dataDicts.isnormal;
		        $scope.dictFenlei = dataDicts.isnormal;
		        $scope.dictDealresult = dataDicts.dealresult;
		        $scope.dictFenlei = dataDicts.fenlei;
		        $scope.dictCare_advice = dataDicts.careadvice;

		        $scope.visit42day = {
		        	visit_date : getDT("T"),
	        		breast : "HR438_001",
	        		el : "HR438_001",
	        		venter : "HR438_001",
	        		wound : "HR438_001",
	        		fenlei : "lady_42days_hf_2",
	        		dealresult : "lady_42visit_deal_1"
		        };
		        //----------读取一个档案
	            LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
            	.then(function(data){
                    if(data){
                        $scope.arch = data;
                        $scope.visit42day.archiveid = data.archid;
                        $scope.visit42day.archid = aid;
                        $scope.visit42day.taicione = taici;
                    }else{
                    }
                },function(error){
                    $.messager.alert(dataDicts.alertTitle,error);
                });

	            LocalDBService.objectStore("EHEALTH_LADY_VISIT42DAYS").find(cid)
                .then(function(data){
                    if(!data){
                        data = {};
                    }
                    //data.firstcheckid=undefined;
                    $.extend($scope.visit42day,data);
                },function(error){
                    $scope.visit42day = {};
                });
	            
	            $scope.saveVisit42Day = function(){
	            	if(checkValid()){
	            		return;
	            	}
	            	$scope.visit42day.crtime = getDT("T");
					$scope.visit42day.icpcode =  $rootScope.currentUser.icpcode;
					$scope.visit42day.cruser =  $rootScope.currentUser.userid;//-----当前用户
					
					if(!$scope.visit42day.visit42daysid  || $scope.visit42day.visit42daysid ==0){
					    LocalDBService.objectStore("EHEALTH_LADY_VISIT42DAYS")
					        .count()
					        .then(function(num){
					            $scope.visit42day.visit42daysid  = (num + 1).toString();
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
	            	$scope.visit42day.storeSign = "1";
	                LocalDBService.objectStore("EHEALTH_LADY_VISIT42DAYS").upsert($scope.visit42day)
	                    .then(function(result){
	                        $scope.visit42day.visit42daysid = result;
	                        $.messager.alert(dataDicts.alertTitle,"产后42天保存成功");
	                        
	                        //----------孕妇首次检查
	                        var ladyFirstcheck={};
	                        var myQuerys = LocalDBService.queryBuilder().$index('archid_idx').$eq(aid);
	                        LocalDBService.objectStore("EHEALTH_LADY_FIRSTCHECK").each(function(cursor){
	            	            if(cursor){
	            	                if(cursor.value.taici==taici){
	            	                	cursor.value.isover='lady_ja_1';
	            	                	cursor.value.storeSign='1';
	            	                	ladyFirstcheck=cursor.value;
	            	                }
	            	                cursor.continue();
	            	            };
	            	        },myQuerys).then(function(){
	            	        	LocalDBService.objectStore("EHEALTH_LADY_FIRSTCHECK").upsert(ladyFirstcheck).then(function(result){
	        				        $.messager.alert(dataDicts.alertTitle,"产妇首检自动结案成功");
	        		            },function(result){
	        		               	$.messager.alert(dataDicts.alertTitle,"产妇首检自动结案失败:"+result);
	        		            });
	            	        },function(){
	            	            alert("error");
	            	        });
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
	            	if($scope.visit42day.visit_doctor==undefined || $scope.visit42day.visit_doctor==''){
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