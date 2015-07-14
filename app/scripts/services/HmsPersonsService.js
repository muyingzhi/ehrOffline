define(['services/services'
    ],function(services){
    services.service("HmsPersonsService", ['$q','$rootScope','$indexedDB',
        function($q,$rootScope,$indexedDB){
            var store = $indexedDB.objectStore("HMSPERSONS");
            /**
             * 按姓名查找，结果为数组
             */
            this.findByName = function(name){
                var d = $q.defer();
                var list = [];
                var myQuery = $indexedDB.queryBuilder().$index('username_idx').$eq(name);
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
             * 增加或更改记录
             */
            this.upsert = function(person){
                var d = $q.defer();
                this.findByNumberOfCase(person.numberofcase).then(function(list){
                    if(list && list.length>0){
                        person = angular.extend(list[0],person);
                        d.resolve(person.numberofcase)
                    }else{
                        store.upsert(person).then(function(result){
                            d.resolve(person.numberofcase);
                        });
                    }
                });
                return d.promise;
            }
            /**
             * 记录总数
             */
            this.count = function(){
                return store.count();
            }
            /**
             * 按病历号检索，结果为数组
             */
            this.findByNumberOfCase = function(numberOfCase){
                var d = $q.defer();
                var list = [];
                var myQuery = $indexedDB.queryBuilder().$index('numberofcase_idx').$eq(numberOfCase);
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
             * 根据主键查找1
             */
            this.findByID = function(id){
                var d = $q.defer();
                store.find(id).then(function(result){
                    if(result && id==result.arch_basicinfoid){
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