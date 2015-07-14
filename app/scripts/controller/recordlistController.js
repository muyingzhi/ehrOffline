define(['controller/controllers'
    ,'services/MedicalRecordService'
],function(app,easyui){
    var controller = ['$rootScope','$scope','$location','$routeParams','MedicalRecordService'
        ,function($rootScope,$scope,$location,$routeParams,MedicalRecordSercive){
        //----------读取参数，为表单赋值
	    var aid = $routeParams.aid;
	    var findname = $routeParams.findname;
                $scope.num=0;
        if(aid && aid>0){
            MedicalRecordSercive.findByID(aid).then(function(list){
                $scope.recordlist = list;
                $scope.num=list.length;
            });
        }else{
            //----全部
                MedicalRecordSercive.findAll().then(function(list){
                    $scope.recordlist = list;
                    $scope.num=list.length;
                });
        }
        
        //---------设置顶端菜单
        $rootScope.topNav = [{
	            text:"新建病历",iconClass:"glyphicon-new-window",url:"#/medicalRecord/0"
	        }
//            ,
//            {
//	            text:"随访列表",
//	            iconClass:"glyphicon-tint",
//	            items:[{
//	                    text:"高血压随访",url:"#/arch/hyper"
//	                },{
//	                    text:"糖尿病随访",url:"#/arch/dm"
//	                },{
//	                    text:"中医体质管理",url:"#/arch/zycmr"
//	                }]
//                }
            ];
        
        $("#recordlist").datagrid({
            singleSelect:true,
            title:"门诊病历",
            toolbar:"#tb",
            rownumbers:true,
            pagination:true,
            pageSize:20,
            loadFilter:pagerFilter,
            loadData:getData,
            columns:[[
                {field:'crtime',title:'就诊日期',width:150},
                {field:'diseasename',title:'疾病',width:100},
                {field:'fullname',title:'姓名',width:100,formatter:function(value,row,index){
                    var firstname=value.substr(0,1);
                    //var lastname=value.substr(1);
                    return '<span class="avatar">'+firstname+'</span><span>&nbsp;&nbsp;'+value+'</span>';
                
                }},
                {field:'gender',title:'性别',width:50,formatter:function(value,row,index){
                    var result = value=="HR481_1"?"男":"女";
                    return result;                
                }},
                {field:'birthday',title:'出生日期',width:100,align:'right'},
                {field:'identityno',title:'身份证号',width:150,align:'right'},
                {field:'addr',title:'住址',width:150,align:'right'},
                {field:'id1',title:'病历',width:80,align:'center',formatter:function(value,row,index){
                    return "<a href='#/medicalRecord/"+row.casehistoryid+"' title='病历'><span class='shutcut'><span class='font_blue glyphicon glyphicon-plus-sign'></span></span>&nbsp;</a>"
                }},
                {field:'id2',title:'处方',width:80,align:'center',formatter:function(value,row,index){
                    return "<a href='#/charge/"+row.casehistoryid+"' title='处方'><span class='shutcut'><span class='font_blue glyphicon glyphicon-edit'></span></span>&nbsp;</a>"
                }}
            ]]
        });
        //-----------
        $scope.find=function(name){
            if($scope.findName){
                //--------按姓名查找
                MedicalRecordSercive.findByName($scope.findName).then(function(list){
                    $scope.recordlist = list;
                    $scope.num=list.length;
                });
            }else{
                //----全部
		        MedicalRecordSercive.findAll().then(function(list){
	                $scope.recordlist = list;
                    $scope.num=list.length;
		        });
            }
        }
        $scope.$watch('recordlist',function(newvalue){
            $("#recordlist").datagrid({data:$scope.recordlist});
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
    
    return app.controller("recordlistController",controller);
});