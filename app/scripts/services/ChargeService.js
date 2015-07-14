define(['services/services'
    ],function(services){
    services.service("ChargeService", ['$q','$rootScope','$indexedDB',
        function($q,$rootScope,$indexedDB){
            var store = $indexedDB.objectStore("OUTP_PRESC_DETAIL");
            /**
             * 处方药品查找处方
             */
            this.findByOutpid = function(casehistoryid){
                var d = $q.defer();
                var list = [];
                var myQuery = $indexedDB.queryBuilder().$index('casehistory_idx').$eq(casehistoryid);
                store.each(function(cursor){
                    if(cursor){
                        list.push(cursor.value);
                        cursor.continue();
                    }
                },myQuery).then(function(){
                    d.resolve(list);
                });
                return d.promise;
            };
            /**
             * 检索全部记录
             */
            this.findAll = function(){
                var d = $q.defer();
                store.getAll().then(function(list){
                    if(angular.isArray(list)){
                        d.resolve(list);
                    }else{
                        $.messager.alert("检索全部记录发生错误:",arguments);
                        d.resolve([]);
                    }
                });
                return d.promise;
            }
            /**
             * 
             */
            this.findByID = function(id){
                var d = $q.defer();
                store.find(id).then(function(result){
                    if(result && id==result.casehistoryid){
                        var list = [];
                        list.push(result);
                        d.resolve(list);
                    }else {
                        $.messager.alert("根据主键取记录发生错误:",arguments);
                        d.resolve([]);
                    }
                });
                return d.promise;
            }
        }
    ]);
    
});