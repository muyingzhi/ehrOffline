define(['services/services'
    ],function(services){
    services.service("SynDataService", ['$q','$rootScope','$indexedDB',
        function($q,$rootScope,$indexedDB){
            
            /**
             * 查询未上传的数据
             */
			var initObject = {};
			var infoList = [];
            this.getUnUploadInfo = function(){
            	var me = this
                var d = $q.defer();
        		if(initObject.baseList === undefined){
        			var store = $indexedDB.objectStore("EHEALTH_ARCH_BASEINFO");
        			store.getAll().then(function(list){
        				initObject.baseList = list;
        				getUnUploadBase(0,list,infoList).then(function(resultlist){
        					initObject.currIndex = 0;
        					me.getUnUploadInfo();
        				})
        			},function(error){
    					d.reject(error);
    				})
        		}else{
        			initObject.currIndex ++;
        			if(initObject.currIndex >= initObject.baseList.length){
        				d.resolve(infoList);
        			}else{
        				getUnUploadBase(initObject.currIndex,initObject.baseList,infoList).then(function(){
        					me.getUnUploadInfo();
        				});
        			}
        		}
                
                return d.promise;
            };

            getUnUploadBase = function(index,list,infoList){
                var unUploadInfo = {
                    baseInfo: {
                    	name: "",
                        text: "健康档案",
                        storeValue: {}
                    },
                    healthcheckaInfo: {
                        text: "健康体检",
                        storeList: []
                    },
                    dmvisitInfo: {
                        text: "糖尿病随访",
                        storeList: []
                    },
                    hyperInfo: {
                        text: "高血压随访",
                        storeList: []
                    },
                    schizoInfo: {
                        text: "重性精神病随访",
                        storeList: []
                    },
                    zyvisitInfo: {
                        text: "中医体质管理",
                        storeList: []
                    }
                };
                var count = list.length;
                var baseinfo = list[index];
                var d = $q.defer();
                if (index >= count) {
                	d.resolve(infoList);
                } else{
                    return getAllFollowVisit(baseinfo,unUploadInfo).then(
                        function(data){
                        	if(data){
                        		infoList.push(data);
                        	}
                        }
                    )
                };

                return d.promise;
            }

            getAllFollowVisit = function(baseInfo,unUploadInfo){
            	var had = false;
                var d = $q.defer();
                if(baseInfo.storeSign == "1"){
                    unUploadInfo.baseInfo.storeValue = baseInfo;
                    had = true;
                }
                unUploadInfo.baseInfo.name = baseInfo.fullname;
                 getUnUploadVisit("EHEALTH_ARCH_HEALTHCHECKA","archid_idx",baseInfo.arch_basicinfoid).then(
                    function(list){
                        unUploadInfo.healthcheckaInfo.storeList = list;
                        if(list.length > 0 ){
                        	had = true;
                        }
                        getUnUploadVisit("EHEALTH_DIS_DMVISIT","archid_idx",baseInfo.arch_basicinfoid).then(
                            function(list){
                                unUploadInfo.dmvisitInfo.storeList = list;
                                if(list.length > 0 ){
                                	had = true;
                                }
                                getUnUploadVisit("EHEALTH_DIS_HYPERTENSIONVISIT","archid_idx",baseInfo.arch_basicinfoid).then(
                                    function(list){
                                        unUploadInfo.hyperInfo.storeList = list;
                                        if(list.length > 0 ){
                                        	had = true;
                                        }
                                        getUnUploadVisit("EHEALTH_DIS_SCHIZOPHRENIAVISIT","archid_idx",baseInfo.arch_basicinfoid).then(
                                            function(list){
                                                unUploadInfo.schizoInfo.storeList = list;
                                                if(list.length > 0 ){
                                                	had = true;
                                                }
                                                getUnUploadVisit("EHEALTH_ZY_VISIT","archid_idx",baseInfo.arch_basicinfoid).then(
                                                    function(list){
                                                        unUploadInfo.zyvisitInfo.storeList = list;
                                                        if(list.length > 0 ){
                                                        	had = true;
                                                        }
                                                        if(had == true){
                                                        	d.resolve(unUploadInfo);
                                                        }else{
                                                        	d.resolve("");
                                                        }
                                                })
                                        })
                                })
                        })
                    })
                return d.promise;
            }

            getUnUploadVisit = function(storeName,indexName,indexValue){
                var d = $q.defer();
                var queryList = [];
                var resultList = [];
                var store = $indexedDB.objectStore(storeName);
                var myQueryOptions = $indexedDB.queryBuilder().$index(indexName).$eq(indexValue);
                store.each(function(cursor){
                    if (cursor) {
                    	alert("cursor.value:"+cursor.value);
                        queryList.push(cursor.value);
                        cursor.continue();
                    }else{
                        if (queryList.length > 0) {
                            for (var i = 0; i < queryList.length; i++) {
                                var queryinfo = queryList[i];
                                if (queryinfo.storeSign =="1") {
                                    resultList.push(queryinfo);
                                };
                            };
                        };
                        d.resolve(resultList);
                    }
                },myQueryOptions);
                return d.promise;
            }
        }
    ]);
    
});