describe('E2E :Name',function(){
    describe('E2E : Routes',function(){
        it('should load the index page',function(){
            jasmine.browser().navigateTo('/#/');
            expect(jasmine.browser().location().path()).toBe('/');
        })
    })
})