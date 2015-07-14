
define(['services/XMLService','angular','angularMocks'],
function(){
    describe('Services:',function(){
        beforeEach(angular.mock.module('services'));
        describe('XMLService:',function(){
            var xmlService ;
            beforeEach(angular.mock.inject(function($injector){
                xmlService = $injector.get("XMLService");
	        }));
            it('toXml()',function(){
                var json = {user:"zhang"};
                var xml = "";
                var str = "";
                xml = xmlService.toXml(json,"root");
                str = xmlService.serializeXml(xml)
                console.log(str);
                expect(str.indexOf("</root>")).toBeGreaterThan(0);
            })
        })
    });
});