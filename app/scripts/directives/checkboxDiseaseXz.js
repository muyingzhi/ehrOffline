define(['directives/directives'],function(directives){
        directives.directive('checkboxDiseaseXz',[function(){
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
                    scope.datas = [{id:"arch_xzjb_1",text:"未发现"},{id:"arch_xzjb_2",text:"心肌梗死"},{id:"arch_xzjb_3",text:"心绞痛"},
                                   {id:"arch_xzjb_4",text:"冠状动脉血运重建"},{id:"arch_xzjb_5",text:"充血性心力衰竭"},{id:"arch_xzjb_6",text:"心前区疼痛 "},{id:"arch_xzjb_7",text:"其他"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的
                            if(code!="arch_xzjb_1;" && scope.ngModel){
                                if(scope.ngModel.indexOf(code)==-1 && scope.ngModel.indexOf("arch_xzjb_1;")==-1){
                                    //------没有的
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