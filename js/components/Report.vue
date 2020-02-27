<template>
	<div>
		<div class="astroweb-report-header">
			<div class="row">
				<div class="astroweb-report-date col-8 text-left">{{ dateend }}</div>
				<div class="astroweb-report-type col-4 text-right">
					<select v-model="rpt_type">
						<option value="general">{{ general_option }}</option>
						<option value="love" v-if="!footer">{{ love_option }}</option>
						<option value="money" v-if="!footer">{{ money_option }}</option>
						<option value="karma" v-if="!footer">{{ karma_option }}</option>
					</select>
				</div>
			</div>
			<h3>{{ aspect }}</h3>
		</div>
		<div class="astroweb-report-scrollbox mb-4 p-2">
			<div v-if="loading" class="h-100 d-flex justify-content-center align-items-center">
				<div class="spinner-border"></div>
			</div>
			<template v-else>
				<div v-for="section in report">
					{{ section }}
				</div>
			</template>
		</div>
		<div class="astroweb-report-footer">
			<div>{{ calc_for }} {{ firstname }} <button @click="$parent.changePage('Form')">{{ not_you }}</button></div>
			<div v-if="footer" class="row mt-4">
				<div class="col-6 astroweb-branding">
					<div>
						<h6>{{ powered_by }}:</h6>
						<img src="https://astroweb.mx/wp-content/uploads/2019/12/Logo2.png">
					</div>
				</div>
				<div class="col-6 align-self-center text-left astroweb-link">
					<small>{{ visit_astroweb_1 }} <a href="https://astroweb.mx" target="_blank">astroweb.mx</a> {{ visit_astroweb_2 }}</small>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	//Endpoint: https://astroweb.mx/rest/aw/horoscope/{token}/{profileid}
	export default {
		data: function() {
			return {
				loading: true,
				rpt_type: "",

				love_option: ASTROWEB_HOROSCOPE_CONFIG.translate('love_option'),
				karma_option: ASTROWEB_HOROSCOPE_CONFIG.translate('karma_option'),
				money_option: ASTROWEB_HOROSCOPE_CONFIG.translate('money_option'),
				general_option: ASTROWEB_HOROSCOPE_CONFIG.translate('general_option'),

				firstname: "",
				footer: false,
				allData: null,
				
				calc_for: "",
				not_you: ASTROWEB_HOROSCOPE_CONFIG.translate('not_you'),
				powered_by: ASTROWEB_HOROSCOPE_CONFIG.translate('powered_by'),
				visit_astroweb_1: ASTROWEB_HOROSCOPE_CONFIG.translate('visit_astroweb_1'),
				visit_astroweb_2: ASTROWEB_HOROSCOPE_CONFIG.translate('visit_astroweb_2'),
			};
		},
		mounted() {
			// Get report type from cookie if available
			this.rpt_type = this.$parent.user.rpt_type ? this.$parent.user.rpt_type : "general";

			// Get report
			axios.post("https://astroweb.mx/rest/aw/profiles/" + ASTROWEB_HOROSCOPE_CONFIG.token, this.$parent.user, this.$parent.$parent.config)
				.then((response) => {
					if(response.data.errordata) {
						console.log(response);
						console.error(response.data.errordata);
						return;
					}
					let profileid = response.data.data.profile.profileid;

					axios.get("https://astroweb.mx/rest/aw/horoscope/" + ASTROWEB_HOROSCOPE_CONFIG.token + "/" + profileid, this.$parent.$parent.config)
						.then((response2) => {
							//console.log(response2.data);
							this.allData = response2.data.data;

							this.firstname = response2.data.data.profile.firstname;
							this.footer = response2.data.data.footer;

							this.calc_for = response2.data.data.profile.gender == "M" 
								? ASTROWEB_HOROSCOPE_CONFIG.translate('calc_for_masculine')
								: ASTROWEB_HOROSCOPE_CONFIG.translate('calc_for_feminine');
							this.loading = false;
						})
						.catch((error) => {
							console.error(error);
						});
				})
				.catch((error) => {
					console.error(error);
					//console.error(error.response.data);
				});

		},
		computed: {
			aspect: function() {
				if(this.allData) {
					return this.allData[this.rpt_type]["aspect"];
				}
				return "";
			},
			report: function() {
				if(this.allData) {
					return this.allData[this.rpt_type]["text"];
				}
				return [];
			},
			dateend: function() {
				if(this.allData) {
					return this.allData[this.rpt_type]["dateend"];
				}
				return "";
			},
		},
		watch: {
			rpt_type: function(newType, oldType) {
				//set new value on user cookie
				this.$parent.user.rpt_type = newType;

				let d = new Date();
				d.setTime(d.getTime() + (180 * 24 * 60 * 60 * 1000));
				let expires = "expires=" + d.toUTCString();

				let cookieStr = "astroweb-horoscope-user=" + JSON.stringify(this.$parent.user) + ";" + expires + ";";
				document.cookie = cookieStr;
			},
		},
	}
</script>

<style lang="scss" scoped>
.astroweb-report-scrollbox {
	height: 150px;
	overflow-y: auto;
	border: 1px solid;
}
.astroweb-branding {
	position: relative;
	h6 {
		color: black;
		position: absolute;
		top: 4px;
		right: 25px;
	}
}
.astroweb-report-footer button {
	background: none;
	border: none;
	color: #007bff;
	&:hover {
		text-decoration: underline;
		color: #0056b3;
	}
}
</style>
