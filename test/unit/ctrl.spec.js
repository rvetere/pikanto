'use strict';
describe("controllers", function() {
	beforeEach(module("app"));
	describe("HomeCtrl", function() {
		return it("should make scope testable", inject(function($rootScope, $controller) {
			var view = $controller("HomeCtrl");
			return expect(view.content).toEqual("This is the partial for home.");
		}));
	});
});
