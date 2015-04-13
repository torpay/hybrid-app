// Ionic semPagar App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'semPagar' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'semPagar.controllers' is found in controllers.js
angular.module('semPagar', 
	[
		'ionic', 
		'semPagar.controllers.payments',
		'semPagar.controllers.payment',
		'semPagar.controllers.registration',
		'semPagar.controllers.sideMenu',
		'semPagar.controllers.login',
		'semPagar.controllers.charge',

		'ngCordova',

		// models
		'semPagar.models.user',

		// libs
		'ui.utils.masks',
	]
)

.run(function($ionicPlatform, $rootScope, $state, User, $cordovaPush) {
	
	// alert('start')
	// var iosConfig = {
	// 	'badge': true,
	// 	'sound': true,
	// 	'alert': true
	// };

	// var androidConfig = {
	// 	"senderID": "477677209906"
	// };

	// document.addEventListener("deviceready", function() {
	//     $cordovaPush.register(androidConfig)
	//     .then(function(result) {
	//     	// Success -- send deviceToken to server, and store for future use
	//     	console.log("result: " + result)
	//     	User.registerDevice(result.deviceToken);
	//     	 $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
	//     	 	if (notification.alert) {
	//         		navigator.notification.alert(notification.alert);
	//       		}
	//     	 });
	//     }, false);
	// });

	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});


	// authentication
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
		if (toState.authenticate && !User.isLogged()) {


			console.log('url ' + toState.url + ' requires authentication!')

			// User isn’t authenticated
			$state.go("app.login");
			event.preventDefault(); 
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/structure.html",
		controller: 'AppCtrl',
		authenticate: true
	})
	
	.state('app.login', {
		url: "/login",
		views: {
			menuContent: {
				templateUrl: "templates/login.html",
				controller: 'LoginCtrl',
			}
		},
		authenticate: false,
	})

	.state('app.registration', {
		url: "/registration",
		views: {
			menuContent: {
				templateUrl: "templates/registration.html",
				controller: 'RegistrationCtrl'
			}
		},
		authenticate: false
	})

	.state('app.charge', {
		url: "/charge",
		views: {
			menuContent: {
				templateUrl: "templates/charge.html",
				controller: "ChargeCtrl"
			}
		}
	})

	.state('app.payments', {
		url: "/payments",
		views: {
			menuContent: {
				templateUrl: "templates/payments.html",
				controller: 'PaymentsCtrl'
			}
		},
		authenticate: true
	})
	.state('app.payment', {
		url: "/payments/:paymentId",
		views: {
			menuContent: {
				templateUrl: "templates/payments.html",
				controller: 'PaymentsCtrl'
			}
		},
    	authenticate: true
	})
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/payments');
})

.controller('AppCtrl', function($scope, $rootScope, User) {

	// set the user to the $rootScope
	$rootScope.user = User;

})


// urls
.service('Config', function(){
	
	var configurations = {};

	configurations.endpoints = {
		users: 'http://sempagar.herokuapp.com/users',
		transactions: 'http://sempagar.herokuapp.com/transactions',
		payments: 'http://sempagar.herokuapp.com/payments',
	}

	return configurations;
})



// Libs
.service('_', function ($window) {
	return $window._;
})




// DEBUGGING
.service('log', function(){
	

	return function log(tag, message) {
		console.log(tag + ':' + message);
	}

})