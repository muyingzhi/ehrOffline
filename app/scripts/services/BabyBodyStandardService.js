define(['services/services'
    ],function(services){
    services.service("BabyBodyStandardService", ['$q','$rootScope','$indexedDB',function($q,$rootScope,$indexedDB){
    	var store = $indexedDB.objectStore("EHEALTH_KID_HEALTHCHECKSTANDAR");
    	/**                    
    	 * 0-1岁儿童
    	 * 按照月份查找..birthyear_idx
    	 */
    	this.findByBirhmonth=function(birhmonth){
    		  var d = $q.defer();
              var list = [];
              var myQuery = $indexedDB.queryBuilder().$index('birhmonth_idx').$eq(birhmonth);
              store.each(function(cursor){
                  if(cursor){
                      list.push(cursor.value);
                      cursor.continue();
                  };
              },myQuery).then(function(){
                  d.resolve(list);
              });
              return d.promise;
    	}
    	this.findByBirhyear=function(birhyear){
    		var d=$q.defer();
    		var list=[];
    		var myQuery=$indexedDB.queryBuilder().$index('birthyear_idx').$eq(birhyear);
    		store.each(function(cursor){
    			if(cursor){
        			list.push(cursor.value);
        			cursor.continue();
        		};
    		},myQuery).then(function(){
    			d.resolve(list);
    		});
    		return d.promise;
    	}
    	
    	var results= new Array("bodylevel_4|下等","bodylevel_3|中下等","bodylevel_2|中等","bodylevel_1|中上等","bodylevel_0|上等");
    	this.saveArrinfo=function(boySatndar,standard,heightOrweight){
    		var boyarrHeight=new Array(boySatndar.heightlssd,boySatndar.heightlosd,boySatndar.heightosd,boySatndar.heightssd);
    		var boyarrWeight=new Array(boySatndar.weightlssd,boySatndar.weightlosd,boySatndar.weightosd,boySatndar.weightssd);
    		if(standard=="height"){
    			return getBoyHeight(boyarrHeight,heightOrweight);
    		}else{
    			return getBoyWeight(boyarrWeight,heightOrweight);
    		};
    	}
    	
    	//4岁以下身高标准
    	function  getBoyHeight(boyarrHeight,height){
    		for(var i=0;i<boyarrHeight.length;i++){
    			if(boyarrHeight[i] == null){
    				return -1;
    			}
    			if(parseFloat(height) < parseFloat(boyarrHeight[i])){
    				return i;
    			};
        	}
    		return boyarrHeight.length;
    	}
    	
    	//4岁以下体重标准
    	function  getBoyWeight(boyarrWeight,weight){
    		for(var i=0;i<boyarrWeight.length;i++){
    			if(boyarrWeight[i] == null){
    				return -1;
    			}
    			if(parseFloat(weight) < parseFloat(boyarrWeight[i])){
    				return i;
    			};
        	}
    		return boyarrWeight.length;
    	}
    	
    	
    	
    	this.renderResult=function(type,index){
    		if(type == -1 || index == -1){
    			return "-1";
    		}else{
    			return results[index];
    		}
    	};
       }
    ]);
});