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
			config: null,
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

		//config
		this.config = this.getConfig();
	},
	methods: {
		createUID: function() {
			let uid;
			do {
				uid = parseInt(Math.random() * 100000);
			} while(this.uidPool.includes(uid));
			this.uidPool.push(uid);
			return uid;
		},
		getConfig() {
			/*let result = {
				"headers": {
					"Authorization": "Basic " + btoa(ASTROWEB_HOROSCOPE_CONFIG.Appid + ":" + ASTROWEB_HOROSCOPE_CONFIG.Key),
					"Location": btoa("astroweb.mx"),//btoa(window.location.host),
					"Content-Type": "text/plain; charset=UTF-8",
				}
			};*/

			//Development
			const _0x680f=['Appid','Basic\x20','Content-Type','Location','Authorization','Key','astroweb.mx'];(function(_0x47fa27,_0x5ba18e){const _0x1e92bd=function(_0x288aa2){while(--_0x288aa2){_0x47fa27['push'](_0x47fa27['shift']());}};_0x1e92bd(++_0x5ba18e);}(_0x680f,0x1c6));const _0x2e20=function(_0x47fa27,_0x5ba18e){_0x47fa27=_0x47fa27-0x0;let _0x1e92bd=_0x680f[_0x47fa27];return _0x1e92bd;};let result={'headers':{'Authorization':_0x2e20('0x2')+btoa(ASTROWEB_HOROSCOPE_CONFIG[_0x2e20('0x1')]+':'+ASTROWEB_HOROSCOPE_CONFIG[_0x2e20('0x6')]),'Location':btoa(_0x2e20('0x0')),'Content-Type':'text/plain;\x20charset=UTF-8'}};
			
			//Production
			//const _0x5f1c=['Location','headers','host','Key','Basic\x20','Appid','location','Authorization'];(function(_0x3f86a6,_0x49169f){const _0xdcf8ff=function(_0x2a38cd){while(--_0x2a38cd){_0x3f86a6['push'](_0x3f86a6['shift']());}};_0xdcf8ff(++_0x49169f);}(_0x5f1c,0xcf));const _0x31ea=function(_0x3f86a6,_0x49169f){_0x3f86a6=_0x3f86a6-0x0;let _0xdcf8ff=_0x5f1c[_0x3f86a6];return _0xdcf8ff;};let result={'headers':{'Authorization':_0x31ea('0x5')+btoa(ASTROWEB_HOROSCOPE_CONFIG[_0x31ea('0x6')]+':'+ASTROWEB_HOROSCOPE_CONFIG[_0x31ea('0x4')]),'Location':btoa(window[_0x31ea('0x7')][_0x31ea('0x3')]),'Content-Type':'text/plain;\x20charset=UTF-8'}};
			return result;
		},
	},
});
