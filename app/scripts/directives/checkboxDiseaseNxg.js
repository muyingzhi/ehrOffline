define(['directives/directives'],function(directives){
        directives.directive('checkboxDiseaseNxg',[function(){
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
                    scope.datas = [{id:"arch_nxgjb_1",text:"未发现"},{id:"arch_nxgjb_2",text:"缺血性卒中"},{id:"arch_nxgjb_3",text:"脑出血"},
                                   {id:"arch_nxgjb_4",text:"蛛网膜下腔出血"},{id:"arch_nxgjb_5",text:"短暂性脑缺血发作"},{id:"arch_nxgjb_6",text:"其他"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的
                            if(code!="arch_nxgjb_1;" && scope.ngModel){
                                if(scope.ngModel.indexOf(code)==-1 && scope.ngModel.indexOf("arch_nxgjb_1;")==-1){
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