define(['directives/directives','easyui'],function(directives){
    directives.directive('easyCombobox',[function(){
        return {
            restrict:"AE",
            scope : {
                id:"@",
                name:"@",
                data:"=",
                ngModel:"="
            },
            template:'<div id="{{id}}" name="{{name}}"></div>',
            link : function(scope,element,attrs){
                console.log("easyCombobox link");
                $(element).combobox({
                    valueField : "id",
                    textField  : "text",
                    data :scope.data,
                    value : scope.ngModel,
                    onSelect:function(record){
                        //alert(record.id);
                        
                    }
                });
            }
        }
    }]);
});