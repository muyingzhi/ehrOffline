define(['services/services'
    ],function(services){
    services.service("DataDictService", ['$q','$indexedDB',
        function($q,$indexedDB){
	    	/**
	         * 查找药品目录单位
	         */
	        this.listUnits = function(platcode){
	            var d = $q.defer();
	            $indexedDB.objectStore("DRUG_LIST_HOSPITAL").find(platcode).then(function(item){
	            	if(!item){
		                $.messager.alert("检索药品单位发生错误:","未检索到药品");
		                d.resolve([]);
	            		return;
	            	}
	                var result = [];
	                result.push({id:item.packageunit1,text:item.packageunit1});
	                result.push({id:item.packageunit2,text:item.packageunit2});
	                d.resolve(result);
	            });
	            return d.promise;
	        }
    		
	    	/**
	         * 药品目录
	         */
	        this.listDrug = function(){
	            var d = $q.defer();
	            listData("DRUG_LIST_HOSPITAL").then(function(list){
	                if(angular.isArray(list)){
	                    var result = [];
	                    for(var i=0;i<list.length;i++){
	                        var item = list[i];
	                        result.push({itemcode:item.platcode,itemname:item.drugname,pinyin:item.spell,itemspec:item.spec});
	                    }
	                    d.resolve(result);
	                }else{
	                    $.messager.alert("检索药品目录发生错误:",arguments);
	                    d.resolve([]);
	                }
	            });
	            return d.promise;
	        };
	        
	    	/**
	         * ICD10编码
	         */
	        this.listICD10 = function(){
	            var d = $q.defer();
	            listData("EHEALTH_DIS_ICD10CARD").then(function(list){
	                if(angular.isArray(list)){
	                    var result = [];
	                    for(var i=0;i<list.length;i++){
	                        var item = list[i];
	                        result.push({icdcode:item.icdcode,icdname:item.icdname,pinyin:item.pinyin});
	                    }
	                    d.resolve(result);
	                }else{
	                    $.messager.alert("检索ICD10编码发生错误:",arguments);
	                    d.resolve([]);
	                }
	            });
	            return d.promise;
	        };
            
            /**
             * 机构字典
             */
            this.listTGOV = function(){
                var d = $q.defer();
                listData("T_GOVINFO").then(function(list){
                    if(angular.isArray(list)){
                        var result = [];
                        for(var i=0;i<list.length;i++){
                            var item = list[i];
                            result.push({id:item.govcode,text:item.govname});
                        }
                        d.resolve(result);
                    }else{
                        $.messager.alert("检索机构字典发生错误:",arguments);
                        d.resolve([]);
                    }
                });
                return d.promise;
            };
            /**
             * 人员
             */
            this.listUSER = function(){
                var d = $q.defer();
                listData("HYS_USER").then(function(list){
                    if(angular.isArray(list)){
                        var result = [];
                        for(var i=0;i<list.length;i++){
                            var item = list[i];
                            result.push({id:item.platuserid,text:item.username});
                        }
                        d.resolve(result);
                    }else{
                        $.messager.alert("检索人员字典发生错误:",arguments);
                        d.resolve([]);
                    }
                });
                return d.promise;
            };
            /**
             * 人员字典
             */
            this.listDOCTOR = function(){
                var d = $q.defer();
                listData("HYS_USER").then(function(list){
                    if(angular.isArray(list)){
                        var result = [];
                        for(var i=0;i<list.length;i++){
                            var item = list[i];
                            result.push({id:item.doctcode,text:item.username});
                        }
                        d.resolve(result);
                    }else{
                        $.messager.alert("检索人员字典发生错误:",arguments);
                        d.resolve([]);
                    }
                });
                return d.promise;
            };
            /**
             * 区划
             */
            this.listGOVDICT = function(){
                var d = $q.defer();
                listData("PUBLIC_GOV_DICT").then(function(list){
                    if(angular.isArray(list)){
                        var result = [];
                        for(var i=0;i<list.length;i++){
                            var item = list[i];
                            result.push({id:item.id,text:item.text});
                        }
                        d.resolve(result);
                    }else{
                        $.messager.alert("检索区划字典发生错误:",arguments);
                        d.resolve([]);
                    }
                });
                return d.promise;
            };
            /**
             * 区划--村
             */
            this.listResident = function(areacode){
                var d = $q.defer();
                $indexedDB.objectStore("PUBLIC_GOV_DICT").find(areacode).then(function(item){
                    if(!item){return;}
                    var list = item.children
                    if(angular.isArray(list)){
                        var result = [];
                        for(var i=0;i<list.length;i++){
                            var item = list[i];
                            result.push({id:item.id,text:item.text});
                        }
                        d.resolve(result);
                    }else{
                        $.messager.alert("检索村字典发生错误:",arguments);
                        d.resolve([]);
                    }
                });
                return d.promise;
            }
            function listData(storename){
                var store = $indexedDB.objectStore(storename);
                return store.getAll()
            }
        }
    ]);
    
});