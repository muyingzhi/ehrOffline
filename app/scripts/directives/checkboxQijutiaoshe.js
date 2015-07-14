define(['directives/directives'],function(directives){
        directives.directive('checkboxQijutiaoshe',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    id:"@",
                    name:"@"
                },
                template : '<span ng-repeat="item in datas">' +
                           '<lable>' +
                           '<input id="{{id}}" name="{{name}}" type="checkbox" text="{{item.text}}" value="{{item.id}}" ng-click="click($event,item.id)" ng-checked="ischecked(item.id)">{{item.text}}&nbsp;&nbsp;' +
                           '</lable><br/>' +
                           '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"保证充足的睡眠时间，逐步养成夜间睡眠、白天活动的作息习惯",text:"保证充足的睡眠时间，逐步养成夜间睡眠、白天活动的作息习惯；"},
                                   {id:"养成良好的小便习惯，适时把尿，培养每日定时大便的习惯",text:"养成良好的小便习惯，适时把尿，培养每日定时大便的习惯；"},
                                   {id:"衣着要宽松，不可紧束而妨碍气血流通，影响骨骼生长发育",text:"衣着要宽松，不可紧束而妨碍气血流通，影响骨骼生长发育"},
                                   {id:"春季注意保暖，正确理解“春捂”，夏季纳凉要适度，避免直吹电风扇，空调温度不宜过低，秋季避免保暖过度，提倡 “三分寒”，正确理解“秋冻”，冬季室内不宜过度密闭保暖，应适当通风，保持空气新鲜",
                                  text:"春季注意保暖，正确理解“春捂”，夏季纳凉要适度，避免直吹电风扇，空调温度不宜过低，秋季避免保暖过度，提倡 “三分寒”，正确理解“秋冻”，冬季室内不宜过度密闭保暖，应适当通风，保持空气新鲜；"},
                                   {id:"经常到户外活动，多见风日，以增强体质",text:"经常到户外活动，多见风日，以增强体质；"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){//true  为选中 false 为取消选择
                            if(scope.ngModel){
                            	scope.ngModel += code;
                            }else{// 说明是为选择任何一个
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