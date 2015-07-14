define(['directives/directives'],function(directives){
        directives.directive('checkboxTuina',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                           '<input id="{{id}}" name="{{name}}" type="checkbox" text="{{item.text}}" value="{{item.id}}" ng-click="click($event,item.id)" ng-checked="ischecked(item.id)">{{item.text}}&nbsp;&nbsp;' +
                           '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"HR558_1",text:"摩腹"},
                                   {id:"HR558_2",text:"捏脊；"},
                                   {id:"HR558_3",text:"按揉足三里穴"},
                                   {id:"HR558_4",text:"按揉迎香穴"},
                                   {id:"HR558_5",text:"按揉四神聪穴"}];
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