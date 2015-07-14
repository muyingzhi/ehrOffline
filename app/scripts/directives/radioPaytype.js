define(['directives/directives'],function(directives){
        directives.directive('radioPaytype',[function(){
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
                    scope.datas = [{id:"HR101_1",text:"城镇职工基本医疗保险"},{id:"HR101_2",text:"城镇居民基本医疗保险"},{id:"HR101_3",text:"新型农村合作医疗"},
                                   {id:"HR101_4",text:"贫困救助"},{id:"HR101_5",text:"商业医疗保险"},{id:"HR101_6",text:"全公费"},
                                   {id:"HR101_7",text:"全自费"},{id:"HR101_8",text:"其他"},{id:"HR101_9",text:"部分公费"}];
                    scope.click = function(code){
                        scope.ngModel = code;
                        console.log("click:" + code);
                    }
                }
	        };
	    }]);
    }
);