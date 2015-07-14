define(['directives/directives'],function(directives){
        directives.directive('radioIrritability',[function(){
	        return {
	            restrict:"EA",
                scope :{
                    ngModel:"=",
                    name:"@",
                    score1:"@",
                    score2:"@",
                    score3:"@",
                    score4:"@",
                    sumscore:"@",
                    phzscore:"@"	
                },
                template : '<span ng-repeat="item in datas">' +
                        '<input name="{{name}}" score1={{score1}} score2={{score2}} score3={{score3}} score4={{score4}} sumscore={{sumscore}} phzscore={{phzscore}} type="radio" value="{{item.id}}" ng-click="click(item.id)" ng-checked="ngModel==item.id">{{item.text}}&nbsp;&nbsp;' +
                        '</span>',
	            replace:true,
                link : function(scope){
                    scope.datas = [{id:"1",text:"从来没有"},{id:"2",text:"一年1、2次"},{id:"3",text:"一年3、4次"},{id:"4",text:"一年5、6次"},{id:"5",text:"每次遇到上述原因都过敏"}];
                    scope.click = function(code){
                        scope.ngModel = code;
                        var item = scope.item;
                        var selectitem=code;
                        var score1=scope.score1;
                        var score2=scope.score2;
                        var score3=scope.score3;
                        var score4=scope.score4;
                        var sumscore=scope.sumscore;
                        var phzscore=scope.phzscore;
                    	
                    	if(score1!=undefined && score1!="" && score1!=null){//计算所属体质得分，和体质结果
                    		var value1=parseInt($('input[name="'+score1+'"]:checked').val()==undefined || $('input[name="'+score1+'"]:checked').val()==""?0:$('input[name="'+score1+'"]:checked').val());
                    		var value2=parseInt($('input[name="'+score2+'"]:checked').val()==undefined || $('input[name="'+score2+'"]:checked').val()==""?0:$('input[name="'+score2+'"]:checked').val());
                    		var value3=parseInt($('input[name="'+score3+'"]:checked').val()==undefined || $('input[name="'+score3+'"]:checked').val()==""?0:$('input[name="'+score3+'"]:checked').val());
                    		var value4=parseInt($('input[name="'+score4+'"]:checked').val()==undefined || $('input[name="'+score4+'"]:checked').val()==""?0:$('input[name="'+score4+'"]:checked').val());
                    		var sunmvalue=value1+value2+value3+value4;
                    		$("#"+sumscore).val(sunmvalue);
                    		var pjresult=sumscore.replace("score", "result");
                    		if(sunmvalue>=11){
                    			$("#"+pjresult).val("HR553_1");   
                    		}else if(sunmvalue>=9){
                    			$("#"+pjresult).val("HR553_2");
                    		}else{
                    			$("#"+pjresult).val("HR553_0");
                    		}
                    	}
                    	phzjudge();
                    }
                    function phzjudge(){
                    	//平和质项目
                		var value6=parseInt($('input[name="item1"]:checked').val()==undefined || $('input[name="item1"]:checked').val()==""?0:$('input[name="item1"]:checked').val());
                		var value7=parseInt($('input[name="item2"]:checked').val()==undefined || $('input[name="item2"]:checked').val()==""?0:$('input[name="item2"]:checked').val());
                		var value8=parseInt($('input[name="item4"]:checked').val()==undefined || $('input[name="item4"]:checked').val()==""?0:$('input[name="item4"]:checked').val());
                		var value9=parseInt($('input[name="item5"]:checked').val()==undefined || $('input[name="item5"]:checked').val()==""?0:$('input[name="item5"]:checked').val());
                		var value10=parseInt($('input[name="item13"]:checked').val()==undefined || $('input[name="item13"]:checked').val()==""?0:$('input[name="item13"]:checked').val());
                		//其他体质得分
                		var yxzscore=parseInt($("#yxzscore").val()==undefined || $("#yxzscore").val()==""?0:$("#yxzscore").val());
                		var qxzscore=parseInt($("#qxzscore").val()==undefined || $("#qxzscore").val()==""?0:$("#qxzscore").val());
                		var yinxzscore=parseInt($("#yinxzscore").val()==undefined || $("#yinxzscore").val()==""?0:$("#yinxzscore").val());
                		var tszscore=parseInt($("#tszscore").val()==undefined || $("#tszscore").val()==""?0:$("#tszscore").val());
                		var srzscore=parseInt($("#srzscore").val()==undefined || $("#srzscore").val()==""?0:$("#srzscore").val());

                		var xyzscore=parseInt($("#xyzscore").val()==undefined || $("#xyzscore").val()==""?0:$("#xyzscore").val());
                		var qyzscore=parseInt($("#qyzscore").val()==undefined || $("#qyzscore").val()==""?0:$("#qyzscore").val());
                		var tzzscore=parseInt($("#tzzscore").val()==undefined || $("#tzzscore").val()==""?0:$("#tzzscore").val());
                		var phzsunmvalue=value6+24-value7-value8-value9-value10;
                		$("#phzscore").val(phzsunmvalue);
                		//判断结果
                		if(phzsunmvalue>=17&&yxzscore<8&&qxzscore<8&&yinxzscore<8&&tszscore<8&&srzscore<8&&xyzscore<8&&qyzscore<8&&tzzscore<8){
                			$("#phzresult").val("HR552_1");
                		}else if(phzsunmvalue>=17&&yxzscore<10&&qxzscore<10&&yinxzscore<10&&tszscore<10&&srzscore<10&&xyzscore<10&&qyzscore<10&&tzzscore<10){
                			$("#phzresult").val("HR552_2");
                		}else{
                			$("#phzresult").val("HR552_0");
                		}
                    }
                }
	        };
	    }]);
    }
);