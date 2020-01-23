<template>
	<div :id="'astroweb-horoscope_' + uid" class="astroweb-horoscope-container">
		<h3 class="mb-4">Personal Horoscope</h3>
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
			user: "",
			currentPage: null,
		};
	},
	mounted() {
		this.uid = this.$parent.createUID();
		this.init();
	},
	methods: {
		init: function() {
			this.user = this.getUserCookie();
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
	background-color: #999;
	padding: 1em 3em;
}
</style>
	
