angular.module('searchApp.controllers', ['ngRoute'])

.controller('MainCtrl', function(TranslationsService) {
	var app = this;

	TranslationsService.get()
	.then(function(data) {
		app.translations = data
	});

	app.frame = "pickup"
})

.controller('DateCtrl', function($scope){
	var pickup = new Date();

	pickup.setDate(pickup.getDate() + 6);

	$scope.date = {
		format: 'd MM, yy',
		pickup: pickup
	}

	$scope.$on("changed", function(event, date){
		console.log(date)
	})
})

.controller('LocaleCtrl', function ($route, $filter, LocationService, preloadData) {

	var app = this;

	app.countries = preloadData[0];

	app.cities = preloadData[1] || false;

	app.locations = preloadData[2] || false;

	var params = $route.current.params;

	app.preselectedCountry = params.country ? {
		id: params.country.split('+').join(' '),
		name: params.country.split('+').join(' ')
	} : false;

	app.preselectedCity = params.city ? {
		id: params.city.split('+').join(' '),
		name: params.city.split('+').join(' ')
	} : false;

	if (params.location) {
		var param = params.location.split('+').join(' ');
		var found = $filter('filter')(app.locations, {name: param}, true);
		if (found) {
			app.preselectedLocation = found;
			app.locationChanged(app.preselectedCountry, app.preselectedCity, app.preselectedLocation)
		} else {
			app.preselectedLocation = false;
		}
	} else {
		app.preselectedLocation = false;
	}

	app.countryChanged = function(selectedCountry) {
		app.clearFields("country");
		LocationService.getAjax({
			country: selectedCountry.id
		})
		.then(function(data) {
			app.cities = data;
			if(data.length == 1) {
				app.city.selected = data[0];
				app.cityChanged(selectedCountry, data[0]);
			}
		});
	};

	app.cityChanged = function(selectedCountry, selectedCity) {
		app.clearFields("city");
		LocationService.getAjax({
			country: selectedCountry.id,
			city: selectedCity.id
		})
		.then(function(data) {
			app.locations = data;
			if(data.length == 1) {
				app.location.selected = data[0];
				app.locationChanged(selectedCountry, selectedCity, data[0]);
			}
		});
	};

	app.locationChanged = function(selectedCountry, selectedCity, selectedLocation) {
		app.clearFields("location");
		app.dropCountries = [selectedCountry];
		app.dropCountry.selected = selectedCountry;
		LocationService.getAjax({
			country: selectedCountry.id,
			city: selectedCity.id,
			locationId: selectedLocation.id,
			dropCountry: selectedCountry.id
		})
		.then(function(data) {
			app.dropCities = data;
			if(data.length == 1) {
				app.dropCity.selected = data[0];
			} else {
				app.dropCity.selected = selectedCity;
			}
			app.dropCityChanged(selectedCountry, selectedCity, selectedLocation, selectedCity);
			app.dropLocation.selected = selectedLocation;
		});
	};

	app.dropCityChanged = function(selectedCountry, selectedCity, selectedLocation, selectedDropCity) {
		app.clearFields("dropCity");
		LocationService.getAjax({
			country: selectedCountry.id,
			city: selectedCity.id,
			locationId: selectedLocation.id,
			dropCountry: selectedCountry.id,
			dropCity: selectedDropCity.id
		})
		.then(function(data) {
			app.dropLocations = data;
			if(data.length == 1) {
				app.dropLocation.selected = data[0];
			}
		});
	};

	app.clearFields = function(field){
		switch(field) {
			case "country":
				app.city = { selected: false };
				app.cities = false;
			case "city":
				app.location = { selected: false };
				app.locations = false;
			case "location":
				app.dropCountry = { selected: false };
				app.dropCountries = false;
				app.dropCity = { selected: false };
				app.dropCities = false;
			case "dropCity":
				app.dropLocation = { selected: false };
				app.dropLocations = false;
		}
	}
})