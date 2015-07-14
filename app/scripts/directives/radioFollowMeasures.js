define(['directives/directives'],function(directives){
        directives.directive('radioFollowMeasures',[function(){
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
                    scope.datas = [{id:"HR423_1",text:"血压控制满意按期随访"},{id:"HR423_2",text:"血压控制不满意调整药物"},{id:"HR423_3",text:"有药物不良反应调整药物"},{id:"HR423_5",text:"连续两次控制不满意转诊"},{id:"HR423_4",text:"并发症转诊"}];
                    scope.click = function(code,name){
                        scope.ngModel = code;
                        console.log("click:" + code);
                        
                    }
                }
	        };
	    }]);
    }
);