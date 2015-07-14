define(['directives/directives'],function(directives){
        directives.directive('radioYaowei',[function(){
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
                    scope.datas = [{id:"1",text:"(腹围<80cm，相当于2.4尺)"},{id:"2",text:"(腹围80-85cm，2.4-2.55尺)"},{id:"3",text:"(腹围86-90cm，2.56-2.7尺)"},{id:"4",text:"(腹围91-105cm，2.71-3.15尺)"},{id:"5",text:"(腹围>105cm，3.15尺)"}];
                    scope.click = function(code){
                        scope.ngModel = code;
                        console.log("click:" + code);
                    }
                }
	        };
	    }]);
    }
);