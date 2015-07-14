
define(['app','indexedDB','services/HmsPersonsService','angular','angularMocks','jquery'],
function(){
    describe('Services:',function(){
        beforeEach(angular.mock.module('ehr'));
        describe('HmsPersonsService\'s Test:',function(){
            var $service ;
            var uid,count;
            beforeEach(angular.mock.module('services'));
            beforeEach(inject(function($injector){
	            $service = $injector.get("HmsPersonsService");
	        }));
            describe('upsert()',function(){
                var uid=0;
                var person = {"username":"xxx","numberofcase":"010101"};
                beforeEach(function(done){
                    $service.upsert(person).then(function(result){
                        uid = result;
                        done();
                    },function(result){
                        uid = -1;
                        console.log(result);
                        done();
                    })
                })
                it('增加体检记录upsert()',function(done){
                       expect(uid).toEqual('010101');
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
                it(' 体检人次，count()',function(done){
                       expect(count).toBeGreaterThan(0);
                       done();
                })
            })
            describe('$service findByNumberOfCase()',function(){
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