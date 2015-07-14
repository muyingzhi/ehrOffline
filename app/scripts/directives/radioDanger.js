define(['directives/directives'],function(directives){
        directives.directive('radioDanger',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                        '<input id="{{id}}" name="{{name}}" type="radio" value="{{item.id}}" ng-click="click(item.id)" ng-checked="ngModel==item.id">{{item.text}}&nbsp;&nbsp;' +
                        '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"wxjb_1",text:"0级"},{id:"wxjb_2",text:"1级"},{id:"wxjb_3",text:"2级"},
                                   {id:"wxjb_4",text:"3级"},{id:"wxjb_5",text:"4级"},{id:"wxjb_6",text:"5级"}];
                    scope.click = function(code){
                        scope.ngModel = code;
                        console.log("click:" + code);
                    }
                }
	        };
	    }]);
    }
);