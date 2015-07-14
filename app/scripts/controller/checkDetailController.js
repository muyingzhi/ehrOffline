
define(['controller/controllers',
        'jquery','dictsConstant',
        'directives/alert',
        'directives/checkboxMainsymptomChecka',
        'directives/checkboxExercisemethod',
        'directives/checkboxEathabit',
        'directives/checkboxWinetype',
        'directives/checkboxDiseaseNxg',
        'directives/checkboxDiseaseSz',
        'directives/checkboxDiseaseXz',
        'directives/checkboxDiseaseXg',
        'directives/checkboxDiseaseEye',
        'directives/checkboxHealthadvice',
        'directives/isNum',
        'directives/isFloat',
        'directives/hysDatebox',
    	'services/HmsDownloadService',
    	'services/HmsPersonsService',
    	'services/SysConfigService',
        'directives/checkboxDangercontrol'],function(app){
	    app.controller("checkDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService','HmsDownloadService','HmsPersonsService','SysConfigService'
	        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,HmsDownloadService,HmsPersonsService,sysConfigService){
                //----------读取参数，为表单赋值
                var aid = $routeParams.aid;
                var cid = $routeParams.cid;
		        //---------设置顶端菜单
		        $rootScope.topNav = [
			        {
			            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/checklist/"+aid
			        }];
		        //---------随访方式字典
//		        $scope.dictDoctor = dataDicts.dictDoctor;
		        //----人员
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	            })
	            $scope.oldthinks = dataDicts.oldthink;
	            $scope.oldkowns = dataDicts.oldkown;
	            $scope.oldselfcares = dataDicts.oldselfcare;
		        $scope.dictExerciseFrequency = dataDicts.exerciseFrequency;
		        $scope.dictSmokeFrequency = dataDicts.smokeFrequency;
		        $scope.dictWineFrequency = dataDicts.wineFrequency;
		        $scope.dictWineRefrain = dataDicts.wineRefrain;
		        $scope.dictIsstoned = dataDicts.isstoned;
		        $scope.dictHaved = dataDicts.haved;
		        $scope.dictLip = dataDicts.lip;
		        $scope.dictIsnormal = dataDicts.isnormal;
		        $scope.dictYanbu = dataDicts.yanbu;
		        $scope.dictAudition = dataDicts.audition;
		        $scope.dictSportfun = dataDicts.sportfun;
		        $scope.dictSkin = dataDicts.skin;
		        $scope.dictGongmo = dataDicts.gongmo;
		        $scope.dictLymph = dataDicts.lymph;
		        $scope.dictWhether = dataDicts.isstoned;
		        $scope.dictLuoyin = dataDicts.luoyin;
		        $scope.dictXinlv = dataDicts.xinlv;
		        $scope.dictXzsz = dataDicts.xzsz;
		        $scope.dictZbdmbd = dataDicts.zbdmbd;
		        $scope.dictGmzz = dataDicts.gmzz;
		        $scope.dictPandn = dataDicts.pandn;
		        $scope.dictZytzPhz = dataDicts.zytz_phz;
		        $scope.dictZytzGg = dataDicts.zytz_gg;
		        $scope.dictHealthassess = dataDicts.healthassess;
		        $scope.dictPoisontype = dataDicts.poisontype;
		        $scope.dictDrugFrequency = dataDicts.drugFrequency;
		        $scope.dictDrugUsage = dataDicts.drugUsage;
		        $scope.dictDrugDosage = dataDicts.drugDosage;
		        $scope.dictCompliance = dataDicts.compliance;
		        $scope.dictDrugRange = dataDicts.drugRange;
		        $scope.dictDrugName = dataDicts.drugName;
		        //--------收缩、展开的默认值
		        $scope.toggle ={
		        		toggleText: "show_1;hide_2;hide_3;hide_4;hide_5;hide_6;hide_7;hide_8;"
		        }
		        
		        //--------默认
		        $scope.checka = {
	        		exercise_frequency: "HR409_4",
	        		smoke_frequency: "HR403_1",
	        		wine_frequency: "HR404_1",
        			undress: "HR397_0",
    				lip: "arch_kc_1",
					tooth: "HR438_001",
					yanbu: "arch_yb_1",
					audition: "arch_tl_1",
					sport_fun: "arch_ydgn_1",
					yandi: "HR438_001",
					skin: "HR458_1",
					gongmo: "arch_gm_1",
					lymph: "HR457_1",
					tongzhuangxiong: "HR396_0",
					breath: "HR438_001",
					luoyin: "arch_luoyin_1",
					xinlv: "arch_xinlv_1",
					zayin: "HR397_0",
					yagen: "HR397_0",
					baokuai: "HR397_0",
					ganda: "HR397_0",
					pida: "HR397_0",
					ydxzhuoyin: "HR397_0",
					xzsz: "arch_xzsz_1",
					zbdmbd: "arch_zbdmbd_1",
					gmzz: "HR456_1",
					cardiogram:"HR438_001",
					lung_x:"HR438_001",
					bchao:"HR438_001",
					cruser:$rootScope.currentUser.userid,
					hospitallist:[],
					homebedlist:[],
		        	druglist:[],
		        	inocutelist:[],
		        	exposurelist : []
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
	        		//$scope.arch.identityno
					var result = HmsDownloadService.getHmspersonMain($scope.arch.identityno,ftpConfig,downloadedFiles);
					$scope.checka.heat=result.temp;
	        	}
	        	$scope.returnA = function(){
	            	if($scope.checka.healthcheckaid==undefined || $scope.checka.healthcheckaid==''){
	            		$.messager.alert(dataDicts.alertTitle,"请先保存体检！");
	            		return false;
	            	}
	            	$("#returnA").attr('href','#/eniorcitizen/'+aid+'&'+$scope.checka.healthcheckaid);
	            }
		        //---职业暴露
		        $scope.poison = {};
		        $scope.addPoison = function(){
		        	if(!$scope.checka.exposurelist )$scope.checka.exposurelist =[];
		        	var _crtime = getCrtime();
	                var ops = {
                		poisontype:$scope.poison.poisontype,
                		poisoncontent:$scope.poison.poisoncontent,
                		hasfense:$scope.poison.hasfense,
                		fensecontent:$scope.poison.fensecontent,
                		industrialdiseaseid:"",
                		archiveid:$scope.checka.archiveid,
                		healthcheckid:"",
                		icpcode:$rootScope.currentUser.icpcode,
                		cruser:$rootScope.currentUser.userid,
                		crtime:_crtime
	                }
	                if(!ops.poisontype){
	                    $.messager.alert(dataDicts.alertTitle,'请选择【毒物种类】');
	                    return;
	                }
	                $scope.checka.exposurelist .push(ops);
	                $scope.poison = {};
		        };
		        $scope.delPoison = function(item){
		        	var i = $scope.checka.exposurelist .indexOf(item);
	                if(i>=0){
	                	$scope.checka.exposurelist .splice(i,1);//----删除
	                }
		        };
		        //---住院史
		        $scope.zhuyuanshi = {};
		        $scope.addZhuyuanshi = function(){
		        	if(!$scope.checka.hospitallist)$scope.checka.hospitallist=[];
		        	var _crtime = getCrtime();
		        	var ops = {
		        			entertime:$scope.zhuyuanshi.entertime,
		        			leavetime:$scope.zhuyuanshi.leavetime,
		        			hospitalname:$scope.zhuyuanshi.hospitalname,
		        			cureseries:$scope.zhuyuanshi.cureseries,
		        			diagnose:$scope.zhuyuanshi.diagnose,
		        			arch_hospitalizationid:"",
		        			cruser:$rootScope.currentUser.userid,
		        			crtime:_crtime,
		        			icpcode:$rootScope.currentUser.icpcode,
		        			archiveid:$scope.checka.archiveid,
		        			healthcheckaid:""
		        	}
		        	$scope.checka.hospitallist.push(ops);
		        	$scope.zhuyuanshi = {};
		        };
		        $scope.delZhuyuanshi = function(item){
		        	var i = $scope.checka.hospitallist.indexOf(item);
		        	if(i>=0){
		        		$scope.checka.hospitallist.splice(i,1);//----删除
		        	}
		        };
		        //---家族病床
		        $scope.jiazushi = {};
		        $scope.addJiazushi = function(){
		        	if(!$scope.checka.homebedlist)$scope.checka.homebedlist=[];
		        	var _crtime = getCrtime();
		        	var ops = {
		        			buildtime:$scope.jiazushi.buildtime,
		        			canceltime:$scope.jiazushi.canceltime,
		        			hospitalname:$scope.jiazushi.hospitalname,
		        			cureseries:$scope.jiazushi.cureseries,
		        			diseasedes:$scope.jiazushi.diseasedes,
		        			homesickbedid:"",
		        			cruser:$rootScope.currentUser.userid,
		        			crtime:_crtime,
		        			icpcode:$rootScope.currentUser.icpcode,
		        			archiveid:$scope.checka.archiveid,
		        			healthcheckaid:"",
		        	}
		        	$scope.checka.homebedlist.push(ops);
		        	$scope.jiazushi = {};
		        };
		        $scope.delJiazushi = function(item){
		        	var i = $scope.checka.homebedlist.indexOf(item);
		        	if(i>=0){
		        		$scope.checka.homebedlist.splice(i,1);//----删除
		        	}
		        };
		      //---用药情况
		        $scope.drug = {};
		        $scope.addDrug = function(){
		        	if(!$scope.checka.druglist)$scope.checka.druglist=[];
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
		        			archid:$scope.checka.arch_id,
		        			cruser:$rootScope.currentUser.userid,
		        			crtime:_crtime,
		        			icpcode:$rootScope.currentUser.icpcode,
		        			archiveid:$scope.checka.archiveid,
		        			dsetype:"DSETYPE_3",
		        			drugsstatusinfoid:""
		        	}
	                if(!ops.drugsname){
	                    $.messager.alert(dataDicts.alertTitle,'"药品名称"未选择');
	                    return;
	                }
		        	$scope.checka.druglist.push(ops);
		        	$scope.drug = {};
		        };
		        $scope.delDrug = function(item){
		        	var i = $scope.checka.druglist.indexOf(item);
		        	if(i>=0){
		        		$scope.checka.druglist.splice(i,1);//----删除
		        	}
		        };
		        //---非规划接种史
		        $scope.jiezhongshi = {};
		        $scope.addJiezhongshi = function(){
		        	if(!$scope.checka.inocutelist)$scope.checka.inocutelist=[];
		        	var _crtime = getCrtime();
		        	var ops = {
		        			vaccination_name:$scope.jiezhongshi.vaccination_name,
		        			vaccination_date:$scope.jiezhongshi.vaccination_date,
		        			vaccination_org:$scope.jiezhongshi.vaccination_org,
		        			inocutehistoryid:"",
		        			archiveid:"",
		        			health_check_id:"",
		        			icpcode:$rootScope.currentUser.icpcode,
		        			cruser:$rootScope.currentUser.userid,
		        			crtime:_crtime
		        	}
		        	$scope.checka.inocutelist.push(ops);
		        	$scope.jiezhongshi = {};
		        };
		        $scope.delJiezhongshi = function(item){
		        	var i = $scope.checka.inocutelist.indexOf(item);
		        	if(i>=0){
		        		$scope.checka.inocutelist.splice(i,1);//----删除
		        	}
		        };
	         	 //----------读取一个档案
	            LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
	                .then(function(data){
	                    if(data){
	                    	if(data.birthday){
	                            var birthday=new Date(Date.parse(data.birthday.replace(/-/g,   "/")));
	                            data.age = (new Date()).getFullYear() - birthday.getFullYear() + 1;
	                        }
	                        $scope.arch = data;
	                        $scope.checka.archiveid = data.archid;
	                        //$scope.checka.archno = data.archiveno;
	                        //$scope.checka.identityno=data.identityno;
                            $scope.checka.arch_id = aid;
	                    }else{
	                    }
	                },function(error){
	                    $.messager.alert(dataDicts.alertTitle,error);
	                });
	            LocalDBService.objectStore("EHEALTH_ARCH_HEALTHCHECKA").find(cid)
	                .then(function(data){
	                    if(!data){
	                        data = {};
	                    }
	                    $.extend($scope.checka,data);
	                },function(error){
	                    $scope.checka = {};
	                });
	            $scope.save = function(){
	            	if(checkValid()){
	            		return;
	            	}
	            	$scope.checka.crtime = getCrtime();
	            	$scope.checka.eniorcitizenlist=[];
	            	$scope.checka.icpcode = $rootScope.currentUser.icpcode;
	                if(!$scope.checka.healthcheckaid  || $scope.checka.healthcheckaid ==0){
	                    LocalDBService.objectStore("EHEALTH_ARCH_HEALTHCHECKA")
	                    .count()
	                    .then(function(num){
	                        $scope.checka.healthcheckaid  = (num + 1).toString();
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
	            	$scope.checka.storeSign = "1";
	                LocalDBService.objectStore("EHEALTH_ARCH_HEALTHCHECKA")
	                    .upsert($scope.checka)
	                    .then(function(result){
	                        $scope.checka.id = result;
	                        $.messager.alert(dataDicts.alertTitle,"保存成功");
	                    },function(result){
	                        $.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
	                    });
	            }
	            
            	//toggleText的格式："show_1;hide_2;hide_3;hide_4;hide_5;hide_6;hide_7;hide_8;";
	            $scope.show = function(parm){
	            	var showlist = ["show_1","show_2","show_3","show_4","show_5","show_6","show_7","show_8"];
	            	var hidelist = ["hide_1","hide_2","hide_3","hide_4","hide_5","hide_6","hide_7","hide_8"];
	            	$scope.toggle.toggleText="";
	            	if(parm==='all'){
	            		$.each(showlist,function(i,v){
            				$scope.toggle.toggleText += v+";";
	            		});
	            	}else{
	            		$.each(showlist,function(i,v){
            				if(parm==(i+1)){
            					$scope.toggle.toggleText = v+";";
            				}
	            		});
	            		$.each(hidelist,function(i,v){
            				if(parm==(i+1)){
            				}else{
            					$scope.toggle.toggleText += v+";";
            				}
	            		});
	            	};
	            };
	            $scope.hide = function(){
            		$scope.toggle.toggleText="hide_1;hide_2;hide_3;hide_4;hide_5;hide_6;hide_7;hide_8;";
	            };
	            $scope.closeAlert = function(){
	                alert("click close");
	            };
	            $scope.calcBmi = function(){
	            	if(!$scope.checka.height || !$scope.checka.weight || $scope.checka.height == 0||$scope.checka.weight==0) {
	            		$scope.checka.bmi = '0.0';
	            	}else{
	        	        var bmi = $scope.checka.weight/ Math.pow($scope.checka.height/100, 2);
	        	        $scope.checka.bmi = Math.round(bmi*100)/100;
	            	}
	            }
	            $scope.calcYtb = function(){
	            	if(!$scope.checka.yaowei || !$scope.checka.tunwei || $scope.checka.yaowei == 0||$scope.checka.tunwei==0) {
	            		$scope.checka.ytb = '0.0';
	            	}else{
	            		var ytb = $scope.checka.yaowei/ $scope.checka.tunwei;
	            		$scope.checka.ytb = Math.round(ytb*100)/100;
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
	            }
	            //检查校验项目
	            function checkValid(){
	            	var bHasInvalidElm = false;
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if($scope.frmAction.record_date.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>体检日期</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.duty_doctor.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>责任医生</font>]" + "<br>";	
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
	            }
	        }
	    ]);
    
});