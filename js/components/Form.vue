<template>
	<div>
		<h2 class="form-header">{{ form_title }}</h2>
		<form class="text-left" @submit.prevent="getReport">
			<div class="form-group row align-items-end">
				<label for="firstname" class="col-sm-4">{{ label_first_name }}:</label>
				<input type="text" name="firstname" class="col-sm-8" v-model="firstname" :placeholder="placeholder_input_first_name">
			</div>
			<div class="form-group row align-items-end">
				<label for="email" class="col-sm-4">{{ label_email }}:</label>
				<input type="email" name="email" class="col-sm-8" v-model="email" :placeholder="placeholder_input_email">
			</div>
			<DateTimePicker name="birthdate" v-model="birthDatetime"></DateTimePicker>
			<div class="form-group row align-items-end">
				<label for="placename" class="col-sm-4">{{ label_birthplace }}:</label>
				<input ref="autocomplete" type="text" name="placename" class="col-sm-8" :placeholder="placeholder_input_birthplace">
			</div>
			<div class="row justify-content-center">
				<input type="submit" class="btn btn-success form-control" :value="button_submit_form">
			</div>
		</form>
	</div>
</template>

<script>
import DateTimePicker from './DateTimePicker.vue';

export default {
	data: function() {
		return {
			autocomplete: null,
			firstname: "",
			email: "",
			birthDatetime: "",
			birthPlace: "",

			form_title:  ASTROWEB_HOROSCOPE_CONFIG.translate('form_title'), 
			label_first_name: ASTROWEB_HOROSCOPE_CONFIG.translate('label_first_name'),
			placeholder_input_first_name: ASTROWEB_HOROSCOPE_CONFIG.translate('placeholder_input_first_name'),
			label_email: ASTROWEB_HOROSCOPE_CONFIG.translate('label_email'),
			placeholder_input_email: ASTROWEB_HOROSCOPE_CONFIG.translate('placeholder_input_email'),
			label_birthplace: ASTROWEB_HOROSCOPE_CONFIG.translate('label_birthplace'),
			placeholder_input_birthplace: ASTROWEB_HOROSCOPE_CONFIG.translate('placeholder_input_birthplace'),
			button_submit_form: ASTROWEB_HOROSCOPE_CONFIG.translate('button_submit_form'),
		};
	},
	components: {
		DateTimePicker,
	},
	mounted() {
		this.bindGooglePlaces();
	},
	methods: {
		bindGooglePlaces: function() {
			if(typeof(google) != "undefined") {
				//let placeField = $("#astroweb-horoscope_" + this.$parent.uid + " input[name='placename']")[0];
				let placeField = this.$refs.autocomplete;
				this.autocomplete = new google.maps.places.Autocomplete(placeField, {
					types: ['(cities)'],
				});
				let self = this;
				this.autocomplete.addListener('place_changed', () => {
					self.birthPlace = self.autocomplete.getPlace().formatted_address;
				});
			} else {
				let self = this;
				window.setTimeout(() => {self.bindGooglePlaces();}, 100);
			}
		},
		getReport: function() {
			//create and store user as a cookie
			let user = JSON.stringify({
				firstname: this.firstname,
				email: this.email,
				birthdate: this.birthDatetime,
				placename: this.birthPlace,
			});

			let d = new Date();
			d.setTime(d.getTime() + (180 * 24 * 60 * 60 * 1000));
			let expires = "expires=" + d.toUTCString();

			document.cookie = "astroweb-horoscope-user=" + user + ";" + expires + ";";

			//set user on parent component
			this.$parent.user = JSON.parse(user);

			//change to Report view
			this.$parent.changePage("Report");
		},
	},
}
</script>

<style lang="scss" scoped>

</style>
