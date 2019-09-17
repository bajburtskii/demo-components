(function() {
	'use strict';

	angular
		.module('app.helper', [])

		.factory('MessageHelper', messageHelper)
	;

	messageHelper.$inject = ['$filter'];
	function messageHelper($filter) {
		var MessageHelper = {
			prepareDataWithShowDateLabels: prepareDataWithShowDateLabels,
			getConversationPerson : getConversationPerson,
			getPersonFromUserObject : getPersonFromUserObject,
			getApiUrl : getApiUrl
		};

		return MessageHelper;

		/**
		 * Function for settings ShowDate labels
		 */
		function prepareDataWithShowDateLabels(data) {
			var currentDate = null;

			_.map(data, function(item) {
				var parsedDate = $filter('messageDayMonth')(item.updated_at);

				item.showDate = false;
				if((currentDate === null || currentDate != parsedDate) //check if this day of date already printed
				//&& parsedDate != $filter('messageDayMonth')(new Date)
				) { //check if it is not today
					item.showDate = true;

					//set as today first message
					if(parsedDate == $filter('messageDayMonth')(new Date)) {
						item.isToday = true;
					}

					//set as yesterday first message
					if(parsedDate ==
						$filter('messageDayMonth')(new Date(new Date().setDate(new Date().getDate()-1)))) {
						item.isYesterday = true;
					}

					currentDate = $filter('messageDayMonth')(item.updated_at);
				}
			});

			return data;
		}

		/**
		 * Helper method to build list of conversations
		 * Return a person who are you talking with.
		 *
		 */
		function getConversationPerson(participants, currentUser) {

			var filtered =  _.reject(participants, function(item) {
				return item.user_id == currentUser.id
			});

			// console.log(participants);
			// console.log(filtered[0]);
			// console.log('-----');


			return getPersonFromUserObject(filtered[0]);
		}

		/**
		 * If user was added to your contacts then its original info is replaced with your contact info
		 *
		 * @param userObj
		 * @returns {{name: *, avaToken: (*|string), avaUrl: *}}
		 */
		function getPersonFromUserObject(userObj) {
			if(!userObj) return undefined;

			//if nothing was found then send origin user info
			return {
				name : userObj.user.full_name,
				avaToken : userObj.user.avaToken,
				id : userObj.user.id,
				avaUrl : $filter('getAvaUrl')(userObj.user.avaToken, 1, 'tiny')
			};
		}

		/**
		 * @param league_id
		 * @returns {string}
         */
		function getApiUrl(league_id) {
			return '/api/messages';
		}
	}

})();
