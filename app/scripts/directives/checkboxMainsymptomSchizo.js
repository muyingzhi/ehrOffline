define(['directives/directives'],function(directives){
        directives.directive('checkboxMainsymptomSchizo',[function(){
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
                    scope.datas = [{id:"HR483_01",text:"幻觉"},{id:"HR483_02",text:"交流困难"},{id:"HR483_03",text:"猜疑"},{id:"HR483_04",text:"喜怒无常"},{id:"HR483_05",text:"行为怪异"},
                                   {id:"HR483_06",text:"兴奋话多"},{id:"HR483_07",text:"伤人毁物"},{id:"HR483_08",text:"悲观厌世"},{id:"HR483_09",text:"无故外走"},{id:"HR483_10",text:"自语自笑"},
                                   {id:"HR483_11",text:"孤僻懒散"},{id:"HR483_99",text:"其他"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的且不是无症状的
                            if(scope.ngModel){
                                if(scope.ngModel.indexOf(code)==-1 ){
                                    //------没有的且未选择无症状的加上
                                    scope.ngModel += code;
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