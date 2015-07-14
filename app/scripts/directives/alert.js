define(['directives/directives'],function(directives){
        directives.controller('AlertController',['$scope','$attrs',function($scope,$attrs){
            $scope.closeable = 'close' in $attrs;
            
	    }])
	    .directive('alert',[function(){
	        return {
	            restrict:"EA",
                templateUrl  : "template/alert.html",
                controller : 'AlertController',
	            replace:true,
	            transclude:true,
	            scope:{
	                type:'@',
	                close:'&'
	            }
	        };
	    }]);
    }
);