define(['directives/directives'],function(directives){
        directives.directive('checkboxInspdisease',[function(){
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
                    scope.datas = [{id:"HR623_1",text:"注射毒品史"},
                                   {id:"HR623_2",text:"非婚异性性接触史"},
                                   {id:"HR623_3",text:"配偶/固定性伴阳性"},
                                   {id:"HR623_4",text:"男男性行为史 口献血（浆）史"},
                                   {id:"HR623_5",text:"输血/血制品史"},
                                   {id:"HR623_6",text:"母亲阳性"},
                                   {id:"HR623_7",text:"职业暴露史"},
                                   {id:"HR623_8",text:"手术史"},
                                   {id:"HR623_9",text:"其他"},
                                   {id:"HR623_10",text:"不详"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            if(scope.ngModel){
                                if(scope.ngModel.indexOf(code)==-1 ){
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