// Declare app level module which depends on filters, and services
angular.module('app', ['ngSanitize', 'ngResource', 'ui.router', 'oc.modal'])
	.constant('VERSION', '0.7.0')
	.config(function appConfig($stateProvider, $locationProvider, $urlRouterProvider) {
		$locationProvider.hashPrefix('!');
		$urlRouterProvider.otherwise("/");

		$stateProvider.state('home', {
			url: "/", // root route
			views: {
				"mainView": {
					templateUrl: "partials/home.html",
					controller: 'HomeCtrl',
					controllerAs: 'home'
				}
			}
		}).state('view', {
			url: "/view",
			views: {
				"mainView": {
					templateUrl: "partials/view.html",
					controller: 'ViewCtrl',
					controllerAs: 'view'
				}
			}
		});

		// /!\ Without server side support html5 must be disabled.
		return $locationProvider.html5Mode(true);
	});
