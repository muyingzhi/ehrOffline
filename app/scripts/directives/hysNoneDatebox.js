define(['directives/directives'],function(directives){
	directives.directive('hysNoneDatebox',function(){
		return {
            restrict:"A",
            require: "?ngModel",
            link: function(scope,element,attrs,ngModel){
            	if(!ngModel) return;
            	
            	function getDate(date){
            		var y = date.getFullYear();
    	        	var m = date.getMonth()+1;
    	        	var d = date.getDate();
    	        	return y +"-"+ ("00"+ m).substr((""+ m).length) + "-" + ("00"+ d).substr((""+ d).length); 
            	}
            	scope.$watch(attrs.ngModel,function(newVal,oldVal){
            		if(newVal === oldVal){
            			// 只会在监控器初始化阶段运行
            			element.datebox({
            				parser: function(s){
            					var t = Date.parse(s);
            					if (!isNaN(t)){
            						return new Date(t);
            					} else {
            						return new Date();
            					}
            				},
            				formatter: function(date){
            					return getDate(date); 
            				},
            				onSelect: function(date){
            					var _formatterDate = getDate(date);
            					scope.$apply(function(){
            						ngModel.$setViewValue(_formatterDate);
            					})
            				},
            				onChange: function(newDate,oldDate){
            					var t = Date.parse(newDate);
            					if(!isNaN(t)){
            						ngModel.$setViewValue(newDate);
            					}else{
        							ngModel.$setViewValue();
            					}
            				}
            			})
            		}else{
            			var _modelArray = attrs.ngModel.split(".");
            			var _value="";
            			for(var i=0;i<_modelArray.length;i++){
            				if(_value){
            					_value=_value[_modelArray[i]]
            				}else{
            					_value=scope[_modelArray[i]];
            				}
            			};
            			if(_value!=undefined){
            				element.datebox('setValue', _value)
            			}else{
            				element.datebox('setValue', '')
            			}
            		}
            	});
            }
		}
	})
})