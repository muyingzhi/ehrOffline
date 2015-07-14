define(['directives/directives'],function(directives){
        directives.directive('checkboxHealthAdviceVisits',[function(){
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
                    scope.datas = [{id:"lady_zhidao_ch_1",text:"个人卫生"},
                                   {id:"lady_zhidao_ch_2",text:"心理"},
                                   {id:"lady_zhidao_ch_3",text:"营养"},
                                   {id:"lady_zhidao_ch_4",text:"母乳喂养"},
                                   {id:"lady_zhidao_ch_5",text:"新生儿护理与喂养"},
                                   {id:"lady_zhidao_ch_6",text:"其他"}];
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