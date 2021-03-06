define(['directives/directives'],function(directives){
        directives.directive('checkboxPrevalence',[function(){
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
                    scope.datas = [{id:"HR550_1",text:"无"},{id:"HR550_2",text:"肺炎"},{id:"HR550_3",text:"麻疹"},{id:"HR550_4",text:"贫血"},{id:"HR550_5",text:"营养不良"},
                                   {id:"HR550_6",text:"佝偻病"},{id:"HR550_7",text:"腹泻"},{id:"HR550_8",text:"外伤"},{id:"HR550_9",text:"其他"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的且不是无症状的
                            if(code!="HR550_1;" && scope.ngModel){
                                if(scope.ngModel.indexOf(code)==-1 && scope.ngModel.indexOf("HR550_1;")==-1){
                                    //------没有的且未选择无症状的加上
                                    scope.ngModel += code;
                                }else{
                                	scope.ngModel = code;
                                }
                            }else{
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