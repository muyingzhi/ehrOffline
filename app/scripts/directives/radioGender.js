define(['directives/directives'],function(directives){
        directives.directive('radioGender',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                        '<input id="{{id}}" name="{{name}}"type="radio" value="{{item.id}}" ng-click="click(item.id)" ng-checked="ngModel==item.id">{{item.text}}' +
                        '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"HR481_1",text:"男"},{id:"HR481_2",text:"女"}];
                    scope.click = function(code){
                        scope.ngModel = code;
                        console.log("click:" + code);
                    }
                }
	        };
	    }]);
    }
);