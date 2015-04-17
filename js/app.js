var searchApp = angular.module('searchApp',
    ['ngRoute',
     'searchApp.services',
     'searchApp.directives',
     'searchApp.filters',
     'searchApp.controllers'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partials/locations.html',
		controller: 'LocaleCtrl',
		controllerAs: 'locale',
		resolve: {
			preloadData: function($q, LocationService){
				return $q.all([
					LocationService.getCountries()
				]);
			}
		}
	})
	.when('/:country', {
		templateUrl: 'partials/locations.html',
		controller: 'LocaleCtrl',
		controllerAs: 'locale',
		resolve: {
			preloadData: function($q, LocationService, $route){
				return $q.all([
					LocationService.getCountries(),
					LocationService.getAjax({
						country: $route.current.params.country
					})
				]);
			}
		}
	})
	.when('/:country/:city', {
		templateUrl: 'partials/locations.html',
		controller: 'LocaleCtrl',
		controllerAs: 'locale',
		resolve: {
			preloadData: function($q, LocationService, $route){
				return $q.all([
					LocationService.getCountries(),
					LocationService.getAjax({
						country: $route.current.params.country
					}),
					LocationService.getAjax({
						country: $route.current.params.country,
						city: $route.current.params.city
					})
				]);
			}
		}
	})
	.when('/:country/:city/:location', {
		templateUrl: 'partials/locations.html',
		controller: 'LocaleCtrl',
		controllerAs: 'locale',
		resolve: {
			preloadData: function($q, LocationService, $route){
				return $q.all([
					LocationService.getCountries(),
					LocationService.getAjax({
						country: $route.current.params.country}),
					LocationService.getAjax({
						country: $route.current.params.country,
						city: $route.current.params.city})
				]);
			}
		}
	})
	.otherwise({
		redirectTo: '/'
	});
});
