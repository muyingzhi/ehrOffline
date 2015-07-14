console.log("ladyFirstcheckDetailController...");
define(['controller/controllers',
        'jquery','dictsConstant',
        'directives/alert',
        'directives/isFloat',
        'directives/isNum',
        'directives/radioIsfetiferous',
        'directives/checkboxLd',
        'directives/checkboxLfd',
        'directives/checkboxLhd',
        'directives/checkboxLsd',
        'directives/checkboxLvd'
        ],function(app){
	    app.controller("ladyFirstcheckADetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
              
                //----------读取参数，为表单赋值
                var aid = $routeParams.aid;
                var sid = $routeParams.sid;
		        //---------设置顶端菜单
		        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/firstcheck/"+aid+'&'+sid}];
		        //---------用于存放参数信息
		        $scope.lady={};
		        //---------字典加载
		        $scope.menstrualflow = dataDicts.menstrualflow;
		        $scope.dysmenorrhea = dataDicts.dysmenorrhea;
		        $scope.yesuan = dataDicts.yesuan;
		        $scope.earlypreg = dataDicts.earlypreg;
		        $scope.haved=dataDicts.haved;
		        $scope.upgrowth=dataDicts.upgrowth;//发育
		        $scope.pabulum=dataDicts.pabulum;//营养
		        $scope.dropsy=dataDicts.dropsy;//浮肿
		        $scope.antigen=dataDicts.antigen;//抗原、抗体
		        $scope.greekNumerals=dataDicts.greekNumerals;//希腊数字
		        $scope.pandn=dataDicts.pandn;//阴性
		        $scope.isnormal=dataDicts.isnormal;//正常
		        $scope.bloodtype=dataDicts.bloodtype;//血型
		        $scope.bloodRH=dataDicts.bloodRH;
		        $scope.finalmark=dataDicts.finalmark;//结案标志
		        $scope.isstoned=dataDicts.isstoned;//是否
		        
		        //----人员
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	            })
	            //----首检时间
		        $scope.lady.booking_date = {
		        	checkdate : getCrtime()
			    }
	            
	            //----------读取一个档案
	            $indexedDB.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
	                .then(function(data){
	                    if(data){
	                    	data.gender= (data.gender=="HR481_1")?"男":"女";
	                    	if(data.birthday){
	                    		var birthday=new Date(Date.parse(data.birthday.replace(/-/g,   "/")));
	                    		data.age = (new Date()).getFullYear() - birthday.getFullYear() + 1;
	                    	}
	                        $scope.arch = data;
                            $scope.lady.archid = aid;
	                        $scope.lady.archiveid = data.archid;
                            
	                    }else{
	                    }
	                },function(error){
	                    $.messager.alert(dataDicts.alertTitle,error);
	                });

	            var data={};
	            
	            //----------孕妇首次检查
	            $indexedDB.objectStore("EHEALTH_LADY_FIRSTCHECK").find(sid)
                .then(function(data){
                    if(!data){
                    	data = {};
                    }
                    $.extend($scope.lady,data);
                },function(error){
                    $scope.lady = {};
		            alert("error");
                });
	            
	            //------------------------保存数据
	            $scope.save = function(){
	            	if(checkValid()){
	            		return;
	            	}
	            	$scope.lady.crtime = getCrtime();
	            	$scope.lady.cruser=$rootScope.currentUser.userid;
	            	$scope.lady.icpcode = $rootScope.currentUser.icpcode;
	                if(!$scope.lady.firstcheckid || $scope.lady.firstcheckid==0){
	                	$indexedDB.objectStore("EHEALTH_LADY_FIRSTCHECK").count().then(function(num){
				            $scope.lady.firstcheckid  = (num + 1).toString();
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
	            	$scope.lady.storeSign = "1";
	            	$indexedDB.objectStore("EHEALTH_LADY_FIRSTCHECK").upsert($scope.lady).then(function(result){
				        $scope.lady.firstcheckid = result;
				        $.messager.alert(dataDicts.alertTitle,"保存成功");
		            },function(result){
		               	$.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
		            });
	            }
	            $scope.returnA = function(){
	            	if($scope.lady.firstcheckid==undefined || $scope.lady.firstcheckid==''){
	            		$.messager.alert(dataDicts.alertTitle,"请先保存首检！");
	            		return false;
	            	}
	            	$("#returnA").attr('href','#/arch/ladyScoremain/'+$scope.lady.archid+'&'+$scope.lady.firstcheckid+'&0&'+$scope.lady.taici);
	            }
		        $scope.calcBmi = function(){
	            	if(!$scope.lady.height || !$scope.lady.weight || $scope.lady.height == 0||$scope.lady.weight==0) {
	            		$scope.lady.bmi = '0.0';
	            	}else{
	        	        var bmi = $scope.lady.weight/ Math.pow($scope.lady.height/100, 2);
	        	        $scope.lady.bmi = Math.round(bmi*100)/100;
	            	}
	            }
	            $scope.setMyBookingdate = function(){
	            	var _inquiredate = new Date(Date.parse($scope.lady.booking_date.replace(/-/g,   "/")));
	            	_inquiredate.setMonth(_inquiredate.getMonth()+3);	//3个月后进行下次随访
	            	var _month = _inquiredate.getMonth()+1;
		        	var _date = _inquiredate.getDate();
	            	$scope.lady.nextvisitdate = _inquiredate.getFullYear()+"-"+("00"+ _month).substr((""+ _month).length)+
	            				"-"+("00"+ _date).substr((""+ _date).length);
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
	            	if($scope.lady.doctor==undefined || $scope.lady.doctor==''){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>随访医生</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.booking_date.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>填表日期</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.lady.isfetiferous==undefined || $scope.lady.isfetiferous==''){
	            		warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>产妇类型</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.last_menses.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>末次月经</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.taici.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>孕次</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.chanci.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>产次</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.pregnant_weeks.$error.required || $scope.frmAction.pregnant_days.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>初检孕周</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.expected_childbirth.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>预产期</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.nextvisitdate.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>下次随访日期</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.isover.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>结案标志</font>]" + "<br>";	
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