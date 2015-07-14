define(['controller/controllers'
    ,'services/ArchBasicInfoService'
],function(app,easyui){
    var controller = ['$rootScope','$scope','$location','$routeParams','ArchBasicInfoService'
        ,function($rootScope,$scope,$location,$routeParams,archSercive){
        //----------读取参数，为表单赋值
	    var aid = $routeParams.aid;
	    var findname = $routeParams.findname;
                $scope.num=0;
        if(aid && aid>0){
            archSercive.findByID(aid).then(function(list){
                $scope.archlist = list;
                $scope.num=list.length;
            });
        }else{
            //----全部
                archSercive.findAll().then(function(list){
                    $scope.archlist = list;
                    $scope.num=list.length;
                });
        }
        
        //---------设置顶端菜单
        $rootScope.topNav = [{
	            text:"新建档案",iconClass:"glyphicon-new-window",url:"#/archDetail/0"
        	},{text:"档案视图",iconClass:"glyphicon-th-large",url:"#/archlist4views"}
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
        
        $("#archlist").datagrid({
            singleSelect:true,
            title:"健康档案",
            toolbar:"#tb",
            rownumbers:true,
            pagination:true,
            pageSize:20,
            loadFilter:pagerFilter,
            loadData:getData,
            columns:[[
                {field:'arch_basicinfoid',title:'ID',width:50},
                {field:'discomname',title:'字典',width:50,hidden:'true'},
                {field:'isOld',title:'是否保存过',hidden:'true'},
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
                {field:'id1',title:'档案编辑',width:80,align:'center',formatter:function(value,row,index){
                	if(row.isOld=='1'){
                		return "<a href='#/archUpdate/"+row.arch_basicinfoid+"' title='档案编辑'><span class='shutcut'><span class='font_blue glyphicon glyphicon-edit'></span></span>&nbsp;</a>";
                	}else{
                		return "<a href='#/archDetail/"+row.arch_basicinfoid+"' title='档案编辑'><span class='shutcut'><span class='font_blue glyphicon glyphicon-edit'></span></span>&nbsp;</a>";
                	}
                }},
                {field:'id2',title:'健康体检',width:80,align:'center',formatter:function(value,row,index){
                    return "<a href='#/arch/checklist/"+row.arch_basicinfoid+"' title='健康体检'><span class='shutcut'><span class='font_blue glyphicon glyphicon-leaf'></span></span>&nbsp;</a>"
                }},
                {field:'id3',title:'高血压随访',width:80,align:'center',formatter:function(value,row,index){
                   if(row.discomname!=undefined && row.discomname!=null && row.discomname.indexOf('HR401_11;')>=0){
                		return "<a href='#/arch/hyperlist/"+row.arch_basicinfoid+"' title='高血压随访'><span class='shutcut'><span class='font_blue glyphicon glyphicon-fire'></span></span>&nbsp;</a>"
                	}
                }},
                {field:'id4',title:'糖尿病随访',width:80,align:'center',formatter:function(value,row,index){
                   if(row.discomname!=undefined && row.discomname!=null && row.discomname.indexOf('HR401_12;')>=0){
                		return "<a href='#/arch/dmlist/"+row.arch_basicinfoid+"' title='糖尿病随访'><span class='shutcut'><span class='font_blue glyphicon glyphicon-map-marker'></span></span>&nbsp;</a>"
                	}
                }},
                {field:'id5',title:'重性精神疾病随访',width:120,align:'center',formatter:function(value,row,index){
                    if(row.discomname!=undefined && row.discomname!=null && row.discomname.indexOf('HR401_16;')>=0){
                		return "<a href='#/arch/schizolist/"+row.arch_basicinfoid+"' title='重性精神疾病随访'><span class='shutcut'><span class='font_blue glyphicon glyphicon-tree-deciduous'></span></span>&nbsp;</a>"
                	}
                }},
                {field:'id6',title:'中医体质管理',width:80,align:'center',formatter:function(value,row,index){
                    var old =new Date(row.birthday.replace(/-/g,"/")).getTime();
                    var now=new Date().getTime();
                	if((now-old)/31536000000>=65){
                    	return "<a href='#/arch/zycmrlist/"+row.arch_basicinfoid+"' title='中医体质管理'><span class='shutcut'><span class='font_blue glyphicon glyphicon-tree-conifer'></span></span>&nbsp;</a>"
                    }
                }},
                {field:'id7',title:'儿童随访',width:80,align:'center',formatter:function(value,row,index){
                	var old =new Date(row.birthday.replace(/-/g,"/")).getTime();
                    var now=new Date().getTime();
                	if((now-old)/31536000000<7) {
                		return "<a href='#/arch/babylist/"+row.arch_basicinfoid+"' title='儿童随访'><span class='shutcut'><span class='font_blue glyphicon glyphicon-user'></span></span>&nbsp;</a>"
                    }
                }},
                {field:'id8',title:'孕产妇保健',width:80,align:'center',formatter:function(value,row,index){
                	if(row.gender!=undefined && row.gender!=null && row.gender.indexOf('HR481_2')>=0){
                		return "<a href='#/arch/visitslist/"+row.arch_basicinfoid+"' title='孕产妇保健'><span class='shutcut'><span class='font_blue glyphicon glyphicon-map-marker'></span></span>&nbsp;</a>"
                	}
                }}
            ]]
        });
        //-----------
        $scope.find=function(name){
            if($scope.findName){
                //--------按姓名查找
                archSercive.findByName($scope.findName).then(function(list){
                    $scope.archlist = list;
                    $scope.num=list.length;
                });
            }else{
                //----全部
		        archSercive.findAll().then(function(list){
	                $scope.archlist = list;
                    $scope.num=list.length;
		        });
            }
        }
        $scope.$watch('archlist',function(newvalue){
            $("#archlist").datagrid({data:$scope.archlist});
        });
        function getData(){
            var rows = [];
//            for(var i=1; i<=800; i++){
//                var amount = Math.floor(Math.random()*1000);
//                var price = Math.floor(Math.random()*1000);
//                rows.push({
//                    inv: 'Inv No '+i,
//                    date: $.fn.datebox.defaults.formatter(new Date()),
//                    name: 'Name '+i,
//                    amount: amount,
//                    price: price,
//                    cost: amount*price,
//                    note: 'Note '+i
//                });
//            }
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
    
    return app.controller("archlistController",controller);
});