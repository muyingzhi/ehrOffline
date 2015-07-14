console.log("vaccinationListController...");
define(['controller/controllers','jquery','dictsConstant',
        'directives/hysNoneDatebox'
       ],function(app){
	    app.controller("vaccinationListController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
	    	 	//----------读取参数，为表单赋值
            	var id = $routeParams.id;    
	    		//---------设置顶端菜单
		        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/vaccination/"}];
                //---------用于存放参数信息
	            $scope.dataList={};
		        //---------字典加载
	            $scope.gender = dataDicts.gender;
	            //----机构
	            datadictService.listTGOV().then(function(list){
	                $scope.dictTgov = list;
	            });
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	                $("#zycmrlist").datagrid({
	    	            singleSelect:true,
	                    rownumbers:true,
	                    width:'100%',
	    	            title:"中医体质管理随访列表(<span style='color:blue;'>蓝色:已接种疫苗 </span> <B>/</B> <span style='color:red;'>红色:到了时间未接种疫苗</span> )",
	    	            columns:[[
	  	    	            {field:'inocunoteid',title:'主键',hidden:true},	
	  	    	            //{field:'ck',checkbox:true},	  	    	          
	    	                {field:'type',title:'疫苗分类',width:50,formatter:function(value,row,index){
		    	            	if (value==1){
		    	            		return '一类';
		    	            	}else if(value==2){
		    	            		return '二类';
		    	            	}else if (value==3){
		    	            		return '二类(群体)';
		    	            	}else if (value==4){
		    	            		return '二类(应急)';
		    	            	}else{
		    	            		return value;
		    	            	}
    	                    }},
	    	                {field:'bacterinname',title:'疫苗名称',formatter:openDetail},
	    	                {field:'acuscount',title:'针次',formatter:openDetail},
	    	                {field:'description',title:'针次描述',formatter:openDetail},
	    	                {field:'inoculationSite',title:'接种部位',formatter:openDetail},
	    	                {field:'inoculationWay',title:'接种途径',formatter:openDetail},
	    	                {field:'inocudate',title:'接种日期'},
	    	                {field:'batchnumber',title:'疫苗批号',formatter:openDetail},
	    	                {field:'validdate',title:'有效日期'},
	    	                {field:'manufacturer',title:'生产企业'},
	    	                {field:'inocudoctor',title:'接种医生',formatter:function(value,row,index){
    	                        var name
    	                        for(var i=0;i<$scope.dictDoctor.length;i++){
    	                            var item = $scope.dictDoctor[i];
    	                            if(item.id==value){
    	                                name = item.text;
    	                            }
    	                        }
    	                        return name;
    	                    }},
	    	                {field:'sinocudate',title:'应接种日期',width:80},
	    	                {field:'inocustate',title:'接种状态',width:80,formatter:ageRender},
	    	                {field:'icpcode',title:'接种机构',width:80,formatter:function(value,row,index){
    	                        var name
    	                        for(var i=0;i<$scope.dictTgov.length;i++){
    	                            var item = $scope.dictTgov[i];
    	                            if(item.id==value){
    	                                name = item.text;
    	                            }
    	                        }
    	                        return name;
    	                    }},
	    	                {field:'remark',title:'备注',width:80}               
	    	            ]]
	    	            	                
	    	        });
	    	        
	            });

	            $indexedDB.objectStore("EHEALTH_IMMU_INOCUCARD").find(id).then(function(data){
        			if(data){
        				if(data.inocunotelist){
        					 $("#zycmrlist").datagrid({data:data.inocunotelist});
        				}
        			}
                },function(){
                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
                }).then(function(){});
	            
	            
	            function openDetail (value,row){
	            	if(!value)return "";
                	var nowdate=new Date();
                	var olddate = new Date(row.sinocudate.replace(/-/g,"/"));
					if (row.inocustate == '1'){
						return '<a href="#/vaccinationInfo/'+id+'&'+row.inocunoteid+'" style="color: blue">' + value + '</a>';
					}else if(nowdate>=olddate){
	                	var remark =row.remark;
	                	if ( remark=="已接种乙脑(减毒)" || remark=="已接种乙脑灭活疫苗" || remark=="已接种甲肝(减毒)" || remark=="已接种甲肝灭活疫苗"){
	                		return '<a href="#/vaccinationInfo/'+id+'&'+row.inocunoteid+'">' + value + '</a>';
                		}else{
                			return '<a href="#/vaccinationInfo/'+id+'&'+row.inocunoteid+'" style="color: red">' + value + '</a>';
                		}
					}else if(nowdate<olddate){
						return '<a href="#/vaccinationInfo/'+id+'&'+row.inocunoteid+'" style="color:black;">' + value + '</a>';
					}
				}
	            function ageRender(value,row){
	            	if(!value)return "";
                	var nowdate=new Date();
                	var olddate = new Date(row.sinocudate.replace(/-/g,"/"));
	            	var flag="否";
                	if (row.inocustate == '1'){
	            		flag="是";
						return '<a href="#/vaccinationInfo/'+id+'&'+row.inocunoteid+'" style="color: blue">' + flag + '</a>';
					}else if(nowdate>=olddate){
	                	var remark =row.remark;
	                	if ( remark=="已接种乙脑(减毒)" || remark=="已接种乙脑灭活疫苗" || remark=="已接种甲肝(减毒)" || remark=="已接种甲肝灭活疫苗"){
	                		return '<a href="#/vaccinationInfo/'+id+'&'+row.inocunoteid+'">' + flag + '</a>';
                		}else{
                			return '<a href="#/vaccinationInfo/'+id+'&'+row.inocunoteid+'" style="color: red">' + flag + '</a>';
                		}
					}else if(nowdate<olddate){
						return '<a href="#/vaccinationInfo/'+id+'&'+row.inocunoteid+'" style="color:black;">' + flag + '</a>';
					}
	            }
	        }
	    ]);
    
});