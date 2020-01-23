<template>
	<div>
		<form class="text-left" @submit.prevent="getReport">
			<div class="form-group row align-items-end">
				<label for="firstname" class="col-sm-4">First name:</label>
				<input type="text" name="firstname" class="col-sm-8" v-model="firstname">
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
					//console.log(self.autocomplete.getPlace());
					let city = self.autocomplete.getPlace().formatted_address;
					console.log(city);
					self.birthPlace = city;
				});
			} else {
				let self = this;
				window.setTimeout(function(){self.bindGooglePlaces();}, 100);
			}
		},
		getReport: function() {

		},
	},
}
</script>

<style lang="scss" scoped>

</style>
