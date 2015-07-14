define(['directives/directives'],function(directives){
        directives.directive('checkboxMainsymptomDm',[function(){
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
                    scope.datas = [{id:"diabetes_symptoms_1",text:"无症状"},{id:"diabetes_symptoms_2",text:"多饮"},{id:"diabetes_symptoms_3",text:"多食"},{id:"diabetes_symptoms_4",text:"多尿"},{id:"diabetes_symptoms_5",text:"视力模糊"},
                                   {id:"diabetes_symptoms_6",text:"感染"},{id:"diabetes_symptoms_7",text:"手脚麻木"},{id:"diabetes_symptoms_8",text:"下肢浮肿"},{id:"diabetes_symptoms_9",text:"其他"},{id:"diabetes_symptoms_10",text:"体重明显下降"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的且不是无症状的
                            if(code!="diabetes_symptoms_1;" && scope.ngModel){
                                if(scope.ngModel.indexOf(code)==-1 && scope.ngModel.indexOf("diabetes_symptoms_1;")==-1){
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