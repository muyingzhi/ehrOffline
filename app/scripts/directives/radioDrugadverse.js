define(['directives/directives'],function(directives){
        directives.directive('radioDrugadverse',[function(){
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
                    scope.datas = [{"id":"HR531_1","text":"无"},{"id":"HR531_2","text":"偶尔"},{"id":"HR531_3","text":"频繁"}];
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