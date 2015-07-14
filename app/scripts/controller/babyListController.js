define(['controller/controllers','services/DataDictService'],function(app){
    var controller = ['$rootScope','$scope','$location','$indexedDB','$routeParams','DataDictService'
        ,function($rootScope,$scope,$location,$indexedDB,$routeParams,datadictService){
        $scope.selectArch = function(id){
            $rootScope.rootParameter = id;
        }  ;  
        //----------读取参数，为表单赋值
        var aid = $routeParams.aid;
        //---------设置顶端菜单
        $rootScope.topNav = [
            {
                    text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/archlist/"
                }
          ];
       
        //----人员字典
        datadictService.listUSER().then(function(list){
            $scope.dictDoctor = list;
	        var list = [];
	        var myQuery = $indexedDB.queryBuilder().$index('archid_idx').$eq(aid);
	        //首次随访表
	        $indexedDB.objectStore("EHEALTH_KID_BABYVISITSRECORD").each(function(cursor){
	            if(cursor){
	                list.push(cursor.value);
	                cursor.continue();
	            };
	        },myQuery).then(function(){
	        	if(list.length!=0){
	        		var babyvisitsrecordid=list[0].babyvisitsrecordid;
	        		document.getElementById("aa").innerHTML="首次儿童随访  √";
	        		document.getElementById("aa").href="#/arch/babyfirstdetail/"+aid+"&"+babyvisitsrecordid;
	        	}else{
	        		document.getElementById("aa").href="#/arch/babyfirstdetail/"+aid+"&"+0;
	        	} 
	        },function(){
	            alert("error");
	        });
	        //3岁以内随访表
	        $indexedDB.objectStore("EHEALTH_KID_BABYCHECKRECORD").each(function(cursor){
	            if(cursor){
	                list.push(cursor.value);
	                cursor.continue();
	            };
	        },myQuery).then(function(){
	        	var div1child1=document.getElementById("div1").children;
	        	var div1child2=document.getElementById("div2").children;
	        	var div1child3=document.getElementById("div3").children;
	        	var div1child4=document.getElementById("div4").children;
	        	if(list.length!=0){
	        	     	for(var i=1;i<list.length;i++){
	        	     		var sid=list[i].project;
	        	     		if(list[i].babycheckrecordid){
	        	     			document.getElementById(sid).href =
	        	     				"#/arch/babydetail/"+aid+"&"+list[i].babycheckrecordid+"&"+sid;
	        	     		}else if(list[i].kidcheckrecordid){
	        	     			document.getElementById(sid).href =
	        	     				"#/arch/babymorethreedetail/"+aid+"&"+list[i].kidcheckrecordid+"&"+sid;
	        	     		}
                         document.getElementById(sid).innerHTML=document.getElementById(sid).innerHTML+"  √";
	        	     	};
	        	    };
	        	inserNodesDiv1(div1child1);
	        	inserNodes(div1child2);
	        	inserNodes(div1child3);
	        	inserNodesDiv4(div1child4);
	        },function(){
	            alert("error");
	        });
	        
	        //3以上岁随访表
	        $indexedDB.objectStore("EHEALTH_KID_KIDCHECKRECORD").each(function(cursor){
	            if(cursor){
	                list.push(cursor.value);
	                cursor.continue();
	            };
	        },myQuery).then(function(){
	        	
	        },function(){
	            alert("error");
	        });
        });
        function inserNodesDiv1(div1child){
        	for(var a=1;a<div1child.length;a++){
        		if(div1child[a]){
        			if(div1child[a].href==document.getElementById("text").href){
        				document.getElementById(div1child[a].id).href="#/arch/babydetail/"+aid+"&"+0+"&"+div1child[a].id;
        			};
        		};
        	};
        };
        function inserNodes(div1child){
        	for(var a=0;a<div1child.length;a++){
        		if(div1child[a]){
        			if(div1child[a].href==document.getElementById("text").href){
        				document.getElementById(div1child[a].id).href="#/arch/babydetail/"+aid+"&"+0+"&"+div1child[a].id;
        			};
        		};
        	};
        };
        function inserNodesDiv4(div1child){
	        for(var a=0;a<div1child.length;a++){
	        	if(div1child[a]){
	        		if(div1child[a].href==document.getElementById("text").href){
	        	     	  document.getElementById(div1child[a].id).href="#/arch/babymorethreedetail/"+aid+"&"+0+"&"+div1child[a].id;
	        		  };
	        	   };
        };
       } ;   
    }];
    
    return app.controller("babyListController",controller);
});
