define(['controller/controllers',
    'dictsConstant',
    'services/InterChangeService',
    'services/SysConfigService'
    ],function(app){
    app.controller("synDataDownload"
                ,['$rootScope','$scope','$routeParams','$location','$indexedDB','InterChangeService','SysConfigService'
        ,function($rootScope, $scope, $routeParams,$location, LocalDBService, interChangeService,sysConfigService){
            //---------设置顶端菜单
            $rootScope.topNav = [];
            
            //--------页面模型
            var model = {
                downTypes:[{id:'0',text:'全部'}
                            ,{id:'8',text:'高血压'}
                            ,{id:'7',text:'糖尿病'}
                            ,{id:'3',text:'健康体检'}
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
            }
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
                //----------递归函数逐个下载档案
                $('input[name="checkJmid"]:checked').each(function(){ 
                	checkbox+=this.value+',';
				 }); 
                loadArch(0,$scope.archlist,checkbox);
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
                //------------人员信息下载
                var dictlist = [];
                interChangeService.serv12140003().then(function(result){
                    if(result.state==0){
//                        result.dictlist.push({
//                            govcode : "130723203",
//                            platuserid:"13422",
//                            staffid:"Kb099",
//                            username :"王佳文",
//                            sex :"2",
//                            birthday :"",
//                            departmentid :"",
//                            departmentname :"",
//                            roleid :"",
//                            handletime :"",
//                            status :"1"
//                        });
                        for(var i=0 ;i< result.dictlist.length;i++){
                            var dict = result.dictlist[i];
                            if(!dict.staffid){
                                dict.staffid = dict.platuserid;
                            }
                            dict.password = $scope.soap.body.userpwd;
                            
                            $scope.hysuserStore.upsert(dict).then(function(result){
                                $scope.detailMsgs.push( "人员："+result);
                            },function(result){
                                $scope.detailMsgs.push( "人员下载保存失败:"+result);
                            });
                        }
                    }else{
                        $scope.detailMsgs.push ( result.message);
                    }
                });
                
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
                            },function(result){
                                $scope.detailMsgs.push( "人员下载保存失败:"+result);
                            });
                        }
                    }else{
                        $scope.detailMsgs.push ( result.message);
                    }
                });
            }
            //---------查找
            $scope.findArch = function(){
                var fullname = $scope.soap.body.fullname?$scope.soap.body.fullname:"";
                var atype = $scope.downtype?$scope.downtype:"";
                var amonth = $scope.downMonth?$scope.downMonth:"";
                if(!$scope.soap.body.areacode){
                    alert("请选择乡镇或者村");
                    return;
                }
                interChangeService.serv21011004(
                    $scope.soap.body.areacode,fullname,$scope.soap.body.jmid,atype,$scope.soap.body.pernum,1,amonth
                ).then(function(result){
                    if(result.state==0){
                        $scope.message = "查找成功";
                        $scope.findFlag = true;
                        $scope.archlist = result.archlist;
                    }else{
                        $scope.message = result.message;
                    }
                });
                $("#checkAll").bind("click", function () {
                    $("[name = checkJmid]:checkbox").attr("checked", this.checked);
                });
            }
            //--------------登录
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
	                    }else{
	                        $scope.loginFlag = false;
	                        $scope.message = "登录失败:"+result.message;
	                    }
	                },function(){
                        alert("then error");
                    }
                );
            }
            //--------档案类型改变时触发的事件
            $scope.archiveType = function(){
            	if($scope.downtype==8 || $scope.downtype==7){
            		$scope.downtypeFlag = true;
            		$scope.downMonth='1';
            	}else{
            		$scope.downtypeFlag = false;
            	}
            }
            
            //--------档案详情
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
                    return interChangeService.serv21011003("2",archobj.jmid,archobj.jmno,index)
                    .then(function(result){
                        var index = result.index;
                        if(result.state == 0 ){
                            var arch = result.data;
                            arch.isOld = "1";
                            arch.storeSign = "0";//----未修改标志
                            arch.arch_basicinfoid = arch.arch_basicinfoid;
                            arch.birthday   = dtStr2dt(arch.birthday);
                            arch.build_date = dtStr2dt(arch.build_date);
                            arch.crtime     = dtStr2dt(arch.crtime);
                            if(arch.opslist){
                                for(var i=0;i<arch.opslist.length;i++){
                                    var one = arch.opslist[i];
                                    one.crtime= dtStr2dt(one.crtime);
                                    one.happend_time= dtStr2dt(one.happend_time);
                                }
                            }
                            if(arch.familydislist){
                                for(var i=0;i<arch.familydislist.length;i++){
                                    var ops = arch.familydislist[i];
                                    ops.crtime= dtStr2dt(ops.crtime);
                                }
                            }
                            //------------保存到indexeddb
                            $scope.baseInfoStore.upsert(arch).then(function(result){
                                list[index].msg = ">基本信息√";
                            },function(result){
                                list[index].msg =  "基本信息╳:"+result;
                            });
    	                    loadVisit(archobj,'11').then(function(){              //体检
    	                        loadVisit(archobj,'7').then(function(){           //糖尿病
    	                            loadVisit(archobj,'92').then(function(){      //重性精神疾病
    	                                loadVisit(archobj,'8').then(function(){   //高血压
                                            loadVisit(archobj,'12').then(function(){   //高血压
    			                                list[index].msg += "<完成";
    			                                //--------下一个档案
    			                                loadArch(index+1,list,checkbox);
                                            });
    	                                });
    	                            });
    	                        });
    	                    });
                        }else{
    	                    //--------下一个档案
    	                    loadArch(index+1,list,checkbox);
                        }
                    });
                }
                
            };
            //--------追加档案详情
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
                			return interChangeService.serv21011003("2",archobj.jmid,archobj.jmno,index)
                            .then(function(result){
                                var index = result.index;
                                if(result.state == 0 ){
                                    var arch = result.data;
                                    arch.isOld = "1";
                                    arch.storeSign = "0";//----未修改标志
                                    arch.arch_basicinfoid = arch.arch_basicinfoid;
                                    arch.birthday   = dtStr2dt(arch.birthday);
                                    arch.build_date = dtStr2dt(arch.build_date);
                                    arch.crtime     = dtStr2dt(arch.crtime);
                                    if(arch.opslist){
                                        for(var i=0;i<arch.opslist.length;i++){
                                            var one = arch.opslist[i];
                                            one.crtime= dtStr2dt(one.crtime);
                                            one.happend_time= dtStr2dt(one.happend_time);
                                        }
                                    }
                                    if(arch.familydislist){
                                        for(var i=0;i<arch.familydislist.length;i++){
                                            var ops = arch.familydislist[i];
                                            ops.crtime= dtStr2dt(ops.crtime);
                                        }
                                    }
                                    //------------保存到indexeddb
                                    $scope.baseInfoStore.upsert(arch).then(function(result){
                                        list[index].msg = ">基本信息√";
                                    },function(result){
                                        list[index].msg =  "基本信息╳:"+result;
                                    });
            	                    loadVisit(archobj,'11').then(function(){              //体检
            	                        loadVisit(archobj,'7').then(function(){           //糖尿病
            	                            loadVisit(archobj,'92').then(function(){      //重性精神疾病
            	                                loadVisit(archobj,'8').then(function(){   //高血压
                                                    loadVisit(archobj,'12').then(function(){   //高血压
            			                                list[index].msg += "<完成";
            			                                //--------下一个档案
            			                                loadAddArch(index+1,list,checkbox);
                                                    });
            	                                });
            	                            });
            	                        });
            	                    });
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
                	/*
                    */
                }
                
            };
            //--------各种随访下载
            function loadVisit(arch,type){
                //------获取一个档案的随访列表
                return interChangeService.serv21011005(type,arch.jmid,10,1)
                .then(function(result){
                    if(result.state == 0 ){
                        var list = result.datas;
                        if(list){
                            loadDetail(0,list,arch)
                        }
                    }else{
                        arch.msg += "**"+result.message;
                    }
                });
            };
            //--------递归函数，各种随访下载
            function loadDetail(index,list,archobj){
                if(index>=list.length){
                    return;
                }
                var visit = list[index];
                var archivetype = visit.type,
                    jmid = visit.jmid,
                    businessid =visit.businessid;
                return interChangeService.serv21011003(archivetype,jmid,businessid,index)
                .then(function(result){
                    var index = result.index;
                    if(result.state == 0 ){
                        var record = result.data;
                        //------------保存到indexeddb
                        save2DB(record,archivetype,archobj);
                    }else{
                        archobj.msg += (result.message);
                    }
                    //------下一个随访
                    loadDetail(index+1,list,archobj);
                });
            }
            //-----------格式转换后，保存到indexedDB
            function save2DB(record,type,archobj){
                if(archobj.msg==undefined){archobj.msg = "";}
                
                if(type=="11"){
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
                    //----------存储到indexeddb
                    $scope.healthCheckAStore.upsert(record).then(function(result){
                        archobj.msg += ( "健康体检√："+result);
                    },function(result){
                        archobj.msg += ( "健康体检╳:"+result);
                    });
                }else if(type=="8"){
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
                    record.storeSign = "0";//----未修改标志
                    //record.crtime   = dtStr2dt(record.crtime);
                    record.inquiredate   = dtStr2dt(record.inquiredate);
                    $scope.zyStore.upsert(record).then(function(result){
                        archobj.msg += ("中医管理√"+result);
                    },function(result){
                        archobj.msg += ( "中医管理╳:"+result);
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
                }else{
                    rtn = "日期字段值为undefined";
                }
                return rtn;
            }
        }
    ]);
});