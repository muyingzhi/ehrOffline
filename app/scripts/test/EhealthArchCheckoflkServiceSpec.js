
define(['app','indexedDB','services/EhealthArchCheckoflkService','angular','angularMocks','jquery'],
function(){
    describe('Services:',function(){
        beforeEach(angular.mock.module('ehr'));
        describe('EhealthArchCheckoflkService\'s Test:',function(){
            var $service ;
            var uid,count;
            beforeEach(angular.mock.module('services'));
            beforeEach(inject(function($injector){
	            $service = $injector.get("EhealthArchCheckoflkService");
	        }));
            describe('upsert()',function(){
                var uid;
                var check = {"numberofcase":"010101"};
                beforeEach(function(done){
                    $service.upsert(check).then(function(result){
                        uid = result;
                        done();
                    })
                })
                it('增加体检详细upsert()',function(done){
                       expect(uid).toBeGreaterThan(0);
                       done();
                });
            })
            describe('count()',function(){
                var count;
                beforeEach(function(done){
                    $service.count().then(function(result){
                        count = result;
                        done();
                    })
                })
                it(' 体检详细记录数 count()',function(done){
                       expect(count).toBeGreaterThan(0);
                       done();
                })
            })
            describe('病历号查找 findByNumberOfCase()',function(){
                var list=[];
                beforeEach(function(done){
                    $service.findByNumberOfCase('010101').then(function(result){
                        list = result;
                        done();
                    });
                });
            
                it(' 检索病历号010101:',function(done){
                       expect(list.length).toBeGreaterThan(0);
                       done();
                })
            });
        })
    });
});