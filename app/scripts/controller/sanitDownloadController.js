console.log("sanitDownloadController...");
define(['controller/controllers',
    'jquery','dictsConstant',
    'services/InterChangeService',
    'services/SysConfigService'
    ],function(app){
    app.controller("sanitDownloadController"
                ,['$rootScope','$scope','$routeParams','$location','$indexedDB','InterChangeService','SysConfigService','DataDictService'
        ,function($rootScope, $scope, $routeParams,$location, LocalDBService, interChangeService,sysConfigService,datadictService){
            //---------设置顶端菜单
            $rootScope.topNav = [];
            
            //--------页面模型
            var model = {
                downTypes:[
                           		{id:'43',text:'单位摸底登记'}
                          ],
                message:null,
                detailMsgs:[],                
                userHealtheduaction: LocalDBService.objectStore("EHEALTH_USER_HEALTHEDUACTION"),
                sanitCompany: LocalDBService.objectStore("EHEALTH_SANIT_COMPANY"),
                sanitReportlist: LocalDBService.objectStore("EHEALTH_SANIT_REPORTLIST"),
                sanitPatrollist: LocalDBService.objectStore("EHEALTH_SANIT_PATROLLIST"),
                
                govStore : LocalDBService.objectStore("T_GOVINFO"),
                hysuserStore : LocalDBService.objectStore("HYS_USER"),
                govDictStore : LocalDBService.objectStore("PUBLIC_GOV_DICT"),

                loginFlag : false ,
                offPwdFlag : false ,
                downtypeFlag : false ,
                comboData : [] ,
                soap : {
                    header : {servicecode:"21011001",
                        apiversion:"1.0",
                        createtime:"2014-10-15 10:10:10",
                        govcode:"10001",
                        systemid:"3606000001",
                        username:"3606000001",
                        userpass:"3606000001"
                    },
                    body : {
                        userid:"",
                        password:"",
                        pernum:20
                    }
                }
            };
            $.extend($scope,model);
            
            //------------------------------登录
            $scope.soapLogin = function(){
                //-------清空
                $scope.message = "";
                $scope.detailMsgs = [];
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
                 //------------机构信息下载
                 interChangeService.serv12140001().then(function(result){
                     if(result.state==0){
                         for(var i=0 ;i< result.dictlist.length;i++){
                             var dict = result.dictlist[i];
                             $scope.govStore.upsert(dict).then(function(result){
                                 $scope.detailMsgs.push( "机构字典下载："+result);
                             },function(result){
                                 $scope.detailMsgs.push( "机构下载保存失败:"+result);
                             });
                         }
                     }else{
                         $scope.detailMsgs.push ( result.message);
                     }
                 });
             }
            
          //---------函数:下载档案等内容
            $scope.downloadArch = function(){
                var list = $scope.archlist;
                var checkbox = "";
                //-------清空消息
                $scope.message = "";
                $scope.detailMsgs = [];
                //-------删除数据                
                $scope.userHealtheduaction.clear();
                $scope.sanitCompany.clear();
                $scope.sanitReportlist.clear();
                $scope.sanitPatrollist.clear();
                $scope.download();
            };
            $scope.downloadAddArch = function(){
            	var list = $scope.archlist;
                var checkbox = "";
                //-------清空消息
                $scope.message = "";
                $scope.detailMsgs = [];
                //----------递归函数逐个下载档案
                $scope.download();
            }
            
            $scope.download = function(){
            	var icpcode = $scope.soap.body.areacode?$scope.soap.body.areacode:"";
                var atype = $scope.downtype?$scope.downtype:"";
                var startTime=$scope.startTime?dt2dtStr($scope.startTime):"";
                var endTime=$scope.endTime?dt2dtStr($scope.endTime):"";
                var pernum = $scope.soap.body.pernum?$scope.soap.body.pernum:10;
                
            	if($scope.downtype!=undefined && ($scope.downtype=='42')){
	            	interChangeService.serv21011013(icpcode,atype,startTime,endTime,pernum).then(function(result){
	                   if(result.state == 0 ){
	                        if(result.list){
		                        for(var i=0;i<result.list.length;i++){
		                        	$scope.userHealtheduaction.upsert(result.list[i]).then(function(result){
		                        		$scope.detailMsgs.push( "健康教育活动下载保存成功:"+result);
		                            },function(result){
		                                $scope.detailMsgs.push( "健康教育活动下载保存失败:"+result);
		                            });
		                        }
	                        }
	                    }
	     			});
            	}else if($scope.downtype!=undefined && ($scope.downtype=='43' || $scope.downtype=='44' || $scope.downtype=='45')){
            		interChangeService.serv21011014(icpcode,atype,startTime,endTime,pernum).then(function(result){
 	                   if(result.state == 0 ){
 	                	   	if(result.list){
 	                           	//console.log(JSON.stringify(result));
 	                	   		for(var i=0;i<result.list.length;i++){
 	                           	//console.log(JSON.stringify(result.list[i]));
 	                	   			usertData(atype,result.list[i]);
 	                	   		}
	                        }
 	                    }
 	     			});
            	}
            }
            
            function usertData(atype,result){
            	//console.log(JSON.stringify(result));
            	if(atype==43){
            		$scope.sanitCompany.upsert(result).then(function(result){
            			$scope.detailMsgs.push( "监督单位下载保存成功:"+result);
                    },function(result){
                        $scope.detailMsgs.push( "监督单位下载保存失败:"+result);
                    });
            	}else if(atype==44){
            		$scope.sanitReportlist.upsert(result).then(function(result){
                    	$scope.detailMsgs.push( "卫生监督协管信息报告登记表保存成功:"+result);
                    },function(result){
                        $scope.detailMsgs.push( "卫生监督协管信息报告登记表下载保存失败:"+result);
                    });
            	}else if(atype==45){
            		$scope.sanitPatrollist.upsert(result).then(function(result){
                    	$scope.detailMsgs.push( "卫生监督协管巡查登记表下载保存成功:"+result);
                    },function(result){
                        $scope.detailMsgs.push( "卫生监督协管巡查登记表下载保存失败:"+result);
                    });
            	}
            }
            
            //--------下载类型改变时触发的事件
            $scope.archiveType = function(){
                var atype = $scope.downtype?$scope.downtype:"";
            	if(atype==undefined){
            		$scope.downtypeFlag = false;
            	}else{
            		$scope.downtypeFlag = true;
            		$scope.downMonth='1';
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