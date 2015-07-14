define(['directives/directives'],function(directives){
    directives.directive('archlist',['$indexedDB',function($indexedDB){
        function getData(){
            var rows = [];
            for(var i=1; i<=800; i++){
                var amount = Math.floor(Math.random()*1000);
                var price = Math.floor(Math.random()*1000);
                rows.push({
                    inv: 'Inv No '+i,
                    date: $.fn.datebox.defaults.formatter(new Date()),
                    name: 'Name '+i,
                    amount: amount,
                    price: price,
                    cost: amount*price,
                    note: 'Note '+i
                });
            }
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
//        $indexedDB.objectStore("EHEALTH_ARCH_BASEINFO").getAll()
//              .then(function(list){
//                  if(angular.isArray(list)){
//                        $(element).datagrid({data:list});
//                  }else{
//                      $.messager.alert("error:",result);
//                  }
//              });  
        return {
            restrict:"AE",
//            scope : {
//                archlist:"=archlist"
//            },
            require : "ngModel",
            link : function(scope,element,attrs,ngModel){
                var archDatas = scope.archlist;
                console.log(archDatas);
                if(!archDatas){
                    archDatas = [];
                };
                if(!ngModel) return;
                scope.$watch(attrs.ngModel,function(){
                    if(attrs.archlist && attrs.archlist.length>2){
                        archDatas = attrs.archlist;
                    }
                $(element).datagrid({
                    singleSelect:true,
                    title:"健康档案",
                    toolbar:"#tb",
                    pagination:true,
	                columns:[[
                        {field:'arch_basicinfoid',title:'ID',width:50},
                        {field:'fullname',title:'姓名',width:100},
				        {field:'gender',title:'性别',width:50,formatter:function(value,row,index){
                            return value=="HR481_1"?"男":"女";
                        }},
                        {field:'birthday',title:'出生日期',width:100,align:'right'},
                        {field:'identityno',title:'身份证号',width:100,align:'right'},
                        {field:'addr',title:'住址',width:100,align:'right'},
                        {field:'id1',title:'档案编辑',width:80,align:'center',formatter:function(value,row,index){
                            return "<a href='#/archDetail/"+row.arch_basicinfoid+"' title='档案编辑'><span class='font_blue glyphicon glyphicon-edit'></span>&nbsp;</a>"
                        }},
                        {field:'id2',title:'健康体检',width:80,align:'center',formatter:function(value,row,index){
                            return "<a href='#/arch/healthCheckA/"+row.arch_basicinfoid+"' title='健康体检'><span class='font_blue glyphicon glyphicon-leaf'></span>&nbsp;</a>"
                        }},
                        {field:'id3',title:'高血压随访',width:80,align:'center',formatter:function(value,row,index){
                            return "<a href='#/arch/hyper/"+row.arch_basicinfoid+"' title='高血压随访'><span class='font_blue glyphicon glyphicon-fire'></span>&nbsp;</a>"
                        }},
                        {field:'id4',title:'糖尿病随访',width:80,align:'center',formatter:function(value,row,index){
                            return "<a href='#/arch/dm/"+row.arch_basicinfoid+"' title='糖尿病随访'><span class='font_blue glyphicon glyphicon-map-marker'></span>&nbsp;</a>"
                        }},
                        {field:'id5',title:'重性精神疾病随访',width:120,align:'center',formatter:function(value,row,index){
                        	return "<a href='#/arch/schizo/"+row.arch_basicinfoid+"' title='重性精神疾病随访'><span class='font_blue glyphicon glyphicon-tree-deciduous'></span>&nbsp;</a>"
                        }},
                        {field:'id6',title:'中医体质管理',width:80,align:'center',formatter:function(value,row,index){
                            return "<a href='#/arch/zycmr/"+row.arch_basicinfoid+"' title='中医体质管理'><span class='font_blue glyphicon glyphicon-tree-conifer'></span>&nbsp;</a>"
                        }}
				    ]],
                    data:archDatas,
                    loadFilter:pagerFilter,
                    loadData:getData
                });
                });

            }
        }
    }]);
});