define(['directives/directives'],function(directives){
        directives.directive('radioUsedrug',[function(){
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
                    scope.datas = [{id:"HR418_1",text:"规律服药"},{id:"HR418_2",text:"间断服药"},{id:"HR418_3",text:"不服药"}];
                    scope.click = function(code,name){
                        scope.ngModel = code;
                        console.log("click:" + code);
            			$('#fyqk').text(name);
                    }
                }
	        };
	    }]);
    }
);