console.log("vaccinationDetalController...");
define(['controller/controllers','jquery','dictsConstant',
        'directives/hysNoneDatebox'
       ],function(app){
	    app.controller("vaccinationDetalController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
	    	 	//----------读取参数，为表单赋值
            	var id = $routeParams.id;    
	    		//---------设置顶端菜单
		        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/vaccination/"}];
                //---------用于存放参数信息
	            $scope.data={};
		        //---------字典加载
	            $scope.gender = dataDicts.gender;
		        //----人员
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	            });
	            //----机构
	            datadictService.listTGOV().then(function(list){
	                $scope.dictTgov = list;
	            });
	            $indexedDB.objectStore("EHEALTH_IMMU_INOCUCARD").find(id).then(function(data){
        			if(data){
        				$scope.data=data;
        			}
                },function(){
                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
                }).then(function(){});
	            
	        }
	    ]);
    
});