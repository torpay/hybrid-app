angular.module('semPagar.models.payment', ['semPagar.models.user'])

.service('Payment', function($http, $q, Config, _, log, User) {

	var endpoints = Config.endpoints;

	// local storage for transactions
	var transactions = [];



	function parseAndTransformTransaction(d) {
		d.updated_at = new Date(d.updated_at);
		d.total_value = d.total_value / 100;

		var descriptionJSON
		try {
			descriptionJSON = JSON.parse(d.description);
		} catch (e) {
			descriptionJSON =[];
		}

		d.items = _.map(descriptionJSON, function (product) {
			return product.name
		});

		d.description = d.items.join(', ');
	}


	/**
	 * Finds an invoice by id locally
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	function findTransactionById(id) {
		// try finding locally
		return _.find(transactions, function (i) {
			return i.id === id;
		});
	}

	function loadtransactions(query) {

		query = query || {};

		// if query is an object or undefined, it is passing multiple query values
		return $http.get(endpoints.transactions, {
			data: query,

			headers: {
				'X-Access-Token': User.getAccessToken()
			}
		})
		.then(function (res) {

			console.log(res)

			// parse all updated date
			// and convert values
			// and description
			var data = res.data.data;
			_.each(data, parseAndTransformTransaction);

			console.log(data)

			// set to transactions variable
			transactions = data;
			// resolve
		})

	}


	return {


		get: function (query) {

			// create a promise
			var defer = $q.defer()

			
			if (_.isString(query)) {
				// if query is a string, it looking for a single item
				
				var invoice = findTransactionById(query);

				if (invoice) {
					
					defer.resolve(invoice);

				} else {
					loadtransactions().then(function (res) {
						defer.resolve(findTransactionById(query));
					})
				}
				
			} else {

				loadtransactions(query).then(function () {


					console.log(transactions);
					defer.resolve(transactions);
				})

			}


			return defer.promise;
		},


		create: function (data) {

			console.log(data);

			var creationPromise = $http.post(endpoints.payments, data, {
				headers: {
					'X-Access-Token': User.getAccessToken()
				}
			});

			creationPromise.then(function (res) {

				// parse and transform the transaction data 
				// ob the object itself
				parseAndTransformTransaction(res.data.transaction);

				// add transaction to transactions list
				transactions.unshift(res.data.transaction);
			});

			return creationPromise;
		}

	};
});