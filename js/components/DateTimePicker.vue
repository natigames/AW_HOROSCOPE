<template>
	<div class="datetime-picker d-flex p-0 m-0 col-sm-12 row">
		<div class="form-group row mx-auto w-100 mb-0 align-items-end dob-dropdowns">
			<label :for="name" class="dob-label col-12 pl-0">{{ label_dob }}:</label>
			<input type="hidden" :name="name" v-model="ghostInputValue">
		</div>
		<div class="col-12 row mx-auto p-0 w-100 mb-4 justify-content-between tob-dropdowns">
			<label for="hour1" class="col-12 pl-0">{{ label_tob }}:</label>
			<select v-model="hour" name="hour1" class="hour form-control col-4 col-sm-3" required @change="$emit('input', val)" @invalid="$parent.invalidMsg($event)">
				<option v-for="currHour in hours" :value="currHour">{{ getFriendlyHour(currHour) }}</option>
			</select>
			<select v-model="minute" name="minute1" class="minute form-control col-4 col-sm-3" required  @change="$emit('input', val)" @invalid="$parent.invalidMsg($event)">
				<option v-for="min in minutes" :value="min">{{ !!min ? min : minLabel }}</option>
			</select>
			<select v-model="am_pm" class="am_pm form-control col-4 col-sm-3" @change="$emit('input', val)">
				<option value="am">AM</option>
				<option value="pm">PM</option>
			</select>
		</div>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			minutes: [],
			am_pm: 'am',
			year: '',
			month: '',
			day: '',
			hour: '',
			minute: '',
			ghostInputValue: '',
			ghostInputSelector: '',
			label_dob: ASTROWEB_HOROSCOPE_CONFIG.translate('label_dob'),
			label_tob: ASTROWEB_HOROSCOPE_CONFIG.translate('label_tob'),
			minLabel: ASTROWEB_HOROSCOPE_CONFIG.translate("label_date_minute"),
		};
	},
	props: {
		name: String,
	},
	mounted() {
		let currYear = (new Date()).getFullYear();

		this.ghostInputSelector = "#astroweb-horoscope_" + this.$parent.$parent.uid + " input[name='" + this.name + "']";

		//let daySuffixValues = ASTROWEB_HOROSCOPE_CONFIG.lang == "spa" ? ['ero','ndo', 'er', 'to'] : ['st', 'nd', 'rd', 'th'];

		$(this.ghostInputSelector).dropdownDatepicker({
			minYear: currYear - 120,
			maxYear: currYear,
			required: true,
			wrapperClass: "w-100 mx-auto ml-sm-0 mb-2 p-0 col-12 row justify-content-between",
			dropdownClass: "form-control dateDropdown col-4 col-sm-3",
			dayLabel: ASTROWEB_HOROSCOPE_CONFIG.translate('label_date_day'),
			monthLabel: ASTROWEB_HOROSCOPE_CONFIG.translate('label_date_month'),
			yearLabel: ASTROWEB_HOROSCOPE_CONFIG.translate('label_date_year'),
			monthLongValues: ASTROWEB_HOROSCOPE_CONFIG.translate('labels_date_months'),
			//daySuffixValues: daySuffixValues,
			daySuffixes: false,
			onYearChange: function(d, m, y) {
				this.day = d;
				this.month = m;
				this.year = y;
			}.bind(this),
			onMonthChange: function(d, m) {
				this.day = d;
				this.month = m;
			}.bind(this),
			onDayChange: function(d) {
				this.day = d;
			}.bind(this),
		});

		//set new dropdown attributes
		this.updateDateDropdownsDisabledAttrs();

		//set validation events on date dropdowns
		this.dateDropdownsValidationEvents();

		//populate minutes
		this.minutes.push('');
		for(let i = 0; i < 60; i++) {
			let min = '' + i;
			min = min.length == 2 ? min : '0' + min;
			this.minutes.push(min);
		}

		//Must bind event using jquery, since sometimes it's dynamically set using jquery and doesn't play nice
		//with vue event handlers.
		$(this.ghostInputSelector).on("change", function(evt, param){
			param = param ? param : "manual";
			if(param == "auto" || (this.year && this.month && this.day)) {
				this.updateval(evt.target.value, param);
			}
		}.bind(this));

		/*if(this.name == "birthdate" && this.$parent.$parent.$parent.params.default_user_data.birthdate) {
			let v = this.$parent.$parent.$parent.params.default_user_data.birthdate;
			$(this.ghostInputSelector).val(v).trigger("change", ["auto"]);
		} else if(this.name == "p2_birthdate" && this.$parent.$parent.$parent.params.default_user_data.p2_birthdate) {
			let v = this.$parent.$parent.$parent.params.default_user_data.p2_birthdate;
			$(this.ghostInputSelector).val(v).trigger("change", ["auto"]);
		}*/
		

	},
	computed: {
		val: function() {
			return this.year + '/' + this.month + '/' + this.day + ' ' + this.hour + ':' + this.minute;
		},
		hours: function() {
			let result = [''];
			let convertedHr = '';
			if(this.am_pm == 'am') {
				for(let i = 0; i < 12; i++) {
					let hr = '' + i;
					hr = hr.length == 2 ? hr : '0' + hr;
					result.push(hr);
				}
			} else {
				for(let i = 12; i < 24; i++) {
					let hr = '' + i;
					hr = hr.length == 2 ? hr : '0' + hr;
					result.push(hr);
				}
			}

			return result;
		}
	},
	watch: {
		am_pm: function(newVal, oldVal) {
			if(oldVal == 'am' && newVal == 'pm' && Number(this.hour) < 12){
				this.hour = (Number(this.hour) + 12) + '';
			} else if(oldVal == 'pm' && newVal == 'am') {
				let h = (Number(this.hour) % 12) + '';
				this.hour = h.length == 1 ? "0" + h : h;
			}
			this.$emit('input', this.val);
		}
	},
	methods: {
		//sets component properties and dropdowns when hidden input is changed
		updateval(newVal, eventSource) {
			this.ghostInputValue = newVal;

			//parse string and set properties of this component
			if(newVal) {
				newVal = newVal.replace(/-/g, '/');
				newVal = newVal.indexOf(':') == -1 ? newVal + " " + this.hour + ":" + this.minute : newVal;
				let arr = newVal.split(' ');
				let dateArr = arr[0].split('/');
				let timeArr = arr[1].split(':');

				this.year = dateArr[0];
				this.month = dateArr[1];
				this.day = dateArr[2];
				this.am_pm = Number(timeArr[0]) < 12 ? 'am' : 'pm';
				this.hour = timeArr[0];
				this.minute = timeArr[1];
			} else {
				this.year = this.month = this.day = '';
				this.am_pm = 'am';
				this.hour = this.minute = '00';
			}
			
			//Set date dropdowns since they're not able to use v-model
			if(eventSource == "auto") {
				$(this.ghostInputSelector).parent().find("select.year").val(this.year);			
				$(this.ghostInputSelector).parent().find("select.month").val(this.month);	
				$(this.ghostInputSelector).parent().find("select.day").val(this.day);					
				this.updateDateDropdownsDisabledAttrs();
			}
			
			this.$emit('input', this.val);
		},
		updateDateDropdownsDisabledAttrs() {
			let status = $(this.ghostInputSelector).attr('disabled');
			$(this.ghostInputSelector).parent().parent().find("select").attr('disabled', !!status);
		},
		dateDropdownsValidationEvents() {
			let dropdowns = $(this.ghostInputSelector).parent().find("select");
			$(dropdowns).on({
				invalid: function(e) {
					this.$parent.invalidMsg(e);
				}.bind(this),
			});
		},
		getFriendlyHour(hour) {
			if(!hour) {
				return ASTROWEB_HOROSCOPE_CONFIG.translate("label_date_hour");
			}
			hour = Number(hour);
			hour = hour % 12;
			hour = hour == 0 ? 12 : hour;
			return hour;
		},
	},
}
</script>

<style lang="scss">
	/*.dateDropdown {
		width: unset !important;
	}*/

	select[disabled='disabled'] {
		background-color: grey !important;
		cursor: not-allowed;
	}

	.row::before, .row::after {
		display: inline-block;
	}
</style>
