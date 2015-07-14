define(['services/services','jquery'],function(services,$){
    services.service("LocalDBService", ['$q',function($q){
        var db_name="ehr";
        var db_version = 3;
        var dataBase;
        var dbPromise;
        
        var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
        var request , database;
        try{
        request = indexedDB.open(db_name,db_version);
        request.onerror = function(event){
            alert("打开“EHR”数据库失败"+event.target.errorCode)
        };
        request.onblocked = function(e){
            alert("on blocked");
        }
        }catch(ex){
            alert(ex);
        }
        request.onsuccess = function(event){
            database = event.target.result;
        };
        request.onupgradeneeded = function(e){
            var db = e.target.result, tx = e.target.transaction;
            console.log('upgrading database "' + db.name + '" from version ' + e.oldVersion+
                ' to version ' + e.newVersion + '...');
	        database = db;
	        alert("进行数据库初始化，版本："+database.version);
	                objStore = db.createObjectStore('EHEALTH_ARCH_BASEINFO', {keyPath: 'arch_basicinfoid'});
	                objStore.createIndex('fullname_idx', 'fullname', {unique: false});
	                objStore.createIndex('identityno_dx', 'identityno', {unique: false});
	                
	                objStore = db.createObjectStore('HMS_PERSON', {keyPath: 'id'});
	                objStore.createIndex('fullname_idx', 'fullname', {unique: false});
	                
	                objStore = db.createObjectStore('EHEALTH_DIS_HYPERTENSIONVISIT', {keyPath: 'hypertensionvisitid'});
	                objStore.createIndex('archid_idx', 'archid', {unique: false});
	                
	                objStore = db.createObjectStore('EHEALTH_DIS_DMVISIT', {keyPath: 'dmvisitid'});
	                objStore.createIndex('archid_idx', 'archid', {unique: false});
	                
	                objStore = db.createObjectStore('EHEALTH_ZY_VISIT', {keyPath: 'id'});
	                objStore.createIndex('archid_idx', 'archid', {unique: false});
	                
	                objStore = db.createObjectStore('EHEALTH_ARCH_HEALTHCHECKA', {keyPath: 'healthcheckaid'});
	                objStore.createIndex('archid_idx', 'arch_id', {unique: false});
	                
	                objStore = db.createObjectStore('EHEALTH_DIS_SCHIZOPHRENIAVISIT', {keyPath: 'schizophreniavisitid'});
	                objStore.createIndex('archid_idx', 'archid', {unique: false});
	                
	                objStore = db.createObjectStore('T_GOVINFO', {keyPath: 'govcode'});
	                
	                objStore = db.createObjectStore('HYS_USER', {keyPath: 'platuserid'});
	                objStore.createIndex('staffid_idx', 'staffid', {unique: true});
	                
	                objStore = db.createObjectStore('PUBLIC_GOV_DICT', {keyPath: 'areacode'});
	                
	                objStore = db.createObjectStore('LOGIN_USER', {keyPath: 'platuserid'});
	                objStore.createIndex('staffid_idx', 'staffid', {unique: true});
	        }
        
        this.get = function(store_name,key){
            var deferred = $q.defer();
	            var tmp = {
	                        type:"get"
	                     };
	            var arch = {};
	            if(!key || key<=0){
	                deferred.resolve(tmp);
	            }else{
	                //--------读出明细
                    var tx = database.transaction(store_name, "readwrite");
                    var store =  tx.objectStore(store_name);
	                var req = store.get(key);
	                
	                req.onsuccess = function(event) {
	                     var _obj = event.target.result;
	                     tmp.result = _obj;
	                     deferred.resolve(tmp);
	                };
	                tx.oncomplete = function(event) {
	                    deferred.resolve(tmp);
	                };
	            }
            return deferred.promise;
        };
        this.find = function(store_name,keyOrIndex, keyIfIndex){
                var d = $q.defer();
                var tx = database.transaction(store_name, "readwrite");
                var store =  tx.objectStore(store_name);
                var req;

                if(keyIfIndex) {
                    req = store.index(keyOrIndex).get(keyIfIndex);
                } else {
                    req = store.get(keyOrIndex);
                }
                req.onsuccess = req.onerror = function(e) {
                        d.resolve(e.target.result);
                };
                return d.promise;
            };
        this.findAll = function(store_name){
            var deferred = $q.defer();
	            var tmp = {
	                    type:"find",
	                    result:""
	                 };
	            var list = [];
	            var tx = database.transaction(store_name, "readonly");
	            var store =  tx.objectStore(store_name);
	            var request = store.openCursor();
	            request.onsuccess = function(evt) {
	                var cursor = evt.target.result;
	                var detail = {};
	                if (cursor) {
	                    console.log(store_name+"-key:"+cursor.primaryKey);
	                    detail = cursor.value;
	                    detail.id  = cursor.primaryKey;
	                    list.push(detail);
	                    cursor.continue();
	                }else{
	                    tmp.result = list;
	                }
	            };
	            request.onerror = function(evt){
	                alert("error");
	                deferred.reject("error");
	            };
	            tx.oncomplete = function(event) {
				    deferred.resolve(tmp);
				};
            return deferred.promise;
        };
        this.add = function(store_name,_obj){
            var deferred = $q.defer();
	            var tx = database.transaction(store_name, "readwrite");
	            var store =  tx.objectStore(store_name);
	            var req;
	            var tmp = {
	                    type:"add",
	                    result:""
	                 };
	            try {
	                req = store.add(_obj);
	                req.onsuccess = function (evt) {
	                    console.log("add in DB successful");
	                    tmp.result = "保存成功";
	                };
	                req.onerror = function(e) {
	                    console.error("add error", this.error);
	                    tmp.result = this.error;
	                    deferred.reject(tmp);
	                };
	                tx.oncomplete = function(event) {
		                deferred.resolve(tmp);
		            };
	            } catch (e) {
	                deferred.reject(e);
	            }
            return deferred.promise;
        };
        this.initDB = function(){
            return initDB();
        }
    }]
    );
    
});