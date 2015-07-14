console.log("hyperDetailController...");
define(['controller/controllers',
        'jquery','dictsConstant',
        'directives/alert',
        'directives/isNum',
        'directives/isFloat',
        'directives/hysDatebox',
        'directives/radioDoctorOrder',
        'directives/radioUsedrug',
        'directives/radioSituation',
        'directives/radioSituationNext',
        'directives/radioFollowMeasures',
        //'../../vendor/calendarInput',
        'services/HmsDownloadService',
    	'services/HmsPersonsService',
    	'services/SysConfigService',
        'directives/checkboxMainsymptom'],function(app){
    app.controller("hyperDetailControllerA",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService','HmsDownloadService','HmsPersonsService','SysConfigService'
        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,HmsDownloadService,HmsPersonsService,sysConfigService){
            
            //----------读取参数，为表单赋值
            var hid = $routeParams.hid;
            var aid = $routeParams.aid;
            //----------存储参数，服药情况
            var fyqk=0;
	        //---------设置顶端菜单 
	        $rootScope.topNav = [
		        {
		            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/hyperlist/"+aid
		        }];
	        $scope.tzopen=true;
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
	        $scope.arguments={};
	        
	        var mainsymptom=[{id:"dis_hyper_1",text:"无症状"},{id:"dis_hyper_2",text:"头痛头晕"},{id:"dis_hyper_3",text:"恶心呕吐"},{id:"dis_hyper_4",text:"眼花耳鸣"},{id:"dis_hyper_5",text:"呼吸困难"},
                             {id:"dis_hyper_6",text:"心悸胸闷"},{id:"dis_hyper_7",text:"鼻衄出血不止"},{id:"dis_hyper_8",text:"四肢发麻"},{id:"dis_hyper_9",text:"下肢水肿"},{id:"dis_hyper_10",text:"其他"}];
	        
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
        		//
				var result = HmsDownloadService.getHmspersonMain($scope.arch.identityno,ftpConfig,downloadedFiles);
				$scope.hyper.bpheigh=result.sbp;//收缩压
				$scope.hyper.bplow=result.dbp;//舒张压
				$scope.hyper.heartrate=result.fetalheart;//心率
        	}
        	
	        //----------------------------切换tab页时做的操作
	        $('.panel-heading ul li').bind("click",function(){
	        	var data=$(this).attr("data");  //获取需要展现的id名称
	        	$(this).siblings().removeAttr("class");//移除兄弟标签的属性
	        	$(this).attr("class","active");//给本级属性添加样式
	        	$(".show-div").children().css("display","none");//影藏
	        	if(data=='sfqkzj'){
	        		initializeHyper(('',0,1))
	        	}
	        	$("#"+data).css("display","block");//显示需要显示的模块
	        	
	        });

            //--------------触发下一步按钮的操作
            $scope.nextFunction= function(val){
            	$("#"+val+"n").siblings().removeAttr("class");//移除兄弟标签的属性
	        	$("#"+val+"n").attr("class","active");//给本级属性添加样式
	        	$(".show-div").children().css("display","none");//影藏
	        	if(val=='sfqkzj'){
	        		initializeHyper(('',0,1))
	        	}
	        	$("#"+val).css("display","block");//显示需要显示的模块
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
                	var today = new Date();
                    var todayStr = today.getFullYear()+'-'+(today.getMonth()+1)+"-"+today.getDate();
                	initializeHyper(todayStr,0,0);
                }else{
                    $.extend($scope.hyper,data);
                    initializeHyper($scope.hyper.inquiredate,1,0);//初始化页面
                }
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
              
            function initializeHyper(maxDate,haveMessage,initMessage){
            	if(initMessage==0){
	            	var datetime='1900-01-01';
	                var maxData={};
	                var arrayList=[];
	                var myQuery = LocalDBService.queryBuilder().$index('archid_idx').$eq(aid);
	                LocalDBService.objectStore("EHEALTH_DIS_HYPERTENSIONVISIT").each(function(cursor){
	    	            if(cursor){  
	    	            	if(datetime<cursor.value.inquiredate && (maxDate>cursor.value.inquiredate || maxDate==undefined || maxDate==null || maxDate=='')){
	    	            		datetime=cursor.value.inquiredate;
	    	            		maxData=cursor.value;
	    	            	}else{
	    	            	}
	    	            	arrayList.push({time:cursor.value.inquiredate,ssy:cursor.value.bpheigh,szy:cursor.value.bplow})
	    		            cursor.continue();
	    	            }
	                },myQuery).then(function(){
	                	if(arrayList){//线形图
		                	arrayList.sort(function(v1,v2){
		                		if(v1.time<v2.time){
		                			return -1;
		                		}else if(v1.time>v2.time){
		                			return 1;
		                		}else{
		                			return 0;
		                		}
		                	});
		                	var title=[];
		                	var ssy=[];
		                	var szy=[];
		                	for(var x=0;x<arrayList.length;x++){
		                		title[x]=arrayList[x].time;
		                		ssy[x]=parseInt(arrayList[x].ssy);
		                		szy[x]=parseInt(arrayList[x].szy);
	                		}
		                	$('#container').highcharts({
		            	        title: {
		            	            text: '血压变化情况',
		            	            x: -20 //center
		            	        },
		            	        xAxis: {
		            	            categories: title
		            	        },
		            	        yAxis: {
		            	            title: {
		            	                text: '血压值 (mmHg)'
		            	            },
		            	            plotLines: [{
		            	                value: 0,
		            	                width: 1,
		            	                color: '#808080'
		            	            }]
		            	        },
		            	        tooltip: {
		            	            valueSuffix: 'mmHg'
		            	        },
		            	        legend: {
		            	            layout: 'vertical',
		            	            align: 'right',
		            	            verticalAlign: 'middle',
		            	            borderWidth: 0
		            	        },
		            	        series: [{
		            	            name: '收缩压',
		            	            data: ssy
		            	        }, {
		            	            name: '舒张压',
		            	            data: szy
		            	        }]
		            	    });
	        	        
	                	}
	                	
	                	if(haveMessage==0){
	                		$scope.hyper.bodyheight=maxData.bodyheight;//历史升高自动带入
	                	}
	                	if(maxData.bpheigh!=undefined || maxData.bplow!=undefined){
	                		$scope.arguments.scclxy=maxData.bpheigh+' mmHg / '+maxData.bplow+' mmHg';//上次测量血压
	                	}
                		var yqjl=0; //遵医行为结论
	                	//------------------体重
	                	if($scope.hyper.bodyweight==undefined || $scope.hyper.bodyweight==''){
	                		$scope.arguments.targetweight=maxData.bodydweight;
	                		$scope.hyper.bodydweight='';
	                	}else{
	                		if($scope.hyper.bodyweight<=maxData.bodydweight){
	                    		$scope.arguments.targetweight=maxData.bodydweight;
	                			$scope.arguments.targetweightName='(达标)';
	                			yqjl++;
	                		}else if($scope.hyper.bodyweight>maxData.bodydweight){
	                    		$scope.arguments.targetweight=maxData.bodydweight;
	                			$scope.arguments.targetweightName='(未达标)';
	                			yqjl=yqjl-6;
	                		}
	                	}
	                	//-----------------吸烟
	                	if($scope.hyper.smoking==undefined || $scope.hyper.smoking==''){
	                		$scope.arguments.smokingdd=maxData.smokingd;
	                		$scope.hyper.smokingd='';
	                	}else{
	                		if($scope.hyper.smoking<=maxData.smokingd){
	                			$scope.arguments.smokingdd=maxData.smokingd;
	                			$scope.arguments.smokingddName='(达标)';
	                			yqjl++;
	                		}else if($scope.hyper.smoking>maxData.smokingd){
	                			$scope.arguments.smokingdd=maxData.smokingd;
	                			$scope.arguments.smokingddName='(未达标)';
	                			yqjl=yqjl-6;
	                		}
	                	}
	                	//-----------------饮酒
	                	if($scope.hyper.drinkwine==undefined || $scope.hyper.drinkwine==''){
	                		$scope.arguments.drinkwinedd=maxData.drinkwined;
	                		$scope.hyper.drinkwined='';
	                	}else{
	                		if($scope.hyper.drinkwine<=maxData.drinkwined){
	                			$scope.arguments.drinkwinedd=maxData.drinkwined;
	                			$scope.arguments.drinkwineddName='(达标)';
	                			yqjl++;
	                		}else if($scope.hyper.drinkwine>maxData.drinkwined){
	                			$scope.arguments.drinkwinedd=maxData.drinkwined;
	                			$scope.arguments.drinkwineddName='(未达标)';
	                			yqjl=yqjl-6;
	                		}
	                	}
	                	//-----------------摄盐
	                	if($scope.hyper.food==undefined || $scope.hyper.food==''){
                			if(maxData.saltd=='HR382_1'){$('#syqka').val('轻');$('#syqka').attr("data",'HR382_1');}else if(maxData.saltd=='HR382_2'){$('#syqka').val('中');$('#syqka').attr("data",'HR382_2');}else if(maxData.saltd=='HR382_3'){$('#syqka').val('重');$('#syqka').attr("data",'HR382_3');}
	            			$scope.hyper.saltd='';
	                	}else{
	                		if($scope.hyper.food<=maxData.saltd){
	                			if(maxData.saltd=='HR382_1'){$('#syqka').val('轻');$('#syqka').attr("data",'HR382_1');}else if(maxData.saltd=='HR382_2'){$('#syqka').val('中');$('#syqka').attr("data",'HR382_2');}else if(maxData.saltd=='HR382_3'){$('#syqka').val('重');$('#syqka').attr("data",'HR382_3');}
	                			$('#sysfdb').val('(达标)');
	                			$('#yqsy').val('达');
	                			yqjl++;
	                		}else if($scope.hyper.food>maxData.saltd){
	                			if(maxData.saltd=='HR382_1'){$('#syqka').val('轻');$('#syqka').attr("data",'HR382_1');}else if(maxData.saltd=='HR382_2'){$('#syqka').val('中');$('#syqka').attr("data",'HR382_2');}else if(maxData.saltd=='HR382_3'){$('#syqka').val('重');$('#syqka').attr("data",'HR382_3');}
	                			$('#sysfdb').val('(未达标)');
	                			$('#yqsy').val('未达');
	                			yqjl=yqjl-6;
	                		}
	                	}
	                	//-----------------运动
	                	if(($scope.hyper.sportsweek==undefined || $scope.hyper.sportsweek=='') &&  ($scope.hyper.sportseach==undefined || $scope.hyper.sportseach=='') ){
	                		$scope.arguments.sportsweekdd=maxData.sportsweekd;
	                		$scope.arguments.sportsweekddd=maxData.sportseachd;
	                		$scope.hyper.saltd='';
	                	}else{
	                		if($scope.hyper.sportsweek>=maxData.sportsweekd && $scope.hyper.sportseach>=maxData.sportseachd){
	                			$scope.arguments.sportsweekdd=maxData.sportsweekd;
		                		$scope.arguments.sportsweekddd=maxData.sportseachd;
	                			$scope.arguments.sportsweekddName='(达标)';
	                			yqjl++;
	                		}else if($scope.hyper.sportsweek<maxData.sportsweekd || $scope.hyper.sportseach<maxData.sportseachd){
	                			$scope.arguments.sportsweekdd=maxData.sportsweekd;
		                		$scope.arguments.sportsweekddd=maxData.sportseachd;
	                			$scope.arguments.sportsweekddName='(未达标)';
	                			yqjl=yqjl-6;
	                		}
	                	}
	                	if(yqjl==5){
	                		$scope.arguments.yqjl='良好';
	                	}else if(yqjl>-30){
	                		$scope.arguments.yqjl='一般';
	                	}else if(yqjl<=-30){
	                		$scope.arguments.yqjl='差';
	                	}
	                	
	                	var checkedValue="";//本次随访症状
	                	var historyCheckedValue="";//上次随访症状
	                	if(maxData.mainsymptom!=undefined && maxData.mainsymptom!=''){
		                	for(var i=0;i<mainsymptom.length;i++){
		                		if(maxData.mainsymptom.indexOf(mainsymptom[i].id+";")>=0){
		                			historyCheckedValue+=mainsymptom[i].text+",";
		                		}
		                	}
	                	}
	                	$('input[name="mainsymptom"]:checked').each(function(){ 
	                		checkedValue+=$(this).attr('text')+",";
	    				 }); 
	                	$("#bcsfzz").text(checkedValue);
	                	$("#scsfzz").text(historyCheckedValue);
	                	if($scope.hyper.usedrug=='HR418_1'){$('#fyqk').text("规律服药");}else if($scope.hyper.usedrug=='HR418_2'){$('#fyqk').text("间断服药");}else if($scope.hyper.usedrug=='HR418_3'){$('#fyqk').text("不服药");}
            			
	                	
	                },function(){
	                	alert("error");
	                });
            	}else{
            		//-----------------吸烟
                	if($scope.hyper.smoking<=$scope.arguments.smokingdd){
                		fyqk++;
                	}else if($scope.hyper.smoking>$scope.arguments.smokingdd){
                		fyqk=fyqk-6;
                	}
                	//-----------------饮酒
                	if($scope.hyper.drinkwine<=$scope.arguments.drinkwinedd){
                		fyqk++;
                	}else if($scope.hyper.drinkwine>$scope.arguments.drinkwinedd){
                		fyqk=fyqk-6;
                	}
            		//-----------------摄盐
                	if($scope.hyper.food<=$('#syqka').attr("data")){
                		fyqk++;
                	}else if($scope.hyper.food>$('#syqka').attr("data")){
                		fyqk=fyqk-6;
                	}
                	//-----------------运动
                	if($scope.hyper.sportsweek>=$scope.arguments.sportsweekdd &&$scope.hyper.sportseach>=$scope.arguments.sportsweekddd){
                		fyqk++;
                	}else if($scope.hyper.sportsweek<$scope.arguments.sportsweekdd || $scope.hyper.sportseach<$scope.arguments.sportsweekddd){
                		fyqk=fyqk-6;
                	}
            		 //遵医行为结论
            		if(fyqk==5){
                		$scope.arguments.yqjl='良好';
                		fyqk=0;
                	}else if(fyqk>-30){
                		$scope.arguments.yqjl='一般';
                		fyqk=0;
                	}else if(fyqk<=-30){
                		$scope.arguments.yqjl='差';
                		fyqk=0;
                	}
                	var checkedValue="";
                	$('input[name="mainsymptom"]:checked').each(function(){ 
                		checkedValue+=$(this).attr('text')+",";
    				 }); 
                	$("#bcsfzz").text(checkedValue);
            	}
            };
            
            $scope.fyqkBmi = function(){
            	//-----------------吸烟
            	if($scope.hyper.smoking<=$scope.arguments.smokingdd){
            		$scope.arguments.smokingddName='(达标)';
            	}else if($scope.hyper.smoking>$scope.arguments.smokingdd){
            		$scope.arguments.smokingddName='(未达标)';
            	}
            	//-----------------饮酒
            	if($scope.hyper.drinkwine<=$scope.arguments.drinkwinedd){
            		$scope.arguments.drinkwineddName='(达标)';
            	}else if($scope.hyper.drinkwine>$scope.arguments.drinkwinedd){
            		$scope.arguments.drinkwineddName='(未达标)';
            	}
        		//-----------------摄盐
            	if($scope.hyper.food<=$('#syqka').attr("data")){
            		$('#sysfdb').val('(达标)');
            		$('#yqsy').val('达');
            	}else if($scope.hyper.food>$('#syqka').attr("data")){
            		$('#sysfdb').val('(未达标)');
            		$('#yqsy').val('未达');
            	}
            	//-----------------运动
            	if($scope.hyper.sportsweek>=$scope.arguments.sportsweekdd &&$scope.hyper.sportseach>=$scope.arguments.sportsweekddd){
            		$scope.arguments.sportsweekddName='(达标)';
            	}else if($scope.hyper.sportsweek<$scope.arguments.sportsweekdd || $scope.hyper.sportseach<$scope.arguments.sportsweekddd){
            		$scope.arguments.sportsweekddName='(未达标)';
            	}
            	
            }
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
            	if($scope.hyper.bodyweight<=$scope.arguments.targetweight){
            		$scope.arguments.targetweightName='(达标)';
            		fyqk++;
            	}else if($scope.hyper.bodyweight>$scope.arguments.targetweight){
            		$scope.arguments.targetweightName='(未达标)';
            		fyqk=fyqk-6;
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
            $('#getWindow').bind("click",function(){
	        	var _z=9000;//新对象的z-index
	        	var _mv=false;//移动标记
	        	var _x,_y;//鼠标离控件左上角的相对位置		
	        	var _obj= $("#detail");
	        	var _wid= _obj.width();
	        	var _hei= _obj.height();
	        	var _tit= _obj.find(".tit");
	        	var _cls =_obj.find(".close");
	        	var docE =document.documentElement;
	        	var left=($(document).width()-_obj.width())/2;
	        	var top =(docE.clientHeight-_obj.height())/2;
	        	_obj.css({	"left":left,"top":top,"display":"block","z-index":_z-(-1)});
	        			
	        	_tit.mousedown(function(e){
	        		_mv=true;
	        		_x=e.pageX-parseInt(_obj.css("left"));//获得左边位置
	        		_y=e.pageY-parseInt(_obj.css("top"));//获得上边位置
	        		_obj.css({	"z-index":_z-(-1)}).fadeTo(50,.5);//点击后开始拖动并透明显示	
	        	});
	        	_tit.mouseup(function(e){
	        		_mv=false;
	        		_obj.fadeTo("fast",1);//松开鼠标后停止移动并恢复成不透明				 
	        	
	        	});
	        	
	        	$(document).mousemove(function(e){
	        		if(_mv){
	        			var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
	        			if(x<=0){x=0};
	        			x=Math.min(docE.clientWidth-_wid,x)-5;
	        			var y=e.pageY-_y;
	        			if(y<=0){y=0};
	        			y=Math.min(docE.clientHeight-_hei,y)-5;
	        			_obj.css({
	        				top:y,left:x
	        			});//控件新位置
	        		}
	        	});

	        	_cls.live("click",function(){
	        		$(this).parent().parent().hide();
	        		$("#maskLayer").remove();
	        	});
	        			
	        	$('<div id="maskLayer"></div>').appendTo("body").css({
	        		"background":"#000","opacity":".4","top":0,"left":0,"position":"absolute","zIndex":"8000"
	        	});
	        	reModel();
	        	$(window).bind("resize",function(){reModel();});
	        	$(document).keydown(function(event) {
	        		if (event.keyCode == 27) {
	        			$("#maskLayer").remove();
	        			_obj.hide();
	        		}
	        	});
	        	function reModel(){
	        		var b = docE? docE : document.body,
	        		height = b.scrollHeight > b.clientHeight ? b.scrollHeight : b.clientHeight,
	        		width = b.scrollWidth > b.clientWidth ? b.scrollWidth : b.clientWidth;
	        		$("#maskLayer").css({
	        			"height": height,"width": width
	        		});
	        	};
	        });
            
        }
    ]);
    
});