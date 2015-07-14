define(['directives/directives'],function(directives){
        directives.directive('checkboxMainsymptomChecka',[function(){
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
                    scope.datas = [{id:"HR415_01",text:"无症状"},{id:"HR415_02",text:"头痛"},{id:"HR415_03",text:"头晕"},{id:"HR415_04",text:"心悸"},{id:"HR415_05",text:"胸闷"},
                                   {id:"HR415_06",text:"胸痛"},{id:"HR415_07",text:"慢性咳嗽"},{id:"HR415_08",text:"咳痰"},{id:"HR415_09",text:"呼吸困难"},{id:"HR415_10",text:"多饮"},
                                   {id:"HR415_11",text:"多尿"},{id:"HR415_12",text:"体重下降"},{id:"HR415_13",text:"乏力"},{id:"HR415_14",text:"关节肿痛"},{id:"HR415_15",text:"视力模糊"},
                                   {id:"HR415_16",text:"手脚麻木"},{id:"HR415_17",text:"尿急"},{id:"HR415_18",text:"尿痛"},{id:"HR415_19",text:"便秘"},{id:"HR415_20",text:"腹泻"},
                                   {id:"HR415_21",text:"恶心呕吐"},{id:"HR415_22",text:"眼花"},{id:"HR415_23",text:"耳鸣"},{id:"HR415_24",text:"乳房胀痛"},{id:"HR415_25",text:"其他"}];
                    scope.click = function($event,code){
                        var checkbox = $event.target;
                        code = code + ";";
                        if(checkbox.checked){
                            //------选中的且不是无症状的
                            if(code!="HR415_01;" && scope.ngModel){
                                if(scope.ngModel.indexOf(code)==-1 && scope.ngModel.indexOf("HR415_01;")==-1){
                                    //------没有的且未选择无症状的加上
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