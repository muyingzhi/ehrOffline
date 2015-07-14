define(['directives/directives'],function(directives){
        directives.directive('checkboxGestationyc',[function(){
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
                    scope.datas = [{id:"YCFRSYC_1",text:"夜间端坐呼吸"},
                                   {id:"YCFRSYC_2",text:"咳嗽"},
                                   {id:"YCFRSYC_3",text:"发绀"},
                                   {id:"YCFRSYC_4",text:"乏力"},
                                   {id:"YCFRSYC_5",text:"恶心"},
                                   {id:"YCFRSYC_6",text:"上腹部不适"},
                                   {id:"YCFRSYC_7",text:"呕吐"},
                                   {id:"YCFRSYC_8",text:"低血糖"},
                                   {id:"YCFRSYC_9",text:"肝脏酶学异常"},
                                   {id:"YCFRSYC_10",text:"消瘦"},
                                   {id:"YCFRSYC_11",text:"出汗"},
                                   {id:"YCFRSYC_12",text:"凝血功能异常"},
                                   {id:"YCFRSYC_13",text:"双手震颤"},
                                   {id:"YCFRSYC_14",text:"眼突"},
                                   {id:"YCFRSYC_15",text:"血小板减少"}
                                   ];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            if(scope.ngModel){
                            	scope.ngModel += code;
                            }else{
                                scope.ngModel = code;
                            }
                        } else {
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