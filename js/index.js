import Vue from 'vue';
window.axios = require('axios/dist/axios.min.js');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
import 'jquery-dropdown-datepicker';

import AstrowebHoroscope from './components/HoroscopeWidgetContainer.vue';

import '../scoped_bootstrap.scss';

$(document).ready(function(){
	//Bad practice: https://stackoverflow.com/questions/42746964/vue-js-detach-styles-from-template
	/*if(ASTROWEB_HOROSCOPE_CONFIG.autoWrapper) {
		$("body").wrapInner("<div id='astroweb-horoscope'></div>");
	}*/

	let cssOverride = `
		<style>
		/* Reset css so external css doesn't affect the widget */
		.astro-component, .astro-component *,.astro-component a:hover,.astro-component a:visited,.astro-component a:active{
			background:none;
			border:none;
			bottom:auto;
			clear:none;
			/* cursor:default; */
			/* didn't really know what the default for display should be*/
			/*display:inline;*/
			float:none;
			font-family:Arial, Helvetica, sans-serif;
			font-size:medium;
			font-style:normal;
			font-weight:normal;
			height:auto;
			left:auto;
			letter-spacing:normal;
			/*line-height:normal;*/
			max-height:none;
			max-width:none;
			min-height:0;
			min-width:0;
			overflow:visible;
			position:static;
			right:auto;
			text-align:left;
			text-decoration:none;
			text-indent:0;
			text-transform:none;
			top:auto;
			visibility:visible;
			white-space:normal;
			width:auto;
			z-index:auto;
		}
		/* override default green bootstrap box shadow on focus */
		.astro-component button.btn.btn-lg.btn-success:focus {
			box-shadow:none;
		}
		</style>
	`;

	$("head").append(cssOverride);

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
			//Only add google places tag if not already loaded
			if(document.querySelectorAll("script[src*='maps.googleapis.com/maps/api/js']").length == 0 && document.querySelectorAll("script[src*='libraries=places']") == 0) {
				//load google places api
				let placesSrc = 'https://maps.googleapis.com/maps/api/js?key=' + ASTROWEB_HOROSCOPE_CONFIG.GoogleMapsKey + '&libraries=places';
				let placesTag = "<script type='text/javascript' src=" + placesSrc + "><\/script>"; 
				$("head").append(placesTag);
			}

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
				const _0x5f1c=['Location','headers','host','Key','Basic\x20','Appid','location','Authorization'];(function(_0x3f86a6,_0x49169f){const _0xdcf8ff=function(_0x2a38cd){while(--_0x2a38cd){_0x3f86a6['push'](_0x3f86a6['shift']());}};_0xdcf8ff(++_0x49169f);}(_0x5f1c,0xcf));const _0x31ea=function(_0x3f86a6,_0x49169f){_0x3f86a6=_0x3f86a6-0x0;let _0xdcf8ff=_0x5f1c[_0x3f86a6];return _0xdcf8ff;};let result={'headers':{'Authorization':_0x31ea('0x5')+btoa(ASTROWEB_HOROSCOPE_CONFIG[_0x31ea('0x6')]+':'+ASTROWEB_HOROSCOPE_CONFIG[_0x31ea('0x4')]),'Location':btoa(window[_0x31ea('0x7')][_0x31ea('0x3')]),'Content-Type':'text/plain;\x20charset=UTF-8'}};
				return result;
			},
		},
	});
});
