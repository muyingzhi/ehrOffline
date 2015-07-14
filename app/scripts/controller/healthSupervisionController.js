console.log("healthSupervisionController...");
define(['controller/controllers','jquery','dictsConstant',
        'directives/hysDatebox',
        'directives/hysNoneDatebox'
       ],function(app){
	    app.controller("healthSupervisionController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
	    		$rootScope.topNav = [];
                //---------用于存放参数信息
	            $scope.bgdjList=[];
		        
		        //---------字典加载
		        $scope.industry = dataDicts.industry;
		        $scope.industryT = dataDicts.industryT;
		        $scope.patroltypes = dataDicts.patroltype;
		        //---------医生字典
		        datadictService.listUSER().then(function(list){
		        	$scope.dictDoctor = list;
		        });
	            //----------------------------切换tab页时做的操作
		        $('.panel-heading ul li').bind("click",function(){
		        	var data=$(this).attr("data");  //获取需要展现的id名称
		        	$(this).siblings().removeAttr("class");//移除兄弟标签的属性
		        	$(this).attr("class","active");//给本级属性添加样式
		        	$(".show-div").children().children().css("display","none");//影藏
		        	$("#"+data).css("display","block");//显示需要显示的模块
		        	
		        });
		        
	            /**********************************卫生监督协管信息报告登记表***********************************/
	           
	            //----------卫生监督协管信息报告登记表
	            $indexedDB.objectStore("EHEALTH_SANIT_REPORTLIST").getAll().then(function(list){
                    if(angular.isArray(list)){
                    	$scope.bgdjList=list;
                    }else{
                        $.messager.alert("检索全部记录发生错误:",arguments);
                    }
                });
	            
		        $scope.bgdj={};
		        $scope.addBgdj = function(){
		        	if(checkValid()){
	            		return;
	            	}
		        	if(!$scope.bgdjList)$scope.bgdjList=[];
		        	var ops = {
		        			discover_date:$scope.bgdj.discover_date,
		        			info_type:$scope.bgdj.info_type,
		        			content:$scope.bgdj.content,
		        			report_user:$scope.bgdj.report_user,
		        			report_date:$scope.bgdj.report_date,
		        			icpcode:$rootScope.currentUser.icpcode,
		        			cruser:$rootScope.currentUser.userid,
		                	storeSign:"1",
		        			crtime:getCrtime()
		        	}
		        	//插入卫生监督协管信息报告登记表getAll
		        	$indexedDB.objectStore("EHEALTH_SANIT_REPORTLIST").getAll().then(function(list){
		        		var num=0;
		        		for(var i=0;i<list.length;i++){
		        			if(num<list[i].reportlistid){
		        				num=list[i].reportlistid;
		        			}
		        		}
		        		ops.reportlistid  = (parseInt(num) + 1).toString();
	                },function(){
	                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
	                }).then(function(){
	                	$indexedDB.objectStore("EHEALTH_SANIT_REPORTLIST").upsert(ops).then(function(result){
	                        $.messager.alert(dataDicts.alertTitle,"保存成功");
	                    },function(result){
	                        $.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
	                        return;
	                    });
	                });
		        	$scope.bgdjList.push(ops);
		        	$scope.bgdj = {};
		        };
	            $scope.delBgdj = function(item){
		        	$indexedDB.objectStore("EHEALTH_SANIT_REPORTLIST").delete(item.reportlistid).then(function(result){
	                        $.messager.alert(dataDicts.alertTitle,"删除成功");
	                    },function(result){
	                        $.messager.alert(dataDicts.alertTitle,"删除失败:"+result);
	                        return;
	                    });
	            	var i = $scope.bgdjList.indexOf(item);
		        	if(i>=0){
		        		$scope.bgdjList.splice(i,1);//----删除
		        	}
		        };
		        
	            /******************************卫生监督协管巡查登记***************************************/
		        $scope.scdj={};
		        $scope.ArrayScdj=[];
		        //查询卫生监督协管巡查登记
		        $scope.getListScdj = function(){
		        	$scope.ArrayScdj=[];//--------------清空
		        	
		        	if($scope.scdjType!=undefined && $scope.scdjType!=''){//--------------以行业类别为主查询
		        		var myQuery = $indexedDB.queryBuilder().$index('class_idx').$eq($scope.scdjType);
		        	}else if ($scope.dwmc!=undefined && $scope.dwmc!=''){
		        		var myQuery = $indexedDB.queryBuilder().$index('compName_idx').$eq($scope.dwmc);
		        	}
		        	//如果行业类别或单位名称填写
		        	if(($scope.scdjType!=undefined && $scope.scdjType!='') || ($scope.dwmc!=undefined && $scope.dwmc!='')){
		        		$indexedDB.objectStore("EHEALTH_SANIT_COMPANY").each(function(cursor){
			 	            if(cursor){
			 	            	var cursorU=cursor.value;
			 	            	if($scope.scdjType!=undefined && $scope.scdjType!=''){
					        		if($scope.dwmc!=undefined && $scope.dwmc!=''){
					        			if(cursorU.comp_name==$scope.dwmc){
					        				var queryS=$indexedDB.queryBuilder().$index('company_id_idx').$eq(cursorU.id);
						        			$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").each(function(cursors){
								 	            if(cursors){
								 	            	cursors.value.comp_name=cursorU.comp_name;
								 	            	cursors.value.address=cursorU.address;
									        		$scope.ArrayScdj.push(cursors.value);
								 	                cursors.continue();
								 	            }
					        				},queryS).then(function(){},function(){alert("error");});
					        			}
					        		}else{
					        			var queryS=$indexedDB.queryBuilder().$index('company_id_idx').$eq(cursorU.id);
					        			$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").each(function(cursors){
							 	            if(cursors){
							 	            	cursors.value.comp_name=cursorU.comp_name;
							 	            	cursors.value.address=cursorU.address;
								        		$scope.ArrayScdj.push(cursors.value);
							 	                cursors.continue();
							 	            }
				        				},queryS).then(function(){},function(){alert("error");});
					        		}
					        	}else if ($scope.dwmc!=undefined && $scope.dwmc!=''){
					        		if($scope.scdjType!=undefined && $scope.scdjType!=''){
					        			if(cursorU.class1==$scope.scdjType){
					        				var queryS=$indexedDB.queryBuilder().$index('company_id_idx').$eq(cursorU.id);
					        				$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").each(function(cursors){
								 	            if(cursors){
								 	            	cursors.value.comp_name=cursorU.comp_name;
								 	            	cursors.value.address=cursorU.address;
									        		$scope.ArrayScdj.push(cursors.value);
								 	                cursors.continue();
								 	            }
					        				},queryS).then(function(){},function(){alert("error");});
					        			}
					        		}else{
					        			var queryS=$indexedDB.queryBuilder().$index('company_id_idx').$eq(cursorU.id);
					        			$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").each(function(cursors){
							 	            if(cursors){
							 	            	cursors.value.comp_name=cursorU.comp_name;
							 	            	cursors.value.address=cursorU.address;
								        		$scope.ArrayScdj.push(cursors.value);
							 	                cursors.continue();
							 	            }
				        				},queryS).then(function(){},function(){alert("error");});
					        		}
					        	}
			 	                cursor.continue();
			 	            };
			 	        },myQuery).then(function(){},function(){alert("error");});
		        	}else{//如果行业类别和单位名称都没有填写
		        		
		        		$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").getAll().then(function(list){
		        			if(list){
		        				pushArray(list,0)
		        			}
		                },function(){
		                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
		                }).then(function(){});
		        	}
		        }
		        
		        function pushArray(list,i){
		        	if(list[i]){
			        	$indexedDB.objectStore("EHEALTH_SANIT_COMPANY").find(list[i].company_id.toString()).then(function(data){
							if(data){
				        		list[i].comp_name=data.comp_name;
				        		list[i].address=data.address;
							}
			        		$scope.ArrayScdj.push(list[i]);
							i++;
							if(i<list.length){
								pushArray(list,i);
							}
			            },function(){
			                $.messager.alert(dataDicts.alertTitle,'取记录数错误');
			            }).then(function(){});
		        	}
		        }
		        //
		        $scope.addScdj = function(){
		        	//alert(new ActiveXObject("ADODB.Stream"))
		        	$scope.scdj.comp_name=$("#comp_name").val();
		        	$scope.scdj.address=$("#address").val();
		        	$scope.scdj.company_id=$("#company_id").val();
		        	if(checkValidS()){
	            		return;
	            	}
		        	if(!$scope.ArrayScdj)$scope.ArrayScdj=[];
		        	var ops = {
		        			//comp_name:$scope.scdj.comp_name,
		        			//address:$scope.scdj.address,
		        			company_id:parseInt($scope.scdj.company_id),
		        			check_user:$scope.scdj.check_user,
		        			check_date:$scope.scdj.check_date,
		        			patroltype:$scope.scdj.patroltype,
		        			content:$scope.scdj.content,
		        			problem:$scope.scdj.problem,
		        			remark:$scope.scdj.remark,
		        			
		        			icpcode:$rootScope.currentUser.icpcode,
		        			cruser:$rootScope.currentUser.userid,
		                	storeSign:"1",
		        			crtime:getCrtime()
		        	}
		        	//插入卫生监督协管信息报告登记表getAll
		        	$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").getAll().then(function(list){
		        		var num=0;
		        		for(var i=0;i<list.length;i++){
		        			if(num<list[i].patrollistid){
		        				num=list[i].patrollistid;
		        			}
		        		}
		        		ops.patrollistid  = (parseInt(num) + 1).toString();
	                },function(){
	                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
	                }).then(function(){
	                	$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").upsert(ops).then(function(result){
	                        $.messager.alert(dataDicts.alertTitle,"保存成功");
	                        
	                        ops.comp_name=$scope.scdj.comp_name;
	    		        	ops.address=$scope.scdj.address;
	    		        	$scope.ArrayScdj.push(ops);
	    		        	$scope.scdj = {};
	    		        	$("#comp_name").val();
	    		        	$("#address").val();
	    		        	$("#company_id").val();
	                    },function(result){
	                        $.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
	                        return;
	                    });
	                });
		        };
	            $scope.delScdj = function(item){
		        	$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").delete(item.patrollistid).then(function(result){
	                        $.messager.alert(dataDicts.alertTitle,"删除成功");
	                    },function(result){
	                        $.messager.alert(dataDicts.alertTitle,"删除失败:"+result);
	                        return;
	                    });
	            	var i = $scope.ArrayScdj.indexOf(item);
		        	if(i>=0){
		        		$scope.ArrayScdj.splice(i,1);//----删除
		        	}
		        };
		        
		        datadictService.listTGOV().then(function(list){
			        $("#scdj").datagrid({
			            singleSelect:true,
			            //title:"选择登记单位",
			            width:'100%',
			            toolbar:"#getListScdj",
			            rownumbers:true,
			            pagination:true,
			            pageSize:10,
			            loadFilter:pagerFilter,
			            loadData:getData,
			            columns:[[
					        {field:'id',title:'ID',hidden:true},
			                {field:'icpcode',title:'机构名称',formatter:function(value,row,index){
			                    var name
			                    for(var i=0;i<list.length;i++){
			                        var item = list[i];
			                        if(item.id==value){
			                            name = item.text;
			                        }
			                    }
			                    return name;
			                }},
			                {field:'comp_name',title:'单位名称'},
			                {field:'class1',title:'行业类别',formatter:function(value,row,index){
			                    var name
			                    for(var i=0;i<$scope.industry.length;i++){
			                        var item = $scope.industry[i];
			                        if(item.id==value){
			                            name = item.text;
			                        }
			                    }
			                    return name;
			                }},
			                {field:'class2',title:'二级分类',formatter:function(value,row,index){
			                    var name
			                    for(var i=0;i<$scope.industryT.length;i++){
			                        var item = $scope.industryT[i];
			                        if(item.id==value){
			                            name = item.text;
			                        }
			                    }
			                    return name;
			                }},
			                {field:'address',title:'单位地址'}
			            ]],
			            onClickRow: function(index,field,value){
				        	$("#comp_name").val(field.comp_name);
				        	$("#address").val(field.address);
				        	$("#company_id").val(field.id);
			        		$("#detail").hide();
			        		$("#maskLayer").remove();
		            	}
			        });
		        });
		        
		        //------------------------查询登记单位
		        $scope.getListScdjs = function(){
		        	var cxType = $('#cxType').val(),cxmc=$('#cxmc').val(),index='';
		        	if(cxType=='dwmc'){
		        		index='compName_idx';
		        	}else{
		        		index='address_idx';
		        	}
		        	if(cxmc!=undefined && cxmc!=''){
			        	$indexedDB.objectStore("EHEALTH_SANIT_COMPANY").find(index,cxmc).then(function(datas){
			        		$("#scdj").datagrid({data:[datas]});
			            },function(){
			                $.messager.alert(dataDicts.alertTitle,'取记录数错误');
			            }).then(function(){});
		        	}else{
		        		$indexedDB.objectStore("EHEALTH_SANIT_COMPANY").getAll().then(function(list){

		        			if(list){
		        				 $("#scdj").datagrid({data:list});
		        			}
			            },function(){
			                $.messager.alert(dataDicts.alertTitle,'取记录数错误');
			            }).then(function(){});
		        	}
		        }
		        function getData(){
		            var rows = [];
		            return rows;
		        }
		        function pagerFilter(data){
		            if (typeof data.length == 'number' && typeof data.splice == 'function'){    // is array
		                data = {
		                    total: data.length,
		                    rows: data
		                }
		            }
		            var dg = $(this);
		            var opts = dg.datagrid('options');
		            var pager = dg.datagrid('getPager');
		            pager.pagination({
		                onSelectPage:function(pageNum, pageSize){
		                    opts.pageNumber = pageNum;
		                    opts.pageSize = pageSize;
		                    pager.pagination('refresh',{
		                        pageNumber:pageNum,
		                        pageSize:pageSize
		                    });
		                    dg.datagrid('loadData',data);
		                }
		            });
		            if (!data.originalRows){
		                data.originalRows = (data.rows);
		            }
		            var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
		            var end = start + parseInt(opts.pageSize);
		            data.rows = (data.originalRows.slice(start, end));
		            return data;
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
	            };
	            //检查校验项目
	            function checkValid(){
	            	var bHasInvalidElm = false;
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if(!$scope.bgdj.discover_date){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>发现时间</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.bgdj.info_type){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>信息类别</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.bgdj.report_user){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>报告人</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.bgdj.report_date){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>报告时间</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(warning){
	            		$.messager.alert(dataDicts.alertTitle,warning);
	            	}
	            	return bHasInvalidElm;
	            };
	          //检查校验项目
	            function checkValidS(){
	            	var bHasInvalidElm = false;
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if(!$scope.scdj.company_id){
	            		warning += (++nInvalidCount) + '.' + "单位通过[<font color='red'>选择</font>]按钮赋值" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.scdj.comp_name){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>单位名称</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.scdj.address){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>单位地址</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.scdj.check_user){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>检查人</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.scdj.check_date){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>检查时间</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(warning){
	            		$.messager.alert(dataDicts.alertTitle,warning);
	            	}
	            	return bHasInvalidElm;
	            };
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

/*
datadictService.listUSER().then(function(list){
	$scope.dictDoctor = list;
    $('#scdj').datagrid({
        title:'卫生监督协管巡查登记',
        width:'100%',
        pagination:true,
        
        remoteSort:false,
        singleSelect:true,
        nowrap:false,
        fitColumns:true, 
        toolbar:'#getListScdj', 
        columns:[[
            {field:'comp_name',title:'单位名称',width:120},
            {field:'check_date',title:'检查时间',width:80,sortable:true},
            {field:'content',title:'内容',width:100,align:'right',sortable:true},
            {field:'problem',title:'发现问题',width:100,align:'right',sortable:true},
            {field:'check_user',title:'检查人',width:60,sortable:true}
        ]],
        view: detailview,
        detailFormatter: function(rowIndex, rowData){
    	 	return '';
        }
    });
});

//查询卫生监督协管巡查登记
$scope.getListScdj = function(){
	var ArrayScdj=[];
	$("#scdj").datagrid({data:[]});
	
	if($scope.scdjType!=undefined && $scope.scdjType!=''){
		var myQuery = $indexedDB.queryBuilder().$index('class_idx').$eq($scope.scdjType);
	}else if ($scope.dwmc!=undefined && $scope.dwmc!=''){
		var myQuery = $indexedDB.queryBuilder().$index('compName_idx').$eq($scope.dwmc);
	}
	//如果行业类别或单位名称填写
	if(($scope.scdjType!=undefined && $scope.scdjType!='') || ($scope.dwmc!=undefined && $scope.dwmc!='')){
		var ArrayList=[];
		$indexedDB.objectStore("EHEALTH_SANIT_COMPANY").each(function(cursor){
	            if(cursor){
	            	ArrayList.push(cursor.value);
	                cursor.continue();
	            };
	        },myQuery).then(function(){
	        	if(ArrayList && ArrayList.length>0){
	        		for(var i=0;i<ArrayList.length;i++){
	        			var listArray={};
	        			listArray=ArrayList[i];
	 	        	if($scope.scdjType!=undefined && $scope.scdjType!=''){
		        		if($scope.dwmc!=undefined && $scope.dwmc!=''){
		        			if(listArray.comp_name==$scope.dwmc){
		        				$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").find('company_id_idx',listArray.id).then(function(data){
						        	var isTrue=0;
					        		if($scope.startDate!=undefined && $scope.startDate!='' && data.check_date<$scope.startDate){
					        			isTrue=1;
					        		}
					        		if($scope.endDate!=undefined && $scope.endDate!='' && data.check_date>$scope.endDate){
					        			isTrue=1;
					        		}
					        		if(isTrue==0){
					        			data.comp_name=listArray.comp_name;
					        			data.address=listArray.address;
					        			ArrayScdj.push(data)
					        		}
				                },function(){
				                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
				                }).then(function(){
				                	if(i==ArrayList.length){
					 	        		 $("#scdj").datagrid({data:ArrayScdj});
					 	        	}
				                });
		        			}
		        		}else{
		        			$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").find('company_id_idx',listArray.id).then(function(data){

		        				var isTrue=0;
				        		if($scope.startDate!=undefined && $scope.startDate!='' && data.check_date<$scope.startDate){
				        			isTrue=1;
				        		}
				        		if($scope.endDate!=undefined && $scope.endDate!='' && data.check_date>$scope.endDate){
				        			isTrue=1;
				        		}
				        		if(isTrue==0){
				        			data.comp_name=listArray.comp_name;
				        			data.address=listArray.address;
				        			ArrayScdj.push(data)
				        		}
			                },function(){
			                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
			                }).then(function(){
			                	if(i==ArrayList.length){
				 	        		 $("#scdj").datagrid({data:ArrayScdj});
				 	        	}
			                });
		        		}
		        	}else if ($scope.dwmc!=undefined && $scope.dwmc!=''){
		        		if($scope.scdjType!=undefined && $scope.scdjType!=''){
		        			if(listArray.class1==$scope.scdjType){
		        				$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").find('company_id_idx',listArray.id).then(function(data){
						        	var isTrue=0;
					        		if($scope.startDate!=undefined && $scope.startDate!='' && data.check_date<$scope.startDate){
					        			isTrue=1;
					        		}
					        		if($scope.endDate!=undefined && $scope.endDate!='' && data.check_date>$scope.endDate){
					        			isTrue=1;
					        		}
					        		if(isTrue==0){
					        			data.comp_name=listArray.comp_name;
					        			data.address=listArray.address;
					        			ArrayScdj.push(data)
					        		}
				                },function(){
				                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
				                }).then(function(){
				                	if(i==ArrayList.length){
					 	        		 $("#scdj").datagrid({data:ArrayScdj});
					 	        	}
				                });
		        			}
		        		}else{
		        			$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").find('company_id_idx',listArray.id).then(function(data){
					        	var isTrue=0;
				        		if($scope.startDate!=undefined && $scope.startDate!='' && data.check_date<$scope.startDate){
				        			isTrue=1;
				        		}
				        		if($scope.endDate!=undefined && $scope.endDate!='' && data.check_date>$scope.endDate){
				        			isTrue=1;
				        		}
				        		if(isTrue==0){
				        			data.comp_name=listArray.comp_name;
				        			data.address=listArray.address;
				        			ArrayScdj.push(data)
				        		}
			                },function(){
			                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
			                }).then(function(){
			                	if(i==ArrayList.length){
				 	        		 $("#scdj").datagrid({data:ArrayScdj});
				 	        	}
			                });
		        		}
		        	}
	        		}
	        	}
	        },function(){
	            alert("error");
	        });
	}else{//如果行业类别和单位名称都没有填写
		var ArrayList=[];
		$indexedDB.objectStore("EHEALTH_SANIT_PATROLLIST").getAll().then(function(list){
			if(list){
				ArrayList=list;
			}
        },function(){
        	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
        }).then(function(){
        	var patro={};
			for(var i=0;i<ArrayList.length;i++){
        		var isTrue=0;
            	patro=ArrayList[i];
    			if($scope.startDate!=undefined && $scope.startDate!='' && ArrayList[i].check_date<$scope.startDate){
    				isTrue=1;
    			}
    			if($scope.endDate!=undefined && $scope.endDate!='' && ArrayList[i].check_date>$scope.endDate){
    				isTrue=1;
    			}
    			if(isTrue==0){
        			$indexedDB.objectStore("EHEALTH_SANIT_COMPANY").find(ArrayList[i].company_id).then(function(data){
        				patro.comp_name=data.comp_name;
        				patro.address=data.address;
	                },function(){
	                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
	                }).then(function(){
	        			ArrayScdj.push(patro)
	        			if(i==ArrayList.length){
	        				$("#scdj").datagrid({data:ArrayScdj});
	        			}
	                });
        		}
    		}
        });
	}
}

*/