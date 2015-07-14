define(['directives/directives'],function(directives){
    directives.directive('hysNavMenu',['$rootScope','$location',function($rootScope,$location){
        return {
            restrict:"EA",
            replace:true,
            transclude:true,
            scope:{
                url:'=menuUrl',
                label:'=text',
                icon:'=menuIcon',
                children :'=menuChildren',
                parameter : '=menuParameter',
                obj : "="
            },
            template : "<li>" +
                    "<a href='{{url}}'>\
                            <span class='glyphicon {{icon}}' ng-transclude></span>&nbsp;\
                        </a></li>",
            link : function(scope,element,attrs){
                var $this = angular.element(element);
                var children = scope.children;
                var $childrenMenu ;
                if(children){
                    $childrenMenu = makeMenuChild(children);
                    if($childrenMenu && $childrenMenu.length>0){
                        //----------添加子菜单
                        var $a = $this.find("a");
                        $a.addClass("dropdown-toggle").attr({"data-toggle":'dropdown',"url":"#"});
                        $a.append("<span class='caret'></span>");
                        $this.append($childrenMenu);
                        $this.addClass("dropdown");
                    }
                };
                $this.hover(
                    function(){$(this).css({'background-color':'#000'})},
                    function(){$(this).css({'background-color':''})}
                );
		        function makeMenuChild(childItems){
		            if(childItems){
		                var $ulElement = angular.element("<ul class='dropdown-menu' role='menu'></ul>");
		                for(var i=0;i<childItems.length;i++){
		                    
		                    var child = childItems[i];
		                    var $li = angular.element("<li></li>");
		                    var iconClass = child.iconClass ;
		                    if(!iconClass){
		                        iconClass = "glyphicon-tint";
		                    }
		                    
		                    var $a = angular.element('<a >\
		                        <span class="glyphicon '+iconClass+'"></span>&nbsp;'+child.text + '\
		                        </a>').data(child);
		                    
                            $a.attr("href",child.url + '/'+scope.parameter);
                            
		                    $li.append($a);
		                    $ulElement.append($li);
		                }
		                return $ulElement;
		            }
		        }
            }
        }
    }]);
});