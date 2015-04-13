angular.module('semPagar.models.user', [])

.service('User', function ($http, Config, $q) {

	var userId = undefined;

	// userToken
	var userToken = window.localStorage.getItem('userToken');

	// start is logged to false
	var isLogged = userToken ? true : false;

	return {
		isLogged: function () {
			return isLogged;
		},

		login: function (params) {


			if (isLogged) {
				// already logged
				var defer = $q.defer();
				defer.resolve();
				return defer.promise;
			} else {

				var loginPromise = $http.post(Config.endpoints.users + '/login', params);

				// data level handlers
				loginPromise.then(function (res) {
					isLogged = true;

					console.log(res);

					userId = res.data.user.id;

					userToken = res.data.token;


					window.localStorage.setItem('userToken', userToken);
					window.localStorage.setItem('userId', userId);

				}, function () {
					isLogged = false;
				});

				// return the login promise
				return loginPromise;

			}
		},

		logout: function () {
			var logoutPromise = $http.delete(Config.endpoints.users + '/logout', {
				headers: {
					'X-Access-Token': userToken
				}
			});

			// data level handlers
			logoutPromise.then(function () {
				// success
				isLogged = false;
				userId = undefined;

				window.localStorage.setItem('userToken', false);
				window.localStorage.setItem('userId', false);

			}, function () {
				// fail
			})

			return logoutPromise;
		},

		create: function (userData) {
			var creationPromise = $http.post(Config.endpoints.users, userData);

			return creationPromise;

		},

		getAccessToken: function () {
			return userToken;
		},
		registerDevice: function (token) {
			var json = {
				token: token,
				platform: 'android',
				user_id: userId
			};
			$http
			.post('http://sempagar.herokuapp.com/devices', JSON.stringify(json), {
				headers: {
					'X-Access-Token': userToken,
				}
			})
		}
	}

});