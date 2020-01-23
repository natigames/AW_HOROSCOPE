import Vue from 'vue';
window.axios = require('axios/dist/axios.min.js');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
import 'jquery-dropdown-datepicker';

import AstrowebHoroscope from './components/HoroscopeWidgetContainer.vue';

import '../scoped_bootstrap.scss';

new Vue({
	el: '#astroweb-horoscope',
	data: function() {
		return {
			uidPool: [],
		};
	},
	components: {
		AstrowebHoroscope,
	},
	created() {
		//load google places api
		let placesSrc = 'https://maps.googleapis.com/maps/api/js?key=' + ASTROWEB_HOROSCOPE_CONFIG.GoogleMapsKey + '&libraries=places';
		let placesTag = "<script type='text/javascript' src=" + placesSrc + "><\/script>"; 
		$("head").append(placesTag);
	},
	methods: {
		createUID: function() {
			let uid;
			do {
				uid = parseInt(Math.random() * 100000);
			} while(this.uidPool.includes(uid));
			this.uidPool.push(uid);
			return uid;
		}
	},
});
