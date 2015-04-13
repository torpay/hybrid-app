angular.module('semPagar.controllers.registration', ['semPagar.models.user'])

.controller('RegistrationCtrl', function ($scope, User, $state, $ionicHistory) {


	var registrationForm = {
		phone: '',
		user_type: 'merchant',
		username: '',
		password: '',
		submit: function () {

			User.create({
				phone: registrationForm.phone,
				user_type: registrationForm.user_type,
				username: registrationForm.username,
				password: registrationForm.password
			})
			.then(function () {
				return User.login({
					username: registrationForm.username,
					password: registrationForm.password
				})
			})
			.then(function (res) {

				$ionicHistory.nextViewOptions({
					disableBack: true
				});

				// User isn’t authenticated
				$state.go("app.payments");
			})

		}
	};

	$scope.registrationForm = registrationForm;

});