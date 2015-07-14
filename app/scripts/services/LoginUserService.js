define(['services/services'
    ],function(services){
    services.service("LoginUserService", ['$q','$rootScope','$indexedDB',
        function($q,$rootScope,$indexedDB){
            var store = $indexedDB.objectStore("LOGIN_USER");
            var hysuserStore = $indexedDB.objectStore("HYS_USER");
            /**
             * 清空
             */
            this.clear = function(){
                var d = $q.defer();
                store.clear().then(function(result){
                	d.resolve(result);
                });
                return d.promise;
            };
            /**
             * 检索全部记录,此表只保存一条记录
             */
            this.find = function(){
                var d = $q.defer();
                store.getAll().then(function(list){
                    if(angular.isArray(list)){
                        d.resolve(list[0]);
                    }else{
                        alert("检索登陆用户发生错误");
                        d.resolve("");
                    }
                });
                return d.promise;
            }
            /**
             * 插入
             */
            this.insert = function(data){
                var d = $q.defer();
                store.insert(data).then(function(result){
                    d.resolve(result)
                },function(err){
                    $.messager.alert(dataDicts.alertTitle,"记录登陆用户失败:"+err);
                    d.resolve(err);
                });
                
                return d.promise;
            }
            /**
             * 登陆
             */
            this.runLogin = function(loginInfo){
                var currentUser = {};
                hysuserStore.find("staffid_idx",loginInfo.username).then(
                    function(data){
                        if(data){
                            if(data.password == loginInfo.password){
                                currentUser = data;
                                store.clear().then(
                                    function(success){
                                    	store.insert(currentUser).then(
                                            function(user){
                                            	window.location.href = "app/views/index.html";
                                            },
                                            function(error){
                                                loginInfo.message = "【insertErr】:"+error;
                                            }
                                        )
                                    },
                                    function(error){
                                    	loginInfo.message = "【clearErr】:"+error;
                                    }
                                )
                            }else{
                            	loginInfo.password = "";
                            	loginInfo.message = "请输入正确的密码";
                            }
                        }else{
                        	loginInfo.message = "用户【"+ loginInfo.username +"】不存在；如未下载档案，请下载后再试！";
                        	loginInfo.username = "";
                            loginInfo.password = "";
                        }     
                    },
                    function(error){
                    	loginInfo.message = "【findErr】:"+error;
                    }    
                )
            }
        }
    ]);
    
});