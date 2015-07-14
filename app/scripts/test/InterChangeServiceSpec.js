
define(['services/InterChangeService','angular','angularMocks'],
function(){
    describe('Services:',function(){
        beforeEach(angular.mock.module('services'));
        describe('InterChangeService:',function(){
            var service;
            var q,resolvedValue;
            beforeEach(angular.mock.inject(function($injector){
                service = $injector.get("InterChangeService");
                q = $injector.get('$q');
	        }));
            describe('serv21011001',function(){
                var result = {state:1};
                var originalTimeout;
                beforeEach(function(done){
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
                    service.serv21011001("Kb099","hys123456").then(function(obj){
                        result = obj;
                        done();//---异步结束
                    });
                })
                it('用户"Kb099/hys123456"登录：',function(done){
                    expect(result.state==0).toBe(true);
                    done();
	            });
                afterEach(function() {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                });
            })
            describe('serv12140001',function(){
                var result= {state:1};
                var originalTimeout;
                beforeEach(function(done){
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
	                service.serv12140001().then(function(obj){
	                    result = obj;
                        done();
	                });
                });
                it('下载机构数据TGOV：',function(done){
                    expect(result.state==0).toBe(true);
                    done();
                });
                afterEach(function() {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                });
            });
        })
    });
});