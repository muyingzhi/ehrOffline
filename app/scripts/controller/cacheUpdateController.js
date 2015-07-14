define(['controller/controllers',
    'dictsConstant'],function(app){
    app.controller("cacheUpdateController"
                ,['$rootScope','$scope','$indexedDB'
        ,function($rootScope,$scope,$indexedDB){
            //---------设置顶端菜单
            $rootScope.topNav = [];
            if(navigator.onLine){
                alert("online")
            }else{
                alert("offline");
            }
            $scope.online=navigator.onLine;
            $scope.updateCache = function(){
                //---------检查状态
                var s = checkCache();
                alert(s);
            }
            function checkCache(){
                var appCache = window.applicationCache;  
				switch (appCache.status) {  
				  case appCache.UNCACHED: // UNCACHED == 0  
				    return 'UNCACHED';  
				    break;  
				  case appCache.IDLE: // IDLE == 1  
				    return 'IDLE';  
				    break;  
				  case appCache.CHECKING: // CHECKING == 2  
				    return 'CHECKING';  
				    break;  
				  case appCache.DOWNLOADING: // DOWNLOADING == 3  
				    return 'DOWNLOADING';  
				    break;  
				  case appCache.UPDATEREADY:  // UPDATEREADY == 4  
				    return 'UPDATEREADY';  
				    break;  
				  case appCache.OBSOLETE: // OBSOLETE == 5  
				    return 'OBSOLETE';  
				    break;  
				  default:  
				    return 'UKNOWN CACHE STATUS';  
				    break;  
				};
            }
        }
    ]);
    
});