define(['controller/controllers',
    'jquery','dictsConstant',
    'services/InterChangeService',
    'services/SysConfigService'
    ],function(app){
    app.controller("synDataDownload"
                ,['$rootScope','$scope','$routeParams','$location','$indexedDB','InterChangeService','SysConfigService','DataDictService'
        ,function($rootScope, $scope, $routeParams,$location, LocalDBService, interChangeService,sysConfigService,datadictService){
            //---------设置顶端菜单
            $rootScope.topNav = [];
            
            //--------页面模型
            var model = {
                downTypes:[{id:'0',text:'全部'}//
                			//,{id:'3',text:'健康体检'}
                            ,{id:'7',text:'糖尿病'}
                            ,{id:'8',text:'高血压'}
                            ,{id:'11',text:'老年人健康体检'}
                            
                            ,{id:'5',text:'婴幼儿随访'}
                            //,{id:'51',text:'新生儿家庭访视'}
                            //,{id:'52',text:'1以内儿童健康检查'}
                            //,{id:'53',text:'1～2岁儿童健康检查'}
                            //,{id:'54',text:'3～6岁儿童健康检查'}
                            
                            ,{id:'6',text:'孕产妇随访'}
                            //,{id:'61',text:'第一次产前检查'}
                            //,{id:'62',text:'第2-5次产前检查'}
                            //,{id:'63',text:'产后访视'}
                            //,{id:'64',text:'产后42天访视'}
                            ,{id:'12',text:'老年人中医药'}
                            ,{id:'41',text:'预防接种服务'}
                            ,{id:'92',text:'重性精神病'}],
                            
                downMonths:[{id:'-3',text:'前三个月'},
                           {id:'-2',text:'前二个月'},
                           {id:'-1',text:'前一个月'},
                           {id:'1',text:'未来一个月'},
                           {id:'2',text:'未来后二个月'},
                           {id:'3',text:'未来后三个月'}],
                archlist :[],
                message:null,
                detailMsgs:[],
                baseInfoStore : LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO"),
                hyperStore : LocalDBService.objectStore("EHEALTH_DIS_HYPERTENSIONVISIT"),
                dmStore : LocalDBService.objectStore("EHEALTH_DIS_DMVISIT"),
                schStore : LocalDBService.objectStore("EHEALTH_DIS_SCHIZOPHRENIAVISIT"),
                healthCheckAStore : LocalDBService.objectStore("EHEALTH_ARCH_HEALTHCHECKA"),
                zyStore : LocalDBService.objectStore("EHEALTH_ZY_VISIT"),
                govStore : LocalDBService.objectStore("T_GOVINFO"),
                hysuserStore : LocalDBService.objectStore("HYS_USER"),
                govDictStore : LocalDBService.objectStore("PUBLIC_GOV_DICT"),
                
                ladyvisitsStore : LocalDBService.objectStore("EHEALTH_LADY_VISITS"),
                ladyvisit42DaysStore : LocalDBService.objectStore("EHEALTH_LADY_VISIT42DAYS"),
                ladyfirstStore : LocalDBService.objectStore("EHEALTH_LADY_FIRSTCHECK"),
                ladyfetiferousStore : LocalDBService.objectStore("EHEALTH_LADY_FETIFEROUSCHECK"),
                
                kidvisitsStore : LocalDBService.objectStore("EHEALTH_KID_BABYVISITSRECORD"),
                kidcheckStore : LocalDBService.objectStore("EHEALTH_KID_BABYCHECKRECORD"),
                kid3yearcheckStore : LocalDBService.objectStore("EHEALTH_KID_KIDCHECKRECORD"),
                
                babyStandardStore: LocalDBService.objectStore("EHEALTH_KID_HEALTHCHECKSTANDAR"),
                icd10cardStore: LocalDBService.objectStore("EHEALTH_DIS_ICD10CARD"),
                drugListStore: LocalDBService.objectStore("DRUG_LIST_HOSPITAL"),
                
                immuInocucard: LocalDBService.objectStore("EHEALTH_IMMU_INOCUCARD"),

                loginFlag : false ,
                offPwdFlag : false ,
                findFlag : false ,
                downtypeFlag : false ,
                comboData : [] ,
                soap : {
                    header : {servicecode:"21011001",
                        apiversion:"1.0",
                        createtime:"2014-10-15 10:10:10",
                        govcode:"10001",
                        systemid:"3606000001",
                        username:"3606000001",
                        userpass:"3606000001"},
                    body : {userid:"",
                        password:"",
                        pernum:20}
                }
            };
            $.extend($scope,model);
            
            //------------------------------登录
            $scope.soapLogin = function(){
                //-------清空
                $scope.message = "";
                $scope.detailMsgs = [];
                $scope.archlist = [];
                $scope.comboData = [];
                $scope.soap.body.fullname = "";
                $scope.soap.body.areacode = "";
                $scope.soap.body.jmid = "";
                $scope.soap.body.userpwd = "";
                $scope.soap.body.userpwd2 = "";
                interChangeService.serv21011001($scope.soap.body.userid,$scope.soap.body.password)
	                .then(function(result){
	                    if(result.state==0){
	                        $scope.loginFlag = true;//---登录成功
	                        $scope.message = "登录成功";
	                        $scope.comboData = result.data;
                            //---------存入库中
                            $scope.govDictStore.upsert(result.data).then(function(result){
                                $scope.detailMsgs.push( "区划字典下载"+result);
                            },function(result){
                                $scope.detailMsgs.push( "区划字典下载保存失败:"+result);
                            });
                            //------------机构信息下载
                            var dictlist = [];
                            interChangeService.serv12140001().then(function(result){
                                if(result.state==0){
                                    for(var i=0 ;i< result.dictlist.length;i++){
                                        var dict = result.dictlist[i];
                                        $scope.govStore.upsert(dict).then(function(result){
                                            $scope.detailMsgs.push( "机构："+result);
                                        },function(result){
                                            $scope.detailMsgs.push( "机构下载保存失败:"+result);
                                        });
                                    }
                                }else{
                                    $scope.detailMsgs.push ( result.message);
                                }
                            });
                           
	                    }else{
	                        $scope.loginFlag = false;
	                        $scope.message = "登录失败:"+result.message;
	                    }
	                },function(){
                        alert("then error");
                    }
                );
            }
            
            //------------------------保存离线密码
            $scope.saveOffPwd = function(){
         	   if(!$scope.soap.body.userpwd){
                     $.messager.alert("提示","请输入“离线随访用户登录密码”");
                     return;
                 }
                 if($scope.soap.body.userpwd!=$scope.soap.body.userpwd2){
                     $.messager.alert("提示","二次输入用户密码不一致，请修改");
                     return;
                 }
                 $scope.offPwdFlag = true;
                 $scope.message = "登录成功";
                 $scope.detailMsgs = [];
                 $("#areacode").combotree({
 	                onClick: function(node){
 	                   $scope.soap.body.areacode = node.id;  // 选择区域的变化
 	                }
 	             });
                 $("#areacode").combotree("loadData",$scope.comboData);
                 //------------人员信息下载
                 var dictlist = [];
                 interChangeService.serv12140003().then(function(result){
                     if(result.state==0){
                         for(var i=0 ;i< result.dictlist.length;i++){
                             var dict = result.dictlist[i];
                             if(!dict.staffid){
                                 dict.staffid = dict.platuserid;
                             }
                             dict.password = $scope.soap.body.userpwd;
                             
                             $scope.hysuserStore.upsert(dict).then(function(result){
                                 $scope.detailMsgs.push( "人员："+result);
                                 //----人员
                                 datadictService.listUSER().then(function(list){
                                	 $scope.dictDoctors = list;
                                 })
                                 $scope.dictDoctor=$scope.soap.body.userid;
                             },function(result){
                                 $scope.detailMsgs.push( "人员下载保存失败:"+result);
                             });
                         }
                     }else{
                         $scope.detailMsgs.push ( result.message);
                     }
                 });
             }
            
            //--------档案类型改变时触发的事件
            $scope.archiveType = function(){
                var atype = $scope.downtype?$scope.downtype:"";
            	if(atype==undefined || atype==0 || atype==3 || atype==12 || atype==41 || atype==''){
            		$scope.downtypeFlag = false;
            	}else{
            		$scope.downtypeFlag = true;
            		$scope.downMonth='1';
            	}
            }
           
            //---------查找需要下载的信息
            $scope.findArch = function(){
                var fullname = $scope.soap.body.fullname?$scope.soap.body.fullname:"";
                var atype = $scope.downtype?$scope.downtype:"";
                //var amonth = $scope.downMonth?$scope.downMonth:"";
                var dictDoctor=$scope.dictDoctor?$scope.dictDoctor:"";
                var startTime=$scope.startTime?dt2dtStr($scope.startTime):"";
                var endTime=$scope.endTime?dt2dtStr($scope.endTime):"";
                if(!$scope.soap.body.areacode){
                	$.messager.alert("提示","请选择乡镇或者村！");
                    return;
                }
                $scope.archlist=[];
                $scope.message = "查询开始...";
                if(atype==undefined || atype==0 || atype==3 || atype==12 || atype==41 || atype==''){ //无需随访时间
	                interChangeService.serv21011004(
	                    $scope.soap.body.areacode,fullname,$scope.soap.body.jmid,atype,$scope.soap.body.pernum,1,dictDoctor
	                ).then(function(result){
	                    if(result.state==0){
	                        $scope.message = "查找成功";
	                        $scope.findFlag = true;
	                        for(var i=0;i<result.archlist.length;i++){
	                        	result.archlist[i].gender=(result.archlist[i].gender=="HR481_1")?"男":"女";
	                        }
	                        $scope.archlist = result.archlist;
	                    }else{
	                        $scope.message = result.message;
	                    }
	                });
                }else{
                	if(startTime=="" || endTime==""){
                		$.messager.alert("提示","请选择起始和终止日期！");
                		return "";
                	}
                	interChangeService.serv21011002(
                            $scope.soap.body.areacode,fullname,$scope.soap.body.jmid,atype,$scope.soap.body.pernum,1,dictDoctor,startTime,endTime
                        ).then(function(result){
                            if(result.state==0){
                                $scope.message = "查找成功";
                                $scope.findFlag = true;
                                for(var i=0;i<result.archlist.length;i++){
                                	result.archlist[i].gender=(result.archlist[i].gender=="HR481_1")?"男":"女";
                                }
                                $scope.archlist = result.archlist;
                            }else{
                                $scope.message = result.message;
                            }
                        });
                }
                $("#checkAll").bind("click", function () {
                    $("[name = checkJmid]:checkbox").attr("checked", this.checked);
                });
            }
            
            //ICD10编码下载
//            interChangeService.serv12120002()
//            .then(function(result){
//            	if(result.state==0){
//            	for(var i=0 ;i< result.icd10list.length;i++){
//                    var icd10 = result.icd10list[i];
//                    $scope.icd10cardStore.upsert(icd10).then(function(result){
////                    	$scope.detailMsgs.push( "ICD10编码："+result);
//                    },function(result){
//                        $scope.detailMsgs.push( "ICD10编码下载保存失败:"+result);
//                    });
//                }
//            	$scope.detailMsgs.push( "ICD10编码下载完成...");
//            	}else{
//            		$scope.detailMsgs.push ( result.message);
//            		}
//            });
            
            //儿童标准字典下载
            interChangeService.serv12140015()
            .then(function(result){
            	if(result.state==0){
            	for(var i=0 ;i< result.babylist.length;i++){
                    var babystandard = result.babylist[i];
                    $scope.babyStandardStore.upsert(babystandard).then(function(result){
                    	
                    },function(result){
                        $scope.detailMsgs.push( "儿童身高体重标准下载保存失败:"+result);
                    });
                }
            	$scope.detailMsgs.push( "儿童身高体重标准下载完成...");
            	}else{
            		$scope.detailMsgs.push ( result.message);
            		}
            });
            
            //---------函数:下载档案等内容
            $scope.downloadArch = function(){
                var list = $scope.archlist;
                var checkbox = "";
                //-------清空消息
                $scope.message = "";
                $scope.detailMsgs = [];
                //-------删除数据
                $scope.baseInfoStore.clear();
                $scope.hyperStore.clear();
                $scope.dmStore.clear();
                $scope.schStore.clear();
                $scope.healthCheckAStore.clear();
                $scope.zyStore.clear();
                $scope.ladyvisitsStore.clear();
                $scope.ladyvisit42DaysStore.clear();
                $scope.ladyfirstStore.clear();
                $scope.ladyfetiferousStore.clear();
                $scope.kidvisitsStore.clear();
                $scope.kidcheckStore.clear();
                $scope.kid3yearcheckStore.clear();
                //$scope.babyStandardStore.clear();
                $scope.immuInocucard.clear();
                //----------递归函数逐个下载档案
                $('input[name="checkJmid"]:checked').each(function(){ 
                	checkbox+=this.value+',';
				 }); 
                loadArch(0,$scope.archlist,checkbox);
                
//                serv12140004();
            };
            $scope.downloadAddArch = function(){
            	var list = $scope.archlist;
                var checkbox = "";
                //-------清空消息
                $scope.message = "";
                $scope.detailMsgs = [];
                //----------递归函数逐个下载档案
                $('input[name="checkJmid"]:checked').each(function(){ 
                	checkbox+=this.value+',';
				 }); 
                loadAddArch(0,$scope.archlist,checkbox);
            }
            
            //------------机构药品目录
            function serv12140004(){
                var druglist = [];
                interChangeService.serv12140004()
                .then(function(result){
                	if(result.state==0){
	                	for(var i=0 ;i< result.druglist.length;i++){
	                        var drug = result.druglist[i];
	                        $scope.drugListStore.upsert(drug).then(function(result){
//	                        	$scope.detailMsgs.push( "ICD10编码："+result);
	                        },function(result){
	                            $scope.detailMsgs.push( "机构药品目录下载保存失败:"+result);
	                        });
	                    }
	                	$scope.detailMsgs.push( "机构药品目录下载完成...");
                	}else{
                		$scope.detailMsgs.push ( result.message);
                	}
                });
            }
            
            //------------------清空下载
            function loadArch(index,list,checkbox){
                if(index>=list.length){
                    $scope.message = "下载完成";
                    return;
                }else{
                    if(index==0){
                        $scope.message = "开始下载...";
                    }else{
                        $scope.message = "开始下载..."+index;
                    }
                }
                var archobj = list[index];
                if(checkbox.indexOf(archobj.jmid)<0){
                	 loadArch(index+1,list,checkbox);
                }else{
                	var msg = "";
                 	return interChangeService.serv21011012(archobj.jmid,archobj.jmno,index).then(function(result){
	                    var index = result.index;
	                    if(result.state == 0 ){
		                    var infoArray = result.data;
		                    for(var i=0;i<infoArray.length;i++){
		                    	save2DB(infoArray[i].value,infoArray[i].type,archobj)
		                    }
		                    list[index].msg += "完成>>";
			                //--------下一个档案
		                    loadArch(index+1,list,checkbox);
		                }else{
		            	    //--------下一个档案
		                    loadArch(index+1,list,checkbox);
		                }
                 	});
                }
            };
            
            //---------------------累加下载
            function loadAddArch(index,list,checkbox){
            	if(index>=list.length){
                    $scope.message = "下载完成";
                    return;
                }else{
                    if(index==0){
                        $scope.message = "开始下载...";
                    }else{
                        $scope.message = "开始下载..."+index;
                    }
                }
            	 var archobj = list[index];
                 if(checkbox.indexOf(archobj.jmid)<0){
                 	 loadAddArch(index+1,list,checkbox);
                 }else{
                 	var msg = "";
                 	$scope.baseInfoStore.find(archobj.jmno).then(function(data){
                 		if(data==undefined || data=='' || data==null){
                 			return interChangeService.serv21011012(archobj.jmid,archobj.jmno,index).then(function(result){
                                var index = result.index;
                                if(result.state == 0 ){
                                    var infoArray = result.data;
                                    for(var i=0;i<infoArray.length;i++){
                                    	save2DB(infoArray[i].value,infoArray[i].type,archobj)
                                    }
                                    list[index].msg += "完成>>";
	                                //--------下一个档案
                                    loadAddArch(index+1,list,checkbox);
                                }else{
            	                    //--------下一个档案
                                	loadAddArch(index+1,list,checkbox);
                                }
                 			});
                 		}else{
                 			 //--------下一个档案
                         	list[index].msg = ">已下载√";
     	                    loadAddArch(index+1,list,checkbox);
                 		}
                     },function(error){
                         $.messager.alert(dataDicts.alertTitle,error);
                     });
                 }
            }
            //-----------格式转换后，保存到indexedDB
            function save2DB(record,type,archobj){
                if(archobj.msg==undefined){archobj.msg = "";}
                
                if(type=="2"){
                	var record;
                	record.isOld = "1";
                    record.storeSign = "0";//----未修改标志
                    record.arch_basicinfoid = record.arch_basicinfoid;
                    record.birthday   = dtStr2dt(record.birthday);
                    record.build_date = dtStr2dt(record.build_date);
                    record.crtime     = dtStr2dt(record.crtime);
                    if(record.opslist){
                        for(var i=0;i<record.opslist.length;i++){
                            var one = record.opslist[i];
                            one.crtime= dtStr2dt(one.crtime);
                            one.happend_time= dtStr2dt(one.happend_time);
                        }
                    }
                    if(record.familydislist){
                        for(var i=0;i<record.familydislist.length;i++){
                            var ops = record.familydislist[i];
                            ops.crtime= dtStr2dt(ops.crtime);
                        }
                    }
                    //------------保存到indexeddb
                    $scope.baseInfoStore.upsert(record).then(function(result){
                    	archobj.msg += ( "基本信息√："+result);
                    },function(result){
                    	archobj.msg += ( "基本信息X："+result);
                    });
                }else if(type=="3" || type=="11"){
                    record.isOld="1";
                    record.storeSign = "0";//----未修改标志
                    record.record_date = dtStr2dt(record.record_date);
                    record.crtime   = dtStr2dt(record.crtime);
                    if(record.hospitallist){//---住院史节点
                        for(var i=0;i<record.hospitallist.length;i++){
                            var one = record.hospitallist[i];
                            one.crtime   = dtStr2dt(one.crtime);
                            one.entertime= dtStr2dt(one.entertime);//入院日期
                            one.leavetime= dtStr2dt(one.leavetime);//出院日期
                        }
                    }
                    if(record.homebedlist){//---家庭病床节点
                        for(var i=0;i<record.homebedlist.length;i++){
                            var one = record.homebedlist[i];
                            one.crtime   = dtStr2dt(one.crtime);
                            one.buildtime= dtStr2dt(one.buildtime);//建床日期
                            one.canceltime=dtStr2dt(one.canceltime);//撤床日期
                        }
                    }
                    if(record.druglist){//---主要用药情况节点
                        for(var i=0;i<record.druglist.length;i++){
                            var one = record.druglist[i];
                            one.crtime= dtStr2dt(one.crtime);
                        }
                    }
                    if(record.inocutelist){//---非规划接种史节点
                        for(var i=0;i<record.inocutelist.length;i++){
                            var one = record.inocutelist[i];
                            one.crtime= dtStr2dt(one.crtime);
                            one.vaccination_date= dtStr2dt(one.vaccination_date);//接种日期
                        }
                    }
                    if(record.exposurelist){//---职业暴露列表节点
                        for(var i=0;i<record.exposurelist.length;i++){
                            var one = record.exposurelist[i];
                            one.crtime= dtStr2dt(one.crtime);
                            one.buildtime= dtStr2dt(one.buildtime);//建床日期
                            one.canceltime= dtStr2dt(one.canceltime);//撤床日期
                        }
                    }
                    if(record.eniorcitizenlist){//---老年人专项体检列表
                        for(var i=0;i<record.eniorcitizenlist.length;i++){
                            var one = record.eniorcitizenlist[i];
                            one.idiographdate= dtStr2dt(one.idiographdate);
                            one.inquiredate= dtStr2dt(one.inquiredate);
                            one.checkdate= dtStr2dt(one.checkdate);
                            one.crtime= dtStr2dt(one.crtime);
                            one.send_time= dtStr2dt(one.send_time);
                        }
                    }
                    //----------存储到indexeddb
                    $scope.healthCheckAStore.upsert(record).then(function(result){
                        archobj.msg += ( "健康体检√："+result);
                    },function(result){
                        archobj.msg += ( "健康体检╳:"+result);
                    });
                }else if(type=="8"){
                	record.isOld="1";
                    record.storeSign = "0";//----未修改标志
                    record.inquiredate   = dtStr2dt(record.inquiredate);
                    record.bookingdate   = dtStr2dt(record.bookingdate);
                    record.crtime   = dtStr2dt(record.crtime);
                    if(record.druglist){//---用药情况节点
                        for(var i=0;i<record.druglist.length;i++){
                            var one = record.druglist[i];
                            one.crtime= dtStr2dt(one.crtime);
                        }
                    }
                    $scope.hyperStore.upsert(record).then(function(result){
                        archobj.msg += ( "高血压随访√："+result);
                    },function(result){
                        archobj.msg += ("高血压随访╳:"+result);
                    });
                }else if(type=="7"){
                	record.isOld="1";
                    record.storeSign = "0";//----未修改标志
                    record.labdate   = dtStr2dt(record.labdate);
                    record.crtime   = dtStr2dt(record.crtime);
                    record.bookingdate   = dtStr2dt(record.bookingdate);
                    record.inquiredate   = dtStr2dt(record.inquiredate);
                    if(record.druglist){//---用药情况节点
                        for(var i=0;i<record.druglist.length;i++){
                            var one = record.druglist[i];
                            one.crtime= dtStr2dt(one.crtime);
                        }
                    }
                    $scope.dmStore.upsert(record).then(function(result){
                        archobj.msg += ( "糖尿病随访√"+result);
                    },function(result){
                        archobj.msg += ( "糖尿病随访╳:"+result);
                    });
                }else if(type=="92"){
                	record.isOld="1";
                    record.storeSign = "0";//----未修改标志
                    record.crtime   = dtStr2dt(record.crtime);
                    record.bookingdate   = dtStr2dt(record.bookingdate);
                    record.inquiredate   = dtStr2dt(record.inquiredate);
                    if(record.druglist){//---用药情况节点
                        for(var i=0;i<record.druglist.length;i++){
                            var one = record.druglist[i];
                            one.crtime= dtStr2dt(one.crtime);
                        }
                    }
                    $scope.schStore.upsert(record).then(function(result){
                        archobj.msg += ("重性精神疾病访√"+result);
                    },function(result){
                        archobj.msg += ( "重性精神疾病╳:"+result);
                    });
                }else if(type=="12"){
                	record.isOld="1";
                    record.storeSign = "0";//----未修改标志
                    record.inquiredate   = dtStr2dt(record.inquiredate);
                    $scope.zyStore.upsert(record).then(function(result){
                        archobj.msg += ("中医管理√"+result);
                    },function(result){
                        archobj.msg += ( "中医管理╳:"+result);
                    });
                }else if(type=="51"){
                	record.isOld="1";
                	record.storeSign = "0";//----未修改标志
                    record.birthday = dtStr2dt(record.birthday);
                    record.crtime = dtStr2dt(record.crtime);
                    record.currvisitstime = dtStr2dt(record.currvisitstime);
                    record.nextvisitstime = dtStr2dt(record.nextvisitstime);
                    record.bbtillsiftdate = dtStr2dt(record.bbtillsiftdate);
                    record.jdillsiftdate = dtStr2dt(record.jdillsiftdate);
                    record.othreillsiftdate = dtStr2dt(record.othreillsiftdate);
                    $scope.kidvisitsStore.upsert(record).then(function(result){
                        archobj.msg += ("儿童家庭随访√"+result);
                    },function(result){
                        archobj.msg += ("儿童家庭随访╳:"+result);
                    });
                }else if(type=="52"||type=="53"){
                	record.isOld="1";
                	record.storeSign = "0";//----未修改标志
                    record.crtime = dtStr2dt(record.crtime);
                    record.nextvisitstime = dtStr2dt(record.nextvisitstime);
                    record.visittime = dtStr2dt(record.visittime);
                    $scope.kidcheckStore.upsert(record).then(function(result){
                        archobj.msg += ("3岁内儿童体检√"+result);
                    },function(result){
                        archobj.msg += ("3岁内儿童体检╳:"+result);
                    });
                }else if(type=="54"){
                	record.isOld="1";
                	record.storeSign = "0";//----未修改标志
                    record.crtime = dtStr2dt(record.crtime);
                    record.nextvisitdate = dtStr2dt(record.nextvisitdate);
                    record.visittime = dtStr2dt(record.visittime);
                    $scope.kid3yearcheckStore.upsert(record).then(function(result){
                        archobj.msg += ("3岁以上儿童体检√"+result);
                    },function(result){
                        archobj.msg += ("3岁以上儿童体检╳:"+result);
                    });
                }else if(type=="61"){
                	record.isOld="1";
                	record.storeSign = "0";//----未修改标志
                	record.booking_date = dtStr2dt(record.booking_date);
                	record.crtime = dtStr2dt(record.crtime);
                	record.nextvisitdate = dtStr2dt(record.nextvisitdate);
                	record.last_menses = dtStr2dt(record.last_menses);
                	record.expected_childbirth = dtStr2dt(record.expected_childbirth);
                	if(record.scoremainlist){//---高危主记录
                        for(var i=0;i<record.scoremainlist.length;i++){
                            var one = record.scoremainlist[i];
                            one.birthdate = dtStr2dt(one.birthdate);
                            one.crtime = dtStr2dt(one.crtime);
                            one.diagnosedate = dtStr2dt(one.diagnosedate);
                            one.regressdate = dtStr2dt(one.regressdate);
                            if(one.scoredetaillist){//---高危明细
                                for(var j=0;j<one.scoredetaillist.length;j++){
                                    var onee = one.scoredetaillist[j];
                                    onee.crtime = dtStr2dt(onee.crtime);
                                }
                            }
                        }	
                	}
                	//console.log(JSON.stringify(record));
                    $scope.ladyfirstStore.upsert(record).then(function(result){
                        archobj.msg += ("产前首次检查√"+result);
                    },function(result){
                        archobj.msg += ("产前首次检查╳:"+result);
                    });
                }else if(type=="62"){
                	record.isOld="1";
                	record.storeSign = "0";//----未修改标志
                	record.crtime = dtStr2dt(record.crtime);
                	record.checkdate = dtStr2dt(record.checkdate);
                	record.nextvisitdate = dtStr2dt(record.nextvisitdate);
                	//console.log("产前检查:        "+JSON.stringify(record));
                    $scope.ladyfetiferousStore.upsert(record).then(function(result){
                        archobj.msg += ("产前检查√"+result);
                    },function(result){
                        archobj.msg += ("产前检查╳:"+result);
                    });
                }else if(type=="63"){
                	record.isOld="1";
                	record.storeSign = "0";//----未修改标志
                	record.checkdate = dtStr2dt(record.checkdate);
                	record.crtime = dtStr2dt(record.crtime);
                    record.nextvisitdate   = dtStr2dt(record.nextvisitdate);
                    $scope.ladyvisitsStore.upsert(record).then(function(result){
                        archobj.msg += ("产后访视√"+result);
                    },function(result){
                        archobj.msg += ("产后访视╳:"+result);
                    });
                }else if(type=="64"){
                	record.isOld="1";
                	record.storeSign = "0";//----未修改标志
                	record.crtime = dtStr2dt(record.crtime);
                	record.visit_date = dtStr2dt(record.visit_date);
                    $scope.ladyvisit42DaysStore.upsert(record).then(function(result){
                        archobj.msg += ("产后42天访视√"+result);
                    },function(result){
                        archobj.msg += ("产后42天访视╳:"+result);
                    });
                }else if(type=="41"){
                	record.isOld="1";
                	record.storeSign = "0";//----未修改标志
                	record.birthday = dtStr2dt(record.birthday);
                	//record.planedtime = dtStr2dt(record.planedtime);
                	record.settletime = dtStr2dt(record.settletime);
                	record.crtime = dtStr2dt(record.crtime);
                	record.moveoutdate = dtStr2dt(record.moveoutdate);
                	record.builddate = dtStr2dt(record.builddate);
                	record.send_time = dtStr2dt(record.send_time);
                	
                	if(record.inocunotelist){//---预防接种
                        for(var i=0;i<record.inocunotelist.length;i++){
                            var one = record.inocunotelist[i];
                            one.sinocudate = dtStr2dt(one.sinocudate);
                            one.inocudate = dtStr2dt(one.inocudate);
                            one.crtime = dtStr2dt(one.crtime);
                            one.validdate = dtStr2dt(one.validdate);
                            one.send_time = dtStr2dt(one.send_time);
                        }	
                	}
                    $scope.immuInocucard.upsert(record).then(function(result){
                        archobj.msg += ("预防接种√"+result);
                    },function(result){
                        archobj.msg += ("预防接种╳:"+result);
                    });
                }
            }

            //-------日期或日期时间的数字串(yyyymmddhhmmss)转成日期时间字符串(yyyy-mm-dd hh:mm:ss)
            function dtStr2dt(dtStr){
                var rtn="";
                if(dtStr){
	                if(dtStr.length==8){
	                    rtn = dtStr.substr(0,4)+"-"+dtStr.substr(4,2)+"-"+dtStr.substr(6,2);
	                }else if(dtStr.length==14){
	                    rtn = dtStr.substr(0,4)+"-"+dtStr.substr(4,2)+"-"+dtStr.substr(6,2) + " " + dtStr.substr(8,2)+":"+dtStr.substr(10,2)+":"+dtStr.substr(12,2);
	                }else{
	                    rtn = "("+dtStr+")"+"格式不符合要求.(应为yyyymmdd 或 yyyymmddhhmmss)";
	                }
                }
                return rtn;
            }

            //-------日期或日期时间的字符串(yyyy-mm-dd hh:mm:ss)格式化为(yyyymmddhhmmss)
            function dt2dtStr(dt){
                var rtn="";
                if(!dt){
                    rtn = undefined;
                }else{
	                if(dt.length==10){
	                    rtn = dt.substr(0,4) + dt.substr(5,2) + dt.substr(8,2);
	                }else if(dt.length==19){
	                    rtn = dt.substr(0,4) + dt.substr(5,2) + dt.substr(8,2) + dt.substr(11,2)+dt.substr(14,2)+dt.substr(17,2);
	                }else{
	                    rtn = "("+dt+")"+"格式不符合要求.(应为yyyy-mm-dd 或 yyyy-mm-dd hh:mm:ss)";
	                }
                }
                return rtn;
            }
        }
    ]);
});