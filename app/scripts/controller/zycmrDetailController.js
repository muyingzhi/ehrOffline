console.log("zycmrDetailController...");
define(['controller/controllers','dictsConstant',
        'directives/alert',
        'directives/radioAnswer',
        'directives/radioYaowei',
        'directives/radioBmi',
        'directives/radioCold',
        'directives/isNum',
        'directives/isFloat',
        'directives/hysDatebox',
        'directives/radioIrritability'],function(app){
	    app.controller("zycmrDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService){
                //----------读取参数，为表单赋值
                var aid = $routeParams.aid;
                var zid = $routeParams.zid;
                console.log("中医体质参数id="+zid);
		        //---------设置顶端菜单
		        $rootScope.topNav = [
			        {
			            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/zycmrlist/"+aid
			        }];
		        $scope.zy={
	        		
		        };
                //----人员
                datadictService.listUSER().then(function(list){
                    $scope.dictDoctor = list;
                })
                $scope.dictZytzGg= dataDicts.zytz_gg;
	            //----------读取一个档案
	            LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
	                .then(function(data){
	                    if(data){
	                    	data.gender= (data.gender=="HR481_1")?"男":"女";
	                    	var birthday=new Date(Date.parse(data.birthday.replace(/-/g,   "/")));
	                    	data.age = (new Date()).getFullYear() - birthday.getFullYear() + 1;
	                        $scope.arch = data;
	                        $scope.zy.archiveid = data.archid;
	                        $scope.zy.archid = aid;
	                    }else{
	                    }
	                },function(error){
	                    $.messager.alert(dataDicts.alertTitle,error);
	                });
	            //获取最后一次体重和升高
	            var nextdate='1900-01-01'
	            var tHeight=0;
	            var tWeight=0;
	            var myQuerys = LocalDBService.queryBuilder().$index('archid_idx').$eq(aid);
                LocalDBService.objectStore("EHEALTH_ARCH_HEALTHCHECKA").each(function(cursor){
    	            if(cursor){
    	            	if(nextdate<cursor.value.record_date){
	    	            	tHeight=cursor.value.height/100;
	    	            	tWeight=cursor.value.weight;
	    	            	nextdate=cursor.value.record_date;
    	            	}
    	                cursor.continue();
    	            };
    	        },myQuerys).then(function(){
    	        	 LocalDBService.objectStore("EHEALTH_ZY_VISIT").find(zid).then(function(data){
 		                if(!data){
 		                    data = {};
 		                    data.archid = aid;
 		                }
 		                if((data.height==undefined || data.height=="" || data.height==null) && tHeight!=undefined){
 		                	data.height=tHeight*1;
 		                }else{
 	 		                data.height=data.height*1;
 		                }
 		                if((data.weight==undefined || data.weight=="" || data.weight==null) && tWeight!=undefined){
 		                	data.weight=tWeight*1;
 		                }else{
 	 		                data.weight=data.weight*1;
 		                }
	 		            data.allergytimes=data.allergytimes*1;
	 		            data.bellytimes=data.bellytimes*1;
	 		            data.coldtimes=data.coldtimes*1;
	 		            data.qxzscore=data.qxzscore*1;
	 		            data.yxzscore=data.yxzscore*1;
	 		            data.yinxzscore=data.yinxzscore*1;
	 		            data.tszscore=data.tszscore*1;
	 		            data.srzscore=data.srzscore*1;
	 		            data.xyzscore=data.xyzscore*1;
	 		            data.qyzscore=data.qyzscore*1;
	 		            data.tzzscore=data.tzzscore*1;
	 		            data.phzscore=data.phzscore*1;
	 		            
 		                $.extend($scope.zy,data);
 		            },function(error){
 		            });
    	        },function(){alert("error");})
    	        
	           
                
		        $scope.save = function(){
		        	if(checkValid()){
	            		return;
	            	}
                    $scope.zy.storeSign = "1";
                    $scope.zy.cruser = $rootScope.currentUser.userid;
                    $scope.zy.icpcode = $rootScope.currentUser.icpcode;
		        	$scope.zy.crtime = getCrtime();
	                if(!$scope.zy.elderlycmrid || $scope.zy.elderlycmrid==0){
	                    LocalDBService.objectStore("EHEALTH_ZY_VISIT")
	                    .count()
	                    .then(function(num){
	                        $scope.zy.elderlycmrid = (num + 1).toString();
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
	                
	            };
	            //计算BMI值
	            $scope.countBMI= function(){
	            	if($scope.zy.height && $scope.zy.weight) {
	            		var bmi = Math.round($scope.zy.weight/ Math.pow($scope.zy.height, 2)*100)/100;
	            		if(bmi<24){
	            			//alert("选第一个");
	            			$scope.zy.item9='1';
	            			$("tszscore").val(1);
	            		}else if(bmi>=24&&bmi<25){
	            			//alert("选第二个");
	            			$scope.zy.item9='2';
	            			$("tszscore").val(2);
	            		}else if(bmi>=25&&bmi<26){
	            			//alert("选第三个");
	            			$scope.zy.item9='3';
	            			$("tszscore").val(3);
	            		}else if(bmi>=26&&bmi<28){
	            			//alert("选第四个");
	            			$scope.zy.item9='4';
	            			$("tszscore").val(4);
	            		}else if(bmi>=28){
	            			//alert("选第五个");
	            			$scope.zy.item9='5';
	            			$("tszscore").val(5);
	            		}
	            	}
	            }
	            $scope.countCold = function(){
	            	var coldtimes =$scope.zy.coldtimes;
	            	if(coldtimes!=undefined && coldtimes!=null && coldtimes!=''){
	            		if(coldtimes<2){
	            			$scope.zy.item14='1';
	            		}else if(coldtimes>=2&&coldtimes<5){
	            			$scope.zy.item14='2';
	            		}else if(coldtimes>=5&&coldtimes<7){
	            			$scope.zy.item14='3';
	            		}else if(coldtimes>=7&&coldtimes<10){
	            			$scope.zy.item14='4';
	            		}else if(coldtimes>=10){
	            			$scope.zy.item14='5';
	            		}
	            	}
	            }
	            $scope.countAllergytimes = function(){
	            	var coldtimes =$scope.zy.allergytimes;
	            	if(coldtimes!=undefined && coldtimes!=null && coldtimes!=''){
	            		if(coldtimes<=0){
	            			$scope.zy.item17='1';
	            		}else if(coldtimes>=1&&coldtimes<3){
	            			$scope.zy.item17='2';
	            		}else if(coldtimes>=3&&coldtimes<5){
	            			$scope.zy.item17='3';
	            		}else if(coldtimes>=5&&coldtimes<7){
	            			$scope.zy.item17='4';
	            		}else if(coldtimes>=7){
	            			$scope.zy.item17='5';
	            		}
	            	}
	            }
	            $scope.countbellytimes = function(){
	            	var coldtimes =$scope.zy.bellytimes;
	            	if(coldtimes!=undefined && coldtimes!=null && coldtimes!=''){
	            		if(coldtimes<=80){
	            			$scope.zy.item28='1';
	            		}else if(coldtimes>=80&&coldtimes<86){
	            			$scope.zy.item28='2';
	            		}else if(coldtimes>=86&&coldtimes<91){
	            			$scope.zy.item28='3';
	            		}else if(coldtimes>=91&&coldtimes<105){
	            			$scope.zy.item28='4';
	            		}else if(coldtimes>=105){
	            			$scope.zy.item28='5';
	            		}
	            	}
	            }
	            function saveOne(){
	            	$scope.zy.phzscore=$("#phzscore").val()==undefined || $("#phzscore").val()==''?0:parseInt($("#phzscore").val());
	            	$scope.zy.qxzscore=$("#qxzscore").val()==undefined || $("#qxzscore").val()==''?0:parseInt($("#qxzscore").val());
	            	$scope.zy.qyzscore=$("#qyzscore").val()==undefined || $("#qyzscore").val()==''?0:parseInt($("#qyzscore").val());
	            	$scope.zy.srzscore=$("#srzscore").val()==undefined || $("#srzscore").val()==''?0:parseInt($("#srzscore").val());
	            	$scope.zy.tszscore=$("#tszscore").val()==undefined || $("#tszscore").val()==''?0:parseInt($("#tszscore").val());
	            	$scope.zy.tzzscore=$("#tzzscore").val()==undefined || $("#tzzscore").val()==''?0:parseInt($("#tzzscore").val());
	            	$scope.zy.xyzscore=$("#xyzscore").val()==undefined || $("#xyzscore").val()==''?0:parseInt($("#xyzscore").val());
	            	$scope.zy.yinxzscore=$("#yinxzscore").val()==undefined || $("#yinxzscore").val()==''?0:parseInt($("#yinxzscore").val());
	            	$scope.zy.yxzscore=$("yxzscore").val()==undefined || $("#yxzscore").val()==''?0:parseInt($("#yxzscore").val());
	            	
	                LocalDBService.objectStore("EHEALTH_ZY_VISIT").upsert($scope.zy).then(function(result){
	                        $scope.zy.elderlycmrid = result;
	                        $.messager.alert(dataDicts.alertTitle,"保存成功");
	                    },function(result){
	                        $.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
	                    });
	            }
	            $scope.closeAlert = function(){
	                alert("click close");
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
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if($scope.frmAction.inquiredate.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>辨识日期</font>]" + "<br>";	
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