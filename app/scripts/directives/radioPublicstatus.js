define(['directives/directives'],function(directives){
        directives.directive('radioPublicstatus',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                           '<input id="{{id}}" name="{{name}}" type="radio"  value="{{item.id}}" ng-click="click($event,item.id)" ng-checked="ngModel==item.id">{{item.text}}&nbsp;&nbsp;' +
                           '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [
                                   {"id":"HR522_1","text":"未见异常"},
                                   {"id":"HR522_2","text":"异常"}];
                    scope.click = function(code,name){
                        scope.ngModel = name;
                        console.log("click:" + code);
                    };
                }
	        };
	    }]);
    }
);