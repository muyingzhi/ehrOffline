define(['directives/directives'],function(directives){
        directives.directive('checkboxLhd',[function(){
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
                        {id:"HR234_0",text:"无"},
                        {id:"HR234_1",text:"个人卫生"},
                        {id:"HR234_2",text:"心理"},
                        {id:"HR234_3",text:"营养"},
                        {id:"HR234_4",text:"避免致畸因素和疾病对胚胎的不良影响"},
                        {id:"HR234_5",text:"产前筛查宣传告知"},
                        {id:"HR234_6",text:"其他"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的
                            if(scope.ngModel){
                                if(code=="HR234_0;"){
                                    scope.ngModel = code;//---无，与其它互斥
                                }else{
                                    if(scope.ngModel.indexOf("HR234_0")>=0){
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