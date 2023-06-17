const { Controller } = require("uni-cloud-router");
module.exports = class httpController extends Controller {
	appinfo() {
		return this.service.http.appinfo();
	}
	async translate(){
		const { ctx, service } = this;
		return await service.http.translate(ctx);
	}
};
