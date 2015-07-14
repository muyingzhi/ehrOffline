define(['controller/controllers','jquery','dictsConstant',
    ,'services/InfectionService'
],function(app,easyui){
    var controller = ['$rootScope','$scope','$location','$routeParams','InfectionService','dataDicts'
        ,function($rootScope,$scope,$location,$routeParams,infectionSercive,dataDicts){
        //----------读取参数，为表单赋值
	    var aid = $routeParams.aid;
	    var findname = $routeParams.findname;
                $scope.num=0;
        if(aid && aid>0){
            infectionSercive.findByID(aid).then(function(list){
                $scope.infectionlist = list;
                $scope.num=list.length;
            });
        }else{
            //----全部
                infectionSercive.findAll().then(function(list){
                    $scope.infectionlist = list;
                    $scope.num=list.length;
                });
        }
        $scope.dictInfectioncode = dataDicts.infectioncode;
        $scope.dictReportlevel = dataDicts.reportlevel;
        
        //---------设置顶端菜单
        $rootScope.topNav = [{
	            text:"新建登记",iconClass:"glyphicon-new-window",url:"#/infectionDetail/0"
	        }];
        
        $("#infectionlist").datagrid({
            singleSelect:true,
            title:"传染病登记",
            toolbar:"#tb",
            rownumbers:true,
            pagination:true,
            pageSize:20,
            loadFilter:pagerFilter,
            loadData:getData,
            columns:[[
                {field:'diagnosetime',title:'诊断日期',width:150},
                {field:'fullname',title:'姓名',width:100,align:'right',formatter:function(value,row,index){
                    var firstname=value.substr(0,1);
                    return '<span class="avatar">'+firstname+'</span><span>&nbsp;&nbsp;'+value+'</span>';
                }},
                {field:'gender',title:'性别',width:50,align:'right',formatter:function(value,row,index){
                    var result = value=="HR481_1"?"男":"女";
                    return result;                
                }},
                {field:'birthday',title:'出生日期',width:100,align:'right'},
                {field:'addr',title:'住址',width:150,align:'right'},
                {field:'reportlevel',title:'报告类别',width:100,align:'right',formatter:function(value,row,index){
                	var name = "";
                    for(var i=0;i<$scope.dictReportlevel.length;i++){
                        var item = $scope.dictReportlevel[i];
                        if(item.id==value){
                            name = item.text;
                        }
                    }
                    return name;
                }},
                {field:'illname',title:'疾病名称',width:150,align:'right',formatter:function(value,row,index){
                	var name = "";
                    for(var i=0;i<$scope.dictInfectioncode.length;i++){
                        var item = $scope.dictInfectioncode[i];
                        if(item.id==value){
                            name = item.text;
                        }
                    }
                    return name;
                }},
                {field:'id2',title:'查看',width:80,align:'center',formatter:function(value,row,index){
                    return "<a href='#/infectionDetail/"+row.infectioncardid+"' title='登记卡'><span class='shutcut'><span class='font_blue glyphicon glyphicon-edit'></span></span>&nbsp;</a>"
                }}
            ]]
        });
        //-----------
        $scope.find=function(name){
            if($scope.findName){
                //--------按姓名查找
                infectionSercive.findByName($scope.findName).then(function(list){
                    $scope.infectionlist = list;
                    $scope.num=list.length;
                });
            }else{
                //----全部
		        infectionSercive.findAll().then(function(list){
	                $scope.infectionlist = list;
                    $scope.num=list.length;
		        });
            }
        }
        $scope.$watch('infectionlist',function(newvalue){
            $("#infectionlist").datagrid({data:$scope.infectionlist});
        });
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
    }];
    
    return app.controller("infectionlistController",controller);
});