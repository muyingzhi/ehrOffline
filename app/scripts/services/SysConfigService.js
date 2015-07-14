define(['services/services'
    ],function(services){
    services.service("SysConfigService", ['$q','$rootScope','$indexedDB',
        function($q,$rootScope,$indexedDB){
            var store = $indexedDB.objectStore("SYS_CONFIG");
            /**
             * 根据configname检索数据
             */
            this.findById = function(idValue){
                var d = $q.defer();
                store.find(idValue).then(
                    function(data){
                        d.resolve(data);
                    },
                    function(error){
                        d.resolve(error)
                    }
                );
                return d.promise;
            }
            /**
             * 检索全部数据
             */
            this.findAll = function(){
            	var d = $q.defer();
            	store.getAll().then(
            			function(list){
            				if(angular.isArray(list)){
            					d.resolve(list);
            				}else{
            					d.resolve([]);
            				}
            			},
            			function(error){
            				d.resolve(error)
            			}
            	);
            	return d.promise;
            }
            /**
             * 插入
             */
            this.upsert = function(data){
                var d = $q.defer();
                this.findById(data.configname).then(
                    function(configData){
                        if(configData){
                            store.modifyByKey(data,configData.configname).then(
                                function(result){
                                    d.resolve(result)
                                },function(error){
                                    d.resolve(error);
                                }
                            )
                        } else{
                            store.upsert(data).then(
                                function(result){
                                d.resolve(result)
                                },function(error){
                                    d.resolve(error);
                                }
                            );
                        } 
                    },
                    function(error){
                        d.resolve(error)
                    }
                )
                return d.promise;
            }
        }
    ]);
    
});