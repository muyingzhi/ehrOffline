define(['controller/controllers',
        'easyui',
        'services/ArchBasicInfoService',
        'directives/hysBoxViews'
       ],function(app){
    var controller = ['$rootScope','$scope','$location','$routeParams','ArchBasicInfoService'
        ,function($rootScope,$scope,$location,$routeParams,archSercive){
        // ----------读取参数，为表单赋值
	    var aid = $routeParams.aid;
	    var findname = $routeParams.findname;
        $scope.num=0;
        $scope.archlist = [];
        if (aid && aid>0) {
            archSercive.findByID(aid).then(function(list) {
            	archViewDetail(list);
                $scope.archlist = list;
                $scope.num=list.length;
            });
        } else {
            // ----全部
            archSercive.findAll().then(function(list){
            	archViewDetail(list);
                $scope.archlist = list;
                $scope.num=list.length;
            });
        }

        // ---------设置顶端菜单
        $rootScope.topNav = [
              { text:"新建档案", iconClass:"glyphicon-new-window", url:"#/archDetail/0"}
             ,{ text:"档案列表", iconClass:"glyphicon-align-justify", url:"#/archlist"}
        ];

        //-----------
        $scope.find=function(name){
            if($scope.findName) {
                //--------按姓名查找
                archSercive.findByName($scope.findName).then(function(list){
                	archViewDetail(list);
                    $scope.archlist = list;
                    $scope.num=list.length;
                });
            } else {
                //----全部
		        archSercive.findAll().then(function(list) {
		        	archViewDetail(list);
	                $scope.archlist = list;
                    $scope.num=list.length;
		        });
            }
        }

        function archViewDetail(list) {
        	for (var int = 0; int < list.length; int++) {
                var archViews = [{ text:"体检", iconClass:"glyphicon-plus", title:"健康体检", url:"#/arch/checklist"}];
             	var row = list[int];
             	if(row.discomname!=undefined && row.discomname!=null && row.discomname.indexOf('HR401_11;')>=0) {
             		archViews.push({text:"高血压", iconClass:"glyphicon-plus", title:"高血压随访", url:"#/arch/hyperlist"});
            	}
            	if(row.discomname!=undefined && row.discomname!=null && row.discomname.indexOf('HR401_12;')>=0) {
            		archViews.push({text:"糖尿病", iconClass:"glyphicon-tint", title:"糖尿病随访", url:"#/arch/dmlist"});
             	}
            	if(row.discomname!=undefined && row.discomname!=null && row.discomname.indexOf('HR401_16;')>=0) {
            		archViews.push({text:"精神病", iconClass:"glyphicon-plus", title:"重性精神病随访", url:"#/arch/schizolist"});
            	}
            	if(row.gender!=undefined && row.gender!=null && row.gender.indexOf('HR481_2')>=0) {
            		archViews.push({text:"孕产妇", iconClass:"glyphicon-user", title:"孕产妇保健", url:"#/arch/visitslist"});
            	}
            	var old =new Date(row.birthday.replace(/-/g,"/")).getTime();
                var now=new Date().getTime();
            	if((now-old)/31536000000<7) {
            		archViews.push({ text:"儿童", iconClass:"glyphicon-plus", title:"儿童保健", url:"#/arch/babylist"});
                }
            	if((now-old)/31536000000>=65) {
            		archViews.push({text:"中医体质", iconClass:"glyphicon-tint", title:"中医体质管理", url:"#/arch/zycmrlist"});
                }
             	list[int].gender = (list[int].gender == "HR481_1")? "男" : "女";

            	row.archViews = archViews;
     		}
        }

        function pagerFilter(data){
            if (typeof data.length == 'number' && typeof data.splice == 'function'){
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
    return app.controller("archList4viewsController",controller);
});