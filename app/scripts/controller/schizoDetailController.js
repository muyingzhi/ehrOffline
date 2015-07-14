console.log("schizoDetailController...");
define(['controller/controllers','dictsConstant',
        'directives/alert',
        'directives/radioDanger',
        'directives/radioNothave',
        'directives/checkboxMainsymptomSchizo',
        'directives/isNum',
        'directives/isFloat',
        'directives/hysDatebox',
        'directives/checkboxRehabilitationSchizo'],function(app){
	    app.controller("schizoDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService){
                
                //----------读取参数，为表单赋值
                var aid = $routeParams.aid;
                var sid = $routeParams.sid;
		        //---------设置顶端菜单
		        $rootScope.topNav = [
			        {
			            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/schizolist/"+aid
			        }];
		        //---------随访方式字典
		        $scope.dictInsight = dataDicts.insight;
		        $scope.dictGrade = dataDicts.grade;
		        $scope.dictWorkGrade = dataDicts.workGrade;
		        $scope.dictHospitalcn = dataDicts.hospitalcn;
		        $scope.dictGsqk = dataDicts.gsqk;
		        $scope.dictCompliance = dataDicts.compliance;
		        $scope.dictHaved = dataDicts.haved;
		        $scope.dictZlxg = dataDicts.zlxg;
		        $scope.dictCzsf = dataDicts.czsf;
		        $scope.dictIsstoned = dataDicts.isstoned;
//		        $scope.dictDoctor = dataDicts.dictDoctor;
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
		        //---------默认值
		        $scope.schizo={
	        		sleep: "HR486_2",
	        		food: "HR486_2",
	        		living: "HR486_1",
	        		housework: "HR486_1",
	        		work: "scldjgz_1",
	        		study: "HR486_1",
	        		interpersonal: "HR486_1",
	        		medicationcompliance: "arch_fyycx_1",
	        		drugsideeffects: "HR397_0",
//	        		inquirer: $rootScope.currentUser.userid,
	        		druglist:[]
		        };
		        //---用药情况
		        $scope.drug = {};
		        $scope.addDrug = function(){
		        	if(!$scope.schizo.druglist)$scope.schizo.druglist=[];
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
		        			archid:$scope.schizo.archid,
		        			cruser:$rootScope.currentUser.userid,
		        			crtime:_crtime,
		        			icpcode:$rootScope.currentUser.icpcode,
		        			archiveid:$scope.schizo.archiveid,
		        			dsetype:"DSETYPE_3",
		        			drugsstatusinfoid:""
		        	}
	                if(!ops.drugsname){
	                    $.messager.alert(dataDicts.alertTitle,'"药品名称"未选择');
	                    return;
	                }
		        	$scope.schizo.druglist.push(ops);
		        	$scope.drug = {};
		        };
		        $scope.delDrug = function(item){
		        	var i = $scope.schizo.druglist.indexOf(item);
		        	if(i>=0){
		        		$scope.schizo.druglist.splice(i,1);//----删除
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
	                        $scope.schizo.archiveid = data.archid;
                            $scope.schizo.archid = aid;
                            
	                    }else{
	                    }
	                },function(error){
	                    $.messager.alert(dataDicts.alertTitle,error);
	                });
	            LocalDBService.objectStore("EHEALTH_DIS_SCHIZOPHRENIAVISIT").find(sid)
		            .then(function(data){
		                if(!data){
		                    data = {};
		                }
		                $.extend($scope.schizo,data);
		            },function(error){
		            });
		        $scope.save = function(){
		        	if(checkValid()){
	            		return;
	            	}
                    $scope.schizo.storeSign = "1";
                    $scope.schizo.cruser = $rootScope.currentUser.userid;
                    $scope.schizo.icpcode = $rootScope.currentUser.icpcode;
		        	$scope.schizo.crtime = getCrtime();
	                if(!$scope.schizo.schizophreniavisitid || $scope.schizo.schizophreniavisitid==0){
	                    LocalDBService.objectStore("EHEALTH_DIS_SCHIZOPHRENIAVISIT")
	                    .count()
	                    .then(function(num){
	                        $scope.schizo.schizophreniavisitid = (num + 1).toString();
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
	                LocalDBService.objectStore("EHEALTH_DIS_SCHIZOPHRENIAVISIT")
	                    .upsert($scope.schizo)
	                    .then(function(result){
	                        $scope.schizo.schizophreniavisitid = result;
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
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>随访日期</font>]" + "<br>";	
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
	            	if(warning){
	            		$.messager.alert(dataDicts.alertTitle,warning);
	            	}
	            	return bHasInvalidElm;
	            };
	            $scope.setMyBookingdate = function(){
	            	var _inquiredate = new Date(Date.parse($scope.schizo.inquiredate.replace(/-/g,   "/")));
	            	_inquiredate.setMonth(_inquiredate.getMonth()+3);	//3个月后进行下次随访
	            	var _month = _inquiredate.getMonth()+1;
		        	var _date = _inquiredate.getDate();
	            	$scope.schizo.bookingdate = _inquiredate.getFullYear()+"-"+("00"+ _month).substr((""+ _month).length)+
	            				"-"+("00"+ _date).substr((""+ _date).length);
	            }
	            
	        }
	    ]);
    
});