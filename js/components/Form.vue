<template>
	<div>
		<h2>Personal Horoscope</h2>
		<form class="text-left" @submit.prevent="getReport">
			<div class="form-group row align-items-end">
				<label for="firstname" class="col-sm-4">First name:</label>
				<input type="text" name="firstname" class="col-sm-8" v-model="firstname">
			</div>
			<div class="form-group row align-items-end">
				<label for="email" class="col-sm-4">Email:</label>
				<input type="email" name="email" class="col-sm-8" v-model="email">
			</div>
			<DateTimePicker name="birthdate" v-model="birthDatetime"></DateTimePicker>
			<div class="form-group row align-items-end">
				<label for="placename" class="col-sm-4">Birth place:</label>
				<input ref="autocomplete" type="text" name="placename" class="col-sm-8">
			</div>
			<div class="row justify-content-center">
				<input type="submit" class="btn btn-success form-control" value="Get Personal Daily Horoscope">
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
