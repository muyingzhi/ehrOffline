define(['controller/controllers','services/DataDictService'],function(app){ 
    var controller = ['$rootScope','$scope','$location','$indexedDB','$routeParams','DataDictService'
        ,function($rootScope,$scope,$location,$indexedDB,$routeParams,datadictService){
            
        $scope.selectArch = function(id){
            $rootScope.rootParameter = id;
        }    
        //----------读取参数，为表单赋值
        var aid = $routeParams.aid;
        //----------产前首次检查ID
        var firstcheckid = 0;
        var taici=0;
        //---------设置顶端菜单
        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/archlist/"+aid}];
        
        var topTaici=0;
        var topJiean='lady_ja_2';
        var topLadyFirstcheck=$indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
        $indexedDB.objectStore("EHEALTH_LADY_FIRSTCHECK").each(function(cursor){
            if(cursor){
            	if(topTaici<cursor.value.taici){
            		topTaici=cursor.value.taici;
            		topJiean=cursor.value.isover;
            		topSign=cursor.value.storeSign;
            		topIsOld=cursor.value.isOld;
            	}
	            cursor.continue();
            }
        },topLadyFirstcheck).then(function(){
        	if(topJiean=='lady_ja_1' && topSign=='0' && topIsOld=='1'){
        		$rootScope.topNav=[];
        		$rootScope.topNav.push(
        				{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/archlist/"+aid},
        				{text:"新增",iconClass:"glyphicon-new-window",url:"#/arch/firstcheck/"+aid+"&"+0}
        		);
        	}else{
	        	var topLadyVisitdays = $indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
		        $indexedDB.objectStore("EHEALTH_LADY_VISIT42DAYS").each(function(cursor){
		            if(cursor){
		    	        if(topTaici==cursor.value.taicione){
		    	        	if(cursor.value.dealresult=='lady_42visit_deal_1' && cursor.value.storeSign=='0' && cursor.value.isOld=='1'){
		    	        		$rootScope.topNav=[];
		    	        		$rootScope.topNav.push(
		    	        				{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/archlist/"+aid},
		    	        				{text:"新增",iconClass:"glyphicon-new-window",url:"#/arch/firstcheck/"+aid+"&"+0}
		    	        		);
		    	        	}
		    	        }else{
		    	        	$rootScope.topNav=[];
			        		$rootScope.topNav.push(
			        				{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/archlist/"+aid}
			        		);
				            cursor.continue();
		    	        }
		            }
		        },topLadyVisitdays).then(function(){
		        	if(topTaici=='0'){
		        		$rootScope.topNav=[];
		        		$rootScope.topNav.push(
		        				{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/archlist/"+aid},
		        				{text:"新增",iconClass:"glyphicon-new-window",url:"#/arch/firstcheck/"+aid+"&"+0}
		        		);
		        	}
		        },function(){alert("error");});
        	}
        },function(){
            alert("error");
        });
        
        //---------初始化查询列表
        $scope.chanciChas=[];
        $scope.chanciCha="";
        
        //----人员字典
        datadictService.listUSER().then(function(list){
            $scope.dictDoctor = list;
	        $("#visitslist").datagrid({
	            singleSelect:true,
                rownumbers:true,
                pagination:true,
	            title:"孕产妇保健",
	            view:groupview,
                groupField:'ladyType',
                toolbar:'#tb', 
                groupFormatter:function(value,rows){
	        		var id=clone(rows).length-1;
	        		if(value=='产前首次检查'){
	        			return '<div style="float:left;width:270px;">'+value + ' - ' + id+'(次)</div>';
	        		}else if(value=='产前检查'){
	        			return '<div style="float:left;width:270px;">'+value + ' - ' + id+'(次)</div>';
	        		}else if(value=='产后访视'){
	        			return '<div style="float:left;width:270px;">'+value + ' - ' + id+'(次)</div>';
	        		}else if(value=='产后42天访视'){
	        			return '<div style="float:left;width:270px;">'+value + ' - ' + id+'(次)</div>';
	        		}
                },
	            columns:[[
	  	            {field:'ladyType',title:'IsD',hidden:true},
	                {field:'visitsid',title:'ID',width:50},
	                {field:'checkdate',title:'日期',width:100},
	                {field:'doctorname',title:'责任医师',width:100},
	                {field:'id3',title:'查看编辑',width:80,align:'center',formatter:function(value,row,index){
	                	if (row.ladyType == "产前首次检查" && row.visitsid!=undefined && row.visitsid!='') {
		                    return "<a href='#/arch/firstcheck/" + aid +"&" +row.visitsid +"' title='查看'><span class='font_blue glyphicon glyphicon-fire'></span>&nbsp;</a>";
	                	}
	                	//else if(row.ladyType == "产前首次检查" && (row.visitsid==undefined || row.visitsid=='')){
	                	//	return "<a style='color:red;' href='#/arch/firstcheck/" + aid +"&0' title='新增'><span class='font_red glyphicon glyphicon-plus'></span>&nbsp;</a>";
	                	//}
	                	if (row.ladyType == "产前检查" && row.visitsid!=undefined && row.visitsid!='') {
		                    return "<a href='#/arch/fetcheck/" + aid + "&" + taici + "&" +row.visitsid +"' title='查看'><span class='font_blue glyphicon glyphicon-fire'></span>&nbsp;</a>";
	                	}else if(row.ladyType == "产前检查" && (row.visitsid==undefined || row.visitsid=='')){
	                		return "<a style='color:red;' href='#/arch/fetcheck/" + aid + "&" + taici + "&0' title='新增'><span class='font_red glyphicon glyphicon-plus'></span>&nbsp;</a>";
	                	}
	                	
	                	if (row.ladyType == "产后访视" && row.visitsid!=undefined && row.visitsid!='') {
		                    return "<a href='#/arch/visits/" + aid + "&" + taici + "&" +row.visitsid +"' title='查看'><span class='font_blue glyphicon glyphicon-fire'></span>&nbsp;</a>";
	                	}else if(row.ladyType == "产后访视" && (row.visitsid==undefined || row.visitsid=='')){
	                		return "<a style='color:red;' href='#/arch/visits/" + aid + "&" + taici + "&0' title='新增'><span class='font_red glyphicon glyphicon-plus'></span>&nbsp;</a>";
	                	}
	                	if (row.ladyType == "产后42天访视" && row.visitsid!=undefined && row.visitsid!='') {
		                    return "<a href='#/arch/visit42day/" + aid + "&" + taici + "&" +row.visitsid +"' title='查看'><span class='font_blue glyphicon glyphicon-fire'></span>&nbsp;</a>";
	                	}else if(row.ladyType == "产后42天访视" && (row.visitsid==undefined || row.visitsid=='')){ 
	                		return "<a style='color:red;' href='#/arch/visit42day/" + aid + "&" + taici + "&0' title='新增'><span class='font_red glyphicon glyphicon-plus'></span>&nbsp;</a>";
	                	} 
	                }}
	            ]]
	        });
	            
	        var myQuery = $indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
	        $indexedDB.objectStore("EHEALTH_LADY_FIRSTCHECK").each(function(cursor){
	        	if(cursor){
		            $scope.chanciChas.push({id:cursor.value.firstcheckid,text:'孕次：'+cursor.value.taici+' 首检日期：'+cursor.value.booking_date});
		            cursor.continue();
	            }
	            
	        },myQuery).then(function(){
	        },function(){
	            alert("error");
	        });
        });
        
        
        //初始化妇幼列表
        $scope.initDatagrid = function(){
	        var list = []
	        
	        var firstCheckId=$scope.chanciCha;
	        var ladyFirstcheck=$indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
	        $indexedDB.objectStore("EHEALTH_LADY_FIRSTCHECK").each(function(cursor){
	            if(cursor){
	    	        var listGroup={};
	    	        listGroup.ladyType='产前首次检查';
	    	        listGroup.visitsid=cursor.value.firstcheckid;
	    	        listGroup.checkdate=cursor.value.booking_date;
	    	        listGroup.doctorname=cursor.value.doctorname;
	    	        //alert(cursor.value.firstcheckid)
	    	        if(firstCheckId==cursor.value.firstcheckid){
	    	        	list.push(listGroup); 
	    	        	firstcheckid=cursor.value.firstcheckid;
	    	        	taici=cursor.value.taici;
	    	        }
	    	        //list.push(listGroup);
		            cursor.continue();
	            }
	        },ladyFirstcheck).then(function(){
	        	var ladyFeticheck = $indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
		        $indexedDB.objectStore("EHEALTH_LADY_FETIFEROUSCHECK").each(function(cursor){
		            if(cursor){
		    	        var listGroup={};
		    	        listGroup.ladyType='产前检查';
		    	        listGroup.visitsid=cursor.value.fetiferouscheckid;
		    	        listGroup.checkdate=cursor.value.checkdate;
		    	        listGroup.doctorname=cursor.value.checkdoctorname;
		    	        //alert(cursor.value.fetiferouscheckid)
		    	        if(taici==cursor.value.taicione){list.push(listGroup);}
		    	        //list.push(listGroup);
			            cursor.continue();
		            }
		        },ladyFeticheck).then(function(){
		        	var ladyVisit = $indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
			        $indexedDB.objectStore("EHEALTH_LADY_VISITS").each(function(cursor){
			            if(cursor){
			    	        var listGroup={};
			    	        listGroup.ladyType='产后访视';
			    	        listGroup.visitsid=cursor.value.visitsid;
			    	        listGroup.checkdate=cursor.value.checkdate;
			    	        listGroup.doctorname=cursor.value.visitoridiographname;
			    	        //alert(cursor.value.visitsid)
			    	        if(taici==cursor.value.taicione){list.push(listGroup);}
			    	        //list.push(listGroup);
				            cursor.continue();
			            }
			        },ladyVisit).then(function(){
			        	var ladyVisitdays = $indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
				        $indexedDB.objectStore("EHEALTH_LADY_VISIT42DAYS").each(function(cursor){
				            if(cursor){
				    	        var listGroup={};
				    	        listGroup.ladyType='产后42天访视';
				    	        listGroup.visitsid=cursor.value.visit42daysid;
				    	        listGroup.checkdate=cursor.value.visit_date;
				    	        listGroup.doctorname=cursor.value.visit_doctorname;
				    	        //alert(cursor.value.visit42daysid)
				    	        if(taici==cursor.value.taicione){
				    	        	list.push(listGroup);
				    	        }
				    	        //list.push(listGroup);
					            cursor.continue();
				            }
				        },ladyVisitdays).then(function(){
					        list.push({ladyType:'产前首次检查'});
					        list.push({ladyType:'产前检查'});
					        list.push({ladyType:'产后访视'});
					        list.push({ladyType:'产后42天访视'});
				            $("#visitslist").datagrid({data:list});
				        },function(){
				            alert("error");
				        });
			        },function(){
			            alert("error");
			        });
		        },function(){
		            alert("error");
		        });
	        },function(){
	            alert("error");
	        });
        	
        }
        
        //加载列表数据（地几次晕检）
        var loadLadyDataGray =  function(){}
    }];
    
    return app.controller("ladyVisitslistController",controller);
});