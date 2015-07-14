define(['controller/controllers','jquery','indexedDB'],function(controllers,$){
    controllers.controller("aboutController", ['$rootScope','$scope','$indexedDB',
        function($rootScope,$scope,$indexedDB){
            //---------设置顶端菜单
            $rootScope.topNav = [
            ];
            $scope.dbInfo = {};
            $scope.getDBInfo = function(){
                
                //---获取db信息
	            return $indexedDB.dbInfo().then(function(dbinfo){
	                $scope.dbInfo = dbinfo;
                    //console.log("scope getDBInfo" + dbinfo)
	                for(var i=0;i<dbinfo.objectStores.length;i++){
	                    var store = dbinfo.objectStores[i];
	                    var count = $indexedDB.objectStore(store.name).count();
	                    
	                    store.rowcount = count;
	                }
	            });
            }
            $scope.getDBInfo();
        }
    ]);
})