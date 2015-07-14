define(['directives/directives'],function(directives){
    directives.directive('hysBoxViews',['$rootScope','$location',function($rootScope,$location){
        return {
            restrict:"EA",
            replace:true,
            transclude:true,
            scope:{
                url:'=viewUrl',
                label:'=viewText',
                icon:'=viewIcon',
                title : '=viewTitle',
                jmid : '@viewJmid',
                obj : "="
            },
            template : "<li title='{{title}}'>" +
			           "<a href='{{url}}/{{jmid}}'>\
			           <span class='glyphicon {{icon}}' aria-hidden='true'></span>\
			           <span class='glyphicon-class'>{{label}}</span>\
			           </a></li>"
        }
    }]);
});