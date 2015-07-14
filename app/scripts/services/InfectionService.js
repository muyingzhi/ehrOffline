define(['services/services'
    ],function(services){
    services.service("InfectionService", ['$q','$rootScope','$indexedDB',
        function($q,$rootScope,$indexedDB){
            var store = $indexedDB.objectStore("EHEALTH_DIS_INFECTIONCARD");
            /**
             * 按姓名查找
             */
            this.findByName = function(name){
                var d = $q.defer();
                var list = [];
                var myQuery = $indexedDB.queryBuilder().$index('fullname_idx').$eq(name);
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
                    if(result && id==result.infectioncardid){
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