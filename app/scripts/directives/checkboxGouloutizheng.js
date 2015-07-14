define(['directives/directives'],function(directives){
        directives.directive('checkboxGouloutizheng',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                        '<input id="{{id}}" name="{{name}}" type="checkbox" value="{{item.id}}" ng-click="click($event,item.id)" ng-checked="ischecked(item.id)">{{item.text}}&nbsp;&nbsp;' +
                        '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"HR534_1",text:"无"},
                                   {id:"HR534_2",text:"颅骨软化（囟门边软、乒乓颅）"},
                                   {id:"HR534_3",text:"方颅"},
                                   {id:"HR534_4",text:"串珠"},
                                   {id:"HR534_5",text:"肋膈沟"},
                                   {id:"HR534_6",text:"鸡胸"},
                                   {id:"HR534_7",text:"漏斗胸"},
                                   {id:"HR534_8",text:"手镯"},
                                   {id:"HR534_9",text:"脚镯"},
                                   {id:"HR534_10",text:"“○”型腿"},
                                   {id:"HR534_11",text:"“X”型腿"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的
                            if(scope.ngModel){
                                if(code=="HR534_1;"){
                                    scope.ngModel = code;//---无，与其它互斥
                                }else{
                                    if(scope.ngModel.indexOf("HR534_1")>=0){
                                        scope.ngModel = ";";//----原来的无，清除
                                    }
	                                if(scope.ngModel.indexOf(code)==-1){
	                                    //------没有的加上
	                                    scope.ngModel += code;
	                                }
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