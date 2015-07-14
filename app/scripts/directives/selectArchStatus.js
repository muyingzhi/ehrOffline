define(['directives/directives'],function(directives){
        directives.directive('selectArchStatus',[function(){
	        return {
	            restrict:"EA",
                require:['ngModel'],
                template : '<select ' +
                        ' ng-options="item.id as item.text for item in datas">' +
                        ' <option value="">--请选择--</option>' +
                        '</select>',
	            replace:true,
                link : function(scope,element,attrs,ctrls){
                    scope.datas = [
                                {id:"HR270_1",text:"临时档案"},
                                {id:"HR270_2",text:"活动"},
                                {id:"HR270_3",text:"终止"},
                                {id:"HR270_4",text:"死亡"}];
                    
                    //-----------初值
                    var values = []
                    scope.datas.forEach(function(item,index,array){
                        if(item.id==scope.ngModel){
                            values.push(index);
                        }
                    });
                    $(element).val(values);
                }
	        };
	    }]);
    }
);