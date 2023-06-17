const { Controller } = require("uni-cloud-router");
module.exports = class AppController extends Controller {
	userinfo() {
		const { ctx, service } = this;
		return this.service.appinfo.userinfo(ctx);
	}
	nicknameSet() {
		const { ctx, service } = this;
		return this.service.appinfo.nicknameSet(ctx);
	}
	verifiGiftCard() {
		const { ctx, service } = this;
		return this.service.appinfo.verifiGiftCard(ctx);
	}
	sponsorRefresh() {
		const { ctx, service } = this;
		return this.service.appinfo.sponsorRefresh(ctx);
	}
	translate() {
		const { ctx, service } = this;
		return this.service.appinfo.translate(ctx);
	}
	compare() {
		const { ctx, service } = this;
		return this.service.appinfo.CompareText(ctx);
	}
	del() {
		const { ctx, service } = this;
		return this.service.appinfo.multTransDel(ctx);
	}
	vasIntial() {
		const { ctx, service } = this;
		let vasusage_ids = []
		if(ctx.auth.vasusage_ids){
			vasusage_ids = ctx.auth.vasusage_ids
		}
		return this.service.appinfo.valueAddedServicesIntial(ctx.auth.uid,vasusage_ids,'trial')
	}
	avatarSet() {
		const { ctx, service } = this;
		return this.service.appinfo.avatarSetWithOutCheck(ctx);
	}
};
