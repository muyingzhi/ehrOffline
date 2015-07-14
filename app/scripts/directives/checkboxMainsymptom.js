define(['directives/directives'],function(directives){
        directives.directive('checkboxMainsymptom',[function(){
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
                    scope.datas = [{id:"dis_hyper_1",text:"无症状"},{id:"dis_hyper_2",text:"头痛头晕"},{id:"dis_hyper_3",text:"恶心呕吐"},{id:"dis_hyper_4",text:"眼花耳鸣"},{id:"dis_hyper_5",text:"呼吸困难"},
                                   {id:"dis_hyper_6",text:"心悸胸闷"},{id:"dis_hyper_7",text:"鼻衄出血不止"},{id:"dis_hyper_8",text:"四肢发麻"},{id:"dis_hyper_9",text:"下肢水肿"},{id:"dis_hyper_10",text:"其他"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的且不是无症状的
                            if(code!="dis_hyper_1;" && scope.ngModel){
                                if(scope.ngModel.indexOf(code)==-1 && scope.ngModel.indexOf("dis_hyper_1;")==-1){
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