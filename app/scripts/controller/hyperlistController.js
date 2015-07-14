define(['controller/controllers','services/DataDictService'],function(app){
    var controller = ['$rootScope','$scope','$location','$indexedDB','$routeParams','DataDictService'
        ,function($rootScope,$scope,$location,$indexedDB,$routeParams,datadictService){
            
        $scope.selectArch = function(id){
            $rootScope.rootParameter = id;
        }    
        //----------读取参数，为表单赋值
        var aid = $routeParams.aid;
        //---------设置顶端菜单
        $rootScope.topNav = [
            {
                    text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/archlist/"+aid
                },
            {
	            text:"新增",iconClass:"glyphicon-new-window",url:"#/arch/hyper/"+aid+"&"+0
	        }];
        //----人员字典
        datadictService.listUSER().then(function(list){
            $scope.dictDoctor = list;
            $("#hyperlist").datagrid({
	            singleSelect:true,
	            title:"高血压随访列表",
	            columns:[[
	                {field:'hypertensionvisitid',title:'ID',width:50},
	                {field:'inquiredate',title:'日期',width:100},
	                {field:'visitway',title:'类型',width:100},
	                {field:'inquirer',title:'随访医生',width:100,formatter:function(value,row,index){
	                    var name
	                    for(var i=0;i<$scope.dictDoctor.length;i++){
	                        var item = $scope.dictDoctor[i];
	                        if(item.id==value){
	                            name = item.text;
	                        }
	                    }
	                    return name;
	                }},
	                {field:'id3',title:'高血压随访',width:80,align:'center',formatter:function(value,row,index){
	                    return "<a href='#/arch/hyper/"+aid+"&"+row.hypertensionvisitid+"' title='查看'><span class='font_blue glyphicon glyphicon-fire'></span>&nbsp;</a>"
	                }}                
	            ]]
	        });
	        var list = []
	        
	        var myQuery = $indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
	        $indexedDB.objectStore("EHEALTH_DIS_HYPERTENSIONVISIT").each(function(cursor){
	            if(cursor){
	                list.push(cursor.value);
	                cursor.continue();
	            }
	        },myQuery).then(function(){
	            $("#hyperlist").datagrid({data:list});
	        },function(){
	            alert("error");
	        })
        });
    }];
    
    return app.controller("hyperlistController",controller);
});