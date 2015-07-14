define(['directives/directives'],function(directives){
        directives.directive('checkboxDiscomname',[function(){
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
                        {id:"HR401_10",text:"无"},
                        {id:"HR401_11",text:"高血压"},
                        {id:"HR401_12",text:"糖尿病"},
                        {id:"HR401_13",text:"冠心病"},
                        {id:"HR401_14",text:"恶性肿瘤"},
                        {id:"HR401_15",text:"慢性阻塞性肺疾病"},
                        {id:"HR401_16",text:"重性精神疾病"},
                        {id:"HR401_17",text:"脑卒中"},
                        {id:"HR401_18",text:"结核病"},
                        {id:"HR401_19",text:"肝炎"},
                        {id:"HR401_20",text:"其他法定传染病"},
                        {id:"HR401_21",text:"其它"},
                        {id:"HR401_22",text:"职业病"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的
                            if(scope.ngModel){
                                if(code=="HR401_10;"){
                                    scope.ngModel = code;//---无，与其它互斥
                                }else{
                                    if(scope.ngModel.indexOf("HR401_10")>=0){
                                        scope.ngModel = "";//----原来的无，清除
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