console.log("hyperDetailController...");
define(['controller/controllers',
        'jquery','dictsConstant',
        'directives/alert',
        'directives/isNum',
        'directives/isFloat',
        'directives/hysDatebox',
    	'services/HmsDownloadService',
    	'services/HmsPersonsService',
    	'services/SysConfigService',
        'directives/checkboxMainsymptom'],function(app){
    app.controller("hyperDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService','HmsDownloadService','HmsPersonsService','SysConfigService'
        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,HmsDownloadService,HmsPersonsService,sysConfigService){
            
            //----------读取参数，为表单赋值
            var hid = $routeParams.hid;
            var aid = $routeParams.aid;
	        //---------设置顶端菜单 
	        $rootScope.topNav = [
		        {
		            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/hyperlist/"+aid
		        }];
	        //---------随访方式字典
	        $scope.dictVisitway = dataDicts.visitway;
	        $scope.dictSaltIntake = dataDicts.saltIntake;
	        $scope.dictPsychology = dataDicts.psychology;
	        $scope.dictUsedrug = dataDicts.usedrug;
	        $scope.dictHaved = dataDicts.haved;
	        $scope.dictControls = dataDicts.controls;
//	        $scope.dictDoctor = dataDicts.dictDoctor;
	        //----人员
            datadictService.listUSER().then(function(list){
                $scope.dictDoctor = list;
            })
	        $scope.dictDrugFrequency = dataDicts.drugFrequency;
	        $scope.dictDrugUsage = dataDicts.drugUsage;
	        $scope.dictDrugDosage = dataDicts.drugDosage;
	        $scope.dictCompliance = dataDicts.compliance;
	        $scope.dictDrugRange = dataDicts.drugRange;
	        $scope.dictDrugName = dataDicts.drugName;
	        //--------默认
	        $scope.hyper = {
	        	visitway: "HR424_1",
	        	food: "HR382_1",
	        	saltd: "HR382_1",
	        	psychology: "HR421_1",
	        	doctororder: "HR421_1",
	        	drugadverse: "HR397_0",
	        	cruser:$rootScope.currentUser.userid,
	        	druglist:[]
	        };
	        //得到ftp的配置信息
			var ftpConfig = {
					ocx: FTP_OCX
			};
			//读取ftp的配置信息
        	sysConfigService.findById("ftpinfo").then(
                function(data){
                    if (data) {
                    	$.extend(ftpConfig,data);
                    };
                },
                function(error){
                    alert("【findByIdErr】:" + error);
                }
            );
        	//得到已下载的文件
			var downloadedFiles = [];
			HmsPersonsService.findAll().then(function(data){
				if(data && data.length > 0){
					downloadedFiles = data;
				}
			});
			
        	$scope.getHmsperson = function() {
        		if(!ftpConfig.host){
					$.messager.alert(dataDicts.alertTitle,"请进入一体机体检,维护ftp的配置后再获取！");
					return;
				}
        		//$scope.hyper.identityno
				var result = HmsDownloadService.getHmspersonMain($scope.arch.identityno,ftpConfig,downloadedFiles);
				$scope.hyper.bpheigh=result.sbp;//收缩压
				$scope.hyper.bplow=result.dbp;//舒张压
				$scope.hyper.heartrate=result.fetalheart;//心率
        	}
        	
	        //---用药情况
	        $scope.drug = {};
	        $scope.addDrug = function(){
	        	if(!$scope.hyper.druglist)$scope.hyper.druglist=[];
	        	var _crtime = getCrtime();
	        	var ops = {
	        			drugsname:$scope.drug.drugsname,
	        			usage:$scope.drug.usage,
	        			frequency:$scope.drug.frequency,
	        			dosage_no:$scope.drug.dosage_no,
	        			dosage:$scope.drug.dosage,
	        			druguse_no:$scope.drug.druguse_no,
	        			druguse:$scope.drug.druguse,
	        			drugcompliance:$scope.drug.drugcompliance,
	        			archid:$scope.hyper.archid,
	        			cruser:$rootScope.currentUser.userid,
	        			crtime:_crtime,
	        			icpcode:$rootScope.currentUser.icpcode,
	        			archiveid:$scope.hyper.archiveid,
	        			dsetype:"DSETYPE_3",
	        			drugsstatusinfoid:""
	        	}
                if(!ops.drugsname){
                    $.messager.alert(dataDicts.alertTitle,'"药品名称"未选择');
                    return;
                }
	        	$scope.hyper.druglist.push(ops);
	        	$scope.drug = {};
	        };
	        $scope.delDrug = function(item){
	        	var i = $scope.hyper.druglist.indexOf(item);
	        	if(i>=0){
	        		$scope.hyper.druglist.splice(i,1);//----删除
	        	}
	        };
            //----------读取一个档案
            LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
                .then(function(data){
                    if(data){
                        data.gender= (data.gender=="HR481_1")?"男":"女";
                        if(data.birthday){
                            var birthday=new Date(Date.parse(data.birthday.replace(/-/g,   "/")));
                            data.age = (new Date()).getFullYear() - birthday.getFullYear() + 1;
                        }
                        $scope.arch = data;
                        $scope.hyper.archiveid = data.archid;
                        //$scope.hyper.identityno = data.identityno;
                        //$scope.hyper.archno = data.archiveno;
                        $scope.hyper.archid = aid;
                    }else{
                    }
                },function(error){
                    $.messager.alert(dataDicts.alertTitle,error);
                });
	        LocalDBService.objectStore("EHEALTH_DIS_HYPERTENSIONVISIT").find(hid)
            .then(function(data){
                if(!data){
                    data = {};
                }else{
                    
                }
                $.extend($scope.hyper,data);
            },function(error){
            });
            $scope.save = function(){
            	if(checkValid()){
            		return;
            	}
            	$scope.hyper.crtime = getCrtime();
            	$scope.hyper.icpcode = $rootScope.currentUser.icpcode;
                if(!$scope.hyper.hypertensionvisitid || $scope.hyper.hypertensionvisitid==0){
                    LocalDBService.objectStore("EHEALTH_DIS_HYPERTENSIONVISIT")
                    .count()
                    .then(function(num){
                        $scope.hyper.hypertensionvisitid = (num + 1).toString();
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
            
            function saveOne(){
            	$scope.hyper.storeSign = "1";
                LocalDBService.objectStore("EHEALTH_DIS_HYPERTENSIONVISIT")
                    .upsert($scope.hyper)
                    .then(function(result){
                        $scope.hyper.hypertensionvisitid = result;
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
            $scope.calcBmi = function(){
            	if(!$scope.hyper.bodyheight || !$scope.hyper.bodyweight || $scope.hyper.bodyheight == 0||$scope.hyper.bodyweight==0) {
            		$scope.hyper.bmi = '0.0';
            	}else{
        	        var bmi = $scope.hyper.bodyweight/ Math.pow($scope.hyper.bodyheight/100, 2);
        	        $scope.hyper.bmi = Math.round(bmi*100)/100;
            	}
            	if(!$scope.hyper.bodyheight || !$scope.hyper.bodydweight || $scope.hyper.bodydweight == 0||$scope.hyper.bodyheight==0) {
            		$scope.hyper.bmid = '0.0';
            	}else{
            		var bmid = $scope.hyper.bodydweight/ Math.pow($scope.hyper.bodyheight/100, 2);
            		$scope.hyper.bmid = Math.round(bmid*100)/100;
            	}
            }
            //检查校验项目
            function checkValid(){
            	var bHasInvalidElm = false;
            	var warning = '';
            	var nInvalidCount = 0;
            	if($scope.frmAction.inquiredate.$error.required){
            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>随访日期</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	};
            	if($scope.frmAction.visitway.$error.required){
            		warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>随访方式</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	};
            	if($scope.frmAction.inquirer.$error.required){
            		warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>随访医生</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	};
            	if($scope.frmAction.bookingdate.$error.required){
            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>下次随访时间</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	};
            	if($scope.frmAction.cruser.$error.required){
            		warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>填表医生</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	};
            	if(warning){
            		$.messager.alert(dataDicts.alertTitle,warning);
            	}
            	return bHasInvalidElm;
            };
            $scope.setMyBookingdate = function(){
            	var _inquiredate = new Date(Date.parse($scope.hyper.inquiredate.replace(/-/g,   "/")));
            	_inquiredate.setMonth(_inquiredate.getMonth()+3);	//3个月后进行下次随访
            	var _month = _inquiredate.getMonth()+1;
	        	var _date = _inquiredate.getDate();
            	$scope.hyper.bookingdate = _inquiredate.getFullYear()+"-"+("00"+ _month).substr((""+ _month).length)+
            				"-"+("00"+ _date).substr((""+ _date).length);
            }
        }
    ]);
    
});