angular.module('semPagar.controllers.sideMenu', ['semPagar.models.user'])

.controller('SideMenuCtrl', function ($scope, User, $state, $ionicHistory, $ionicSideMenuDelegate) {


	$scope.isLogged = function () {
		return User.isLogged();
	};

	$scope.logout = function () {
		User.logout()
			.then(function () {

				$ionicHistory.nextViewOptions({
					disableBack: true
				});

				$state.go('app.login')
					.then(function () {
						// close side menu
						$ionicSideMenuDelegate.toggleLeft(false);
					})
			});
	}
});