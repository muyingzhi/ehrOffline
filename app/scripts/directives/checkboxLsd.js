define(['directives/directives'],function(directives){
        directives.directive('checkboxLsd',[function(){
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
                    scope.datas = [
                        {id:"HR333_0",text:"无"},
                        {id:"HR333_1",text:"吸烟"},
                        {id:"HR333_2",text:"饮酒"},
                        {id:"HR333_3",text:"服用药物"},
                        {id:"HR333_4",text:"接触有毒有害物质"},
                        {id:"HR333_5",text:"接触放射线"},
                        {id:"HR333_6",text:"其他"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的
                            if(scope.ngModel){
                                if(code=="HR333_0;"){
                                    scope.ngModel = code;//---无，与其它互斥
                                }else{
                                    if(scope.ngModel.indexOf("HR333_0")>=0){
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
                        if(scope.ngModel && scope.ngModel.indexOf(code)>=0){
                            checked = true;
                        }
                        return checked;
                    }
                }
	        };
	    }]);
    }
);