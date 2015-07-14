 console.log("ladyScoremainDetailController...");
define(['controller/controllers',
        'jquery','dictsConstant','dictsDangerScore',
        'directives/alert',
        'directives/isFloat',
        'directives/isNum',
        'directives/hysNoneDatebox'
        ],function(app){
	    app.controller("ladyScoremainDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','dictsDangerScore','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,dictsDangerScore,datadictService){
              
                //----------读取参数，为表单赋值
                var aid = $routeParams.aid;
                var cid = $routeParams.cid;
                var typ = $routeParams.typ;
                var taici = $routeParams.taici;
		        //---------用于存放高危参数信息
		        $scope.score={};
		        //---------用于存放妇幼信息
		        $scope.lady={};
		        //---------字典加载
		        $scope.regress = dataDicts.regress;
		        $scope.finalmark = dataDicts.finalmark;
		        
		        //--评分项加载
		        $scope.listScore=dictsDangerScore.listScore;
		        //----人员
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	            });
	            datadictService.listTGOV().then(function(list){
	                $scope.dictTGov = list;
	            })
	            
	            //----------读取一个档案
	            $indexedDB.objectStore("EHEALTH_ARCH_BASEINFO").find(aid).then(function(data){
		            if(data){
		            	$scope.arch = data;
		            }
	            },function(error){
	                    $.messager.alert(dataDicts.alertTitle,error);
	            });
	            
	            //高危评分列表加载
	            $("#scorelist").datagrid({
		            singleSelect:true,
		            title:"高危评分列表",
		            toolbar:[
		                     {text : '添加',iconCls : 'icon-add', handler:function(){addScore()}},
		                     {text : '刷新',iconCls : 'icon-reload',handler:function(){reloadList()}}
		            ],
		            columns:[[
				        {field:'scoremainid',title:'高危ID',width:80},
		                {field:'archid',title:'档案ID',width:80},
		                {field:'estivalue',title:'分数',width:100},
		                {field:'diagnosedate',title:'评分日期',width:140},
		                {field:'fetiferouscheckid',title:'评分类别',width:100,formatter:function(value,row,index){
		                    if(value==undefined || value=='' || value=='0'){
		                    	return '<span style="color:red;">产前首检</span>';
		                    }else{
		                    	return '<span style="color:blue;">产前检查</span>';
		                    }		                
		                 }},
		                {field:'icpcode',title:'体检机构',width:150,formatter:function(value,row,index){
		                    var name
		                    for(var i=0;$scope.dictTGov!=undefined && i<$scope.dictTGov.length;i++){
		                        var item = $scope.dictTGov[i];
		                        if(item.id==value){
		                            name = item.text;
		                        }
		                    }
		                    return name;
		                }}              
		            ]],
		            onClickRow: function(index,field,value){
	            		scoreDetail(field.scoremainid);
	            	}
		        });
	            
	            var list=[];
	            //刷新列表
	            function reloadList(){
		            if(typ==undefined || typ==0 || typ==''){
		            	//---------设置顶端菜单
				        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/firstcheck/"+aid+"&"+cid}];
				        
		            	//----------从产妇首检获取孕妇高危评分
			            $indexedDB.objectStore("EHEALTH_LADY_FIRSTCHECK").find(cid)
		                .then(function(data){
		                    if(data){
		                    	$scope.lady=data;
		                    	list=data.scoremainlist;
		                    	$("#scorelist").datagrid({data:list});
			        		}
		                },function(error){
				            alert("error");
		                });
		            }else{
		            	//---------设置顶端菜单
				        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/fetcheck/"+aid+"&"+taici+"&"+cid}];
				        
		            	//----------从产前检获取孕妇高危评分
			            $indexedDB.objectStore("EHEALTH_LADY_FETIFEROUSCHECK").find(cid)
		                .then(function(data){
		                    if(data){
		                    	$scope.lady=data;
		                    	list=data.scoremainlist;
		                    	$("#scorelist").datagrid({data:list});
			        		}
		                },function(error){
				            alert("error");
		                });
		            }
                	$("#scorelist").datagrid({data:list});
	            };
	            reloadList();//调用
	            
	            //保存数据
	            $scope.save = function(){
	            	if(checkValid()){return;}
	            	var scoreDetal=[];
	            	var sysdate=getCrtime();
	            	//获取得分明细
	            	$("input:radio:checked").each(function(){
	            		if(this.value>0){//只保存得分大于0的
		            		scoreDetal.push({
			            		archiveid:$scope.score.archiveid,
			            		crtime:sysdate,
			            		cruser:$rootScope.currentUser.userid,
			            		dangerscoreid:$(this).attr("dangerscoreid"),
			            		estivalue:this.value,
			            		icpcode:$rootScope.currentUser.icpcode,
			            		scoredetailid:($(this).attr("scoredetailid")!=undefined && $(this).attr("scoredetailid")!='')?$(this).attr("scoredetailid"):0,
			            		scoremainid:$scope.score.scoremainid
		            		});
	            		}
	            	});
	            	//if(typ==undefined || typ==0 || typ==''){
	            	//	$scope.score.firstcheckid=$scope.lady.firstcheckid;
	            	//}
	            	$scope.score.crtime=sysdate;//创建时间
	            	$scope.score.cruser=$rootScope.currentUser.userid;//创建人员
	            	$scope.score.icpcode=$rootScope.currentUser.icpcode;
	            	$scope.score.fetiferouscheckid=($scope.score.fetiferouscheckid!=undefined && $scope.score.fetiferouscheckid!='')?$scope.score.fetiferouscheckid:typ;//0或空为产前首次检查，其他数值为产检检查
	            	$scope.score.scoredetaillist=scoreDetal;
	            	if($scope.lady.scoremainlist){
	            		var i=0;
	            		for(i;i<$scope.lady.scoremainlist.length;i++){
	            			if($scope.lady.scoremainlist[i].scoremainid==$scope.score.scoremainid){
	            				$scope.lady.scoremainlist[i]=$scope.score;
	            				break;
	            			}
	            		}
	            		if($scope.lady.scoremainlist.length<=i){
	            			$scope.lady.scoremainlist.push($scope.score);
	            		}
	            	}else{
	            		$scope.lady.scoremainlist=[];
	            		$scope.lady.scoremainlist.push($scope.score);
	            	}
	            	$scope.lady.storeSign = "1";
            		if($scope.score.estivalue>5){//是否高危
            			$scope.lady.isdanger='HR396_1'; //是高危
            		}else{
            			$scope.lady.isdanger='HR396_0';//非高危 
            		}
	            	
	            	if(typ==undefined || typ==0 || typ==''){
		            	$indexedDB.objectStore("EHEALTH_LADY_FIRSTCHECK").upsert($scope.lady).then(function(result){
					        $.messager.alert(dataDicts.alertTitle,"保存成功");
			            },function(result){
			               	$.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
			            });
	            	}else{
	            		$indexedDB.objectStore("EHEALTH_LADY_FETIFEROUSCHECK").upsert($scope.lady).then(function(result){
					       $.messager.alert(dataDicts.alertTitle,"保存成功");
			            },function(result){
			               	$.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
			            });
	            	}
	            	console.log(JSON.stringify($scope.score));
	            }
	            $scope.closeAlert = function(){
	                alert("click close");
	            }
	            //计算总得分
	            $scope.chooseItem = function(){
	                var allScore=0;
	            	$("input:radio:checked").each(function(){
	            		allScore+=parseInt(this.value);
	            	});
	            	$scope.score.estivalue=allScore;
	            }
	            
	            //添加新高危
	            function addScore(){
	            	$scope.score.diagnosedate=''
            	 	$scope.score={};
            	 	if(list){
            	 		var num=0;
	            		for(var i=0;i<list.length;i++){
	            			if(num<list[i].scoremainid){
	            				num=list[i].scoremainid
	            			}
	            		}
	            		$scope.score.scoremainid=parseInt(num)+1;
	            	}else{
	            		$scope.score.scoremainid=1;
	            	}
            	 	$('#diagnosedate').val('');
            	 	$('#regressdate').val('');
            	 	if($scope.arch.birthday){
                		var birthday=new Date(Date.parse($scope.arch.birthday.replace(/-/g,"/")));
                		$scope.score.birthdate=birthday;//出生日期
                	}
                    $scope.score.archid = aid;
                    $scope.score.fullname = $scope.arch.fullname;
                    $scope.score.archiveid = $scope.arch.archid;
                    //$scope.arch.identityno = $scope.arch.identityno;
                	//radio 清值
 	            	$("input:radio").each(function(){
 	            		  $(this).removeAttr('checked');
 	            	});
    				$scope.$apply();
            	 	$(".container-fluid").css("display","block");
	            }
	            
	            //查看高危明细
	            function scoreDetail(id){
	            	$scope.score={};
                	if($scope.arch.birthday){
                		var birthday=new Date(Date.parse($scope.arch.birthday.replace(/-/g,"/")));
                		$scope.score.birthdate=birthday;//出生日期
                	}
                    $scope.score.archid = aid;
                    $scope.score.fullname = $scope.arch.fullname;
                    $scope.score.archiveid = $scope.arch.archid;
                   // $scope.score.identityno = $scope.arch.identityno;
                    
	            	if(list){
	            		var scoreMail={};//得分主记录
	            		var scoreDetal=[];//得分明细
	            		for(var i=0;i<list.length;i++){
	            			if(id==list[i].scoremainid){
	            				$.extend($scope.score,list[i]);
	            				scoreDetal=list[i].scoredetaillist;
	            			}
	            		}
	            	}
	            	//radio 清值
	            	$("input:radio").each(function(){
	            		  $(this).removeAttr('checked');
	            	}); 
	            	//radio 赋值
	            	if(scoreDetal){
	            		for(var i=0;i<scoreDetal.length;i++){
	            			$("#isinure"+scoreDetal[i].estivalue+"_"+scoreDetal[i].dangerscoreid).attr("checked","checked");
	            			$(".isinure"+scoreDetal[i].dangerscoreid).attr("scoredetailid",scoreDetal[i].scoredetailid);
	            		}
	            	}
	            	//强制angular model 双向绑定
    				$scope.$apply();
	            	$(".container-fluid").css("display","block");
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
	            	if($scope.frmAction.estivalue.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>评分总得分</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.diagnosedate.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>确诊日期</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if($scope.frmAction.isover.$error.required){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>高危结案标志</font>]" + "<br>";	
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