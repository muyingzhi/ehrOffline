
define(['angular','angularMocks','jquery'],
function(){
    describe('Services:',function(){
        beforeEach(angular.mock.module('ehr'));
        describe('$indexedDB:',function(){
            var $indexedDB,dbInfo={} ;
            beforeEach(angular.mock.inject(function($injector){
	            $indexedDB = $injector.get("$indexedDB");
	        }));
            describe('$indexedDB DBInfo():',function(){
	            beforeEach(function(done){
	                $indexedDB.dbInfo().then(function(result){
	                    dbInfo = result;
	                    done();
	                });
	            });
	            it('dbInfo()',function(done){
	                expect(dbInfo.name).toEqual('ehr');//------
	                done();
	            });
            });
            describe('$indexedDB objectStore.upsert()',function(){
                var uid;
                beforeEach(function(done){
                    var store = $indexedDB.objectStore('HYS_USER');
                    var user = {fullname:'xxx',platuserid:2};
                    store.upsert(user).then(function(result){
                        uid = result;
                        done();
                    });
                });
            
                it('store by HYS_USER',function(done){
                       expect(uid).toBeGreaterThan(0);
                       done();
                })
            });
            describe('$indexedDB objectStore.count()',function(){
                var count;
                beforeEach(function(done){
	                var store = $indexedDB.objectStore('HYS_USER');
                    store.count().then(function(result){
	                    count = result;
	                    done();
	                });
	            });
            
	            it('store by 用户数量HYS_USER.count',function(done){
	                   expect(count).toBeGreaterThan(0);
                       done();
	            })
            });
        })
    });
});