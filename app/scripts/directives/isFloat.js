define(['directives/directives'],function(directives){
    directives.directive('isFloat',['$rootScope','$location',function($rootScope,$location){
    	return {
		    restrict: "A",
			require: "ngModel",
			link: function(scope,element,attrs,ctrl){
				element.bind('keypress',function(e){
					var k = window.event ? e.keyCode : e.which;
			        var kChar = String.fromCharCode(k)
			        var reg=/^[0-9]*\.?[0-9]*$/;
				    if(!reg.test(kChar)){
				    	if (window.event) {
			                window.event.returnValue = false;
			            }
			            else {
			                e.preventDefault(); //for firefox 
			            }
				    }
				})
			}
		  }
    }]);
});