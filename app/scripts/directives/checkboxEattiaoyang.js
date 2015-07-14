define(['directives/directives'],function(directives){
        directives.directive('checkboxEattiaoyang',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                           '<lable>' +
                           '<input id="{{id}}" name="{{name}}" type="checkbox" text="{{item.text}}" value="{{item.id}}" ng-click="click($event,item.id)" ng-checked="ischecked(item.id)">{{item.text}}&nbsp;&nbsp;' +
                           '</lable><br/>' +
                           '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"养成良好的哺乳习惯，尽量延长夜间喂奶的间隔时间",text:"养成良好的哺乳习惯，尽量延长夜间喂奶的间隔时间；"},
                                   {id:"养成良好饮食习惯，避免偏食，节制零食，按时进食，提倡“三分饥”，防止乳食无度",text:"养成良好饮食习惯，避免偏食，节制零食，按时进食，提倡“三分饥”，防止乳食无度；"},
                                   {id:"食物宜细、软、烂、碎，而且应品种多样",text:"食物宜细、软、烂、碎，而且应品种多样；"},
                                   {id:"严格控制冷饮，寒凉食物要适度",text:"严格控制冷饮，寒凉食物要适度；"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){//true  为选中 false 为取消选择
                            if(scope.ngModel){
                            	scope.ngModel += code;
                            }else{// 说明是为选择任何一个
                                scope.ngModel = code;
                            }
                        }else{
                            //-----未选中
                            if(scope.ngModel){
                                if(scope.ngModel.indexOf(code)>=0){
                                    //------去掉
                                    var a = scope.ngModel.substring(0,scope.ngModel.indexOf(code));
                                    var b = scope.ngModel.substring(scope.ngModel.indexOf(code)+code.length);
                                    scope.ngModel = a+b;
                                }
                            }
                        }
                        console.log("click:" + code);
                    };
                    scope.ischecked = function(code){
                        var checked = false;
                        if(scope.ngModel && scope.ngModel.indexOf(code+";")>=0){
                            checked = true;
                        }
                        return checked;
                    }
                }
	        };
	    }]);
    }
);