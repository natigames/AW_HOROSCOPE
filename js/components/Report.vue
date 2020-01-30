<template>
	<div>
		<div class="astroweb-report-header">
			<div class="row">
				<div class="astroweb-report-date col-8 text-left">{{ dateend }}</div>
				<div class="astroweb-report-type col-4 text-right">{{ rpt_type }}</div>
			</div>
			<h3>{{ aspect }}</h3>
		</div>
		<div class="astroweb-report-scrollbox">
			<div v-for="section in report">
				{{ section }}
			</div>
		</div>
		<div class="astroweb-report-footer">
			<div>Calculated for {{ firstname }} <button @click="$parent.changePage('Form')">not you?</button></div>
			<div class="row">
				<div class="col-6 astroweb-branding">
					<div v-if="footer">
						<h6>Powered by:</h6>
						<img src="https://astroweb.mx/wp-content/uploads/2019/12/Logo2.png">
					</div>
				</div>
				<div class="col-6 align-self-center">
					Visit <a href="https://astroweb.mx" target="_blank">astroweb.mx</a> for more reports.
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
				dateend: "",
				rpt_type: "",
				aspect: "",
				report: [],
				firstname: "",
				footer: false,
			};
		},
		mounted() {
			axios.post("https://astroweb.mx/rest/aw/profiles/" + ASTROWEB_HOROSCOPE_CONFIG.token, this.$parent.user, this.$parent.$parent.config)
				.then((response) => {
					if(response.data.errordata) {
						console.error(errordata);
					}
					let profileid = response.data.data.profile.profileid;

					axios.get("https://astroweb.mx/rest/aw/horoscope/" + ASTROWEB_HOROSCOPE_CONFIG.token + "/" + profileid, this.$parent.$parent.config)
						.then((response2) => {
							console.log(response2.data);
							this.dateend = response2.data.data.dateend;
							this.rpt_type = response2.data.data.type;
							this.aspect = response2.data.data.aspect;
							this.report = response2.data.data.text;
							this.firstname = response2.data.data.profile.firstname;
							this.footer = response2.data.data.footer;
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
	overflow-y: scroll;
}
.astroweb-branding {
	position: relative;
	h6 {
		color: black;
		position: absolute;
		top: 4px;
		right: 45px;
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
