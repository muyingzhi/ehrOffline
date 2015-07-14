define(['directives/directives'],function(directives){
        directives.directive('radioIsfetiferous',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                        '<input id="{{id}}" name="{{name}}"type="radio" value="{{item.id}}" ng-click="click(item.id)" ng-checked="ngModel==item.id">{{item.text}}&nbsp;&nbsp;' +
                        '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"0",text:"产前"},{id:"1",text:"产后"}];
                    scope.click = function(code){
                        scope.ngModel = code;
                        console.log("click:" + code);
                    }
                }
	        };
	    }]);
    }
);