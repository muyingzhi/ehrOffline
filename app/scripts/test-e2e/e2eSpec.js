/** A Sample Angular E2E test */
console.log("e2e....");
describe('Login_on.html', function() {
	// it('it one',function(){
	// 	expect(1).toEqual(1);
	// })
  it('"admin/123" to do login:', function() {
    browser().navigateTo('/log_on.html');
    input('username').enter('admin');
    input('j_password').enter('1231');
    element("#btnLogin").click();
    console.log(browser().location().url());
    expect(browser().location().path()).toBe('/');
  });

  it('should load then index page:',function(){
    browser().navigateTo('/#/');
    expect(browser().location().path()).toBe('/');
  })
  xit('should skip this e2e test', function() {
    sleep(15);
    browser().navigateTo('/log_on.html');
  });
});
