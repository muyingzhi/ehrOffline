define(	['app', 'indexedDB', 'controller/aboutController', 'angular',
				'angularMocks', 'jquery'], function(ehr, db, about, angular,
				angularMocks, $) {
			describe('Unit Controllers:', function() {
				beforeEach(angular.mock.module('ehr'));
				describe('aboutController:', function() {
							var scope, AboutController;
							beforeEach(angular.mock.inject(function($rootScope,
											$controller) {
										jasmine.clock().install();
										scope = $rootScope.$new();
										AboutController = $controller(
												'aboutController', {
													$scope : scope
												});
									}));
							beforeEach(function(done) {
										scope.getDBInfo().then(function() {
													done();// ------异步结束时，要调用done()
												});

									});
							it('scope dbInfo.name:', function(done) {
										expect(scope.dbInfo.name).toEqual('ehr1');
										done();// --------这里表明测试结束
									})
						});
			});
		});