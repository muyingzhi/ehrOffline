define(['directives/directives'],function(directives){
        directives.directive('radioDoctorOrder',[function(){
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
                    scope.datas = [{id:"HR421_1",text:"良好"},{id:"HR421_2",text:"一般"},{id:"HR421_3",text:"差"}];
                    scope.click = function(code){
                        scope.ngModel = code;
                        console.log("click:" + code);
                    }
                }
	        };
	    }]);
    }
);