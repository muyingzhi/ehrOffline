define(['directives/directives'],function(directives){
        directives.directive('radioSituationNext',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                        '<input id="{{id}}" name="{{name}}"type="radio" value="{{item.id}}" ng-click="click(item.id,item.text)" ng-checked="ngModel==item.id">{{item.text}}' +
                        '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"HR382_1",text:"轻"},{id:"HR382_2",text:"中"},{id:"HR382_3",text:"重"}];
                    scope.click = function(code,name){
                        scope.ngModel = code;
                        console.log("click:" + code);
                    }
                }
	        };
	    }]);
    }
);