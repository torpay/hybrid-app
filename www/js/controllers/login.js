angular.module('semPagar.controllers.login', ['semPagar.models.user'])

.controller('LoginCtrl', function ($scope, $stateParams, User, $state, $ionicHistory) {


	$scope.status = 'stopped';

	var loginForm = {
		username: '',
		password: '',
		submit: function () {

			$scope.status = 'loading'

			User.login({
				username: loginForm.username,
				password: loginForm.password
			})
			.then(function (res) {
				$ionicHistory.nextViewOptions({
					disableBack: true
				});

				// User isn’t authenticated
				$state.go("app.payments");
			}, function (err) {

				$scope.status = 'error';

				setTimeout(function () {

					$scope.status = 'stopped';

				}, 2000);

				console.log('errror logging in')
			});

		},
	};

	$scope.loginForm = loginForm;

});