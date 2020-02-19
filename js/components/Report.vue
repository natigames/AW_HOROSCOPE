<template>
	<div>
		<div class="astroweb-report-header">
			<div class="row">
				<div class="astroweb-report-date col-8 text-left">{{ dateend }}</div>
				<div class="astroweb-report-type col-4 text-right">{{ rpt_type }}</div>
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
				dateend: "",
				rpt_type: "",
				aspect: "",
				report: [],
				firstname: "",
				footer: false,
				
				calc_for: "",
				not_you: ASTROWEB_HOROSCOPE_CONFIG.translate('not_you'),
				powered_by: ASTROWEB_HOROSCOPE_CONFIG.translate('powered_by'),
				visit_astroweb_1: ASTROWEB_HOROSCOPE_CONFIG.translate('visit_astroweb_1'),
				visit_astroweb_2: ASTROWEB_HOROSCOPE_CONFIG.translate('visit_astroweb_2'),
			};
		},
		mounted() {
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
							this.dateend = response2.data.data.dateend;
							this.rpt_type = response2.data.data.type;
							this.aspect = response2.data.data.aspect;
							this.report = response2.data.data.text;
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
