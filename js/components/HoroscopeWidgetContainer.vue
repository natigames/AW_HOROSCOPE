<template>
	<div v-if="!loading" :id="'astroweb-horoscope_' + uid" class="astroweb-horoscope-container">
		<component :is="currentPage" v-on:change-page="changePage" v-bind="props" ref="currentPage"></component>
	</div>
</template>

<script>
import Form from './Form.vue';
import Report from './Report.vue';

export default {
	data: function() {
		return {
			uid: 0,
			user: null,
			currentPage: null,
			loading: true,
		};
	},
	props: {
		colorscheme: String,
		stylesheet: String,
	},
	mounted() {
		this.uid = this.$parent.createUID();

		//load color scheme
		if(this.colorscheme) {
			$.get(this.colorscheme, function(data, status){
				$("head").append(this.scopeCSS(data));
				if(!this.stylesheet) {
					this.loading = false;
				} else {
					//nested so they load in the correct order since these are async calls
					$.get(this.stylesheet, function(data, status){
						$("head").append(this.scopeCSS(data));
						this.loading = false;
					}.bind(this));
				}
			}.bind(this));

		}
		//load custom stylesheet
		if(this.stylesheet && !this.colorscheme) {
			$.get(this.stylesheet, function(data, status){
				$("head").append(this.scopeCSS(data));
				this.loading = false;
			}.bind(this));
		}

		if(!this.stylesheet && !this.colorscheme) {
			this.loading = false;
		}
		
		this.init();
	},
	methods: {
		scopeCSS(data) {
			let componentSelector = "#astroweb-horoscope_" + this.uid;

			data = data.replace(":root", "");

			data = data.replace(/^.*[{|,]$/gm, componentSelector + ' $&');

			//adjust top level element relationship
			data = data.replace(componentSelector + " .astroweb-horoscope-container", componentSelector + ".astroweb-horoscope-container");
				
			return "<style>" + data + "</style>";
		},
		init: function() {
			if(this.getUserCookie()) {
				this.user = JSON.parse(this.getUserCookie());
			}

			if(this.user) {
				this.changePage("Report");
			} else {
				this.changePage("Form");
			}
		},
		changePage: function(page) {
			switch(page) {
				case 'Form':
					this.currentPage = Form;
					break;
				case 'Report':
					this.currentPage = Report;
					break;
			}
		},
		getUserCookie: function() {
			let cookieName = "astroweb-horoscope-user=";
			let ca = document.cookie.split(';');
			for(let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while(c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if(c.indexOf(cookieName) == 0) {
					return c.substring(cookieName.length, c.length);
				}
			}
			return "";
		},
	},
	computed: {
		props: function() {
			return {};
		}
	},
}
</script>

<style lang="scss" scoped>
.astroweb-horoscope-container {
	color: #444;
	background-color: #999;
	padding: 1em 3em;
}
</style>
	
