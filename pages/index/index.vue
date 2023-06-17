<template>
	<view v-if="refresh">
		<view v-if="loading">
			<u-loading-page :loading="true" image="../../../../static/citycircles.png">
				<u--image :lazy-load="true"  width="600rpx" height="487rpx" bgColor="#FFF"
				:src="currentAds.picurl" mode="widthFix"></u--image>
				<view style="font-size: 35rpx;padding-top: 30rpx;height: 50rpx;line-height: 50rpx;margin: 0 auto;font-weight: bold;" :style="'color: '+currentAds.color">
					{{currentAds.title}}
				</view>
				<view style="font-size: 23rpx;margin: 30rpx 100rpx 40rpx;" :style="'color: '+currentAds.color">
					{{currentAds.desc}}
				</view>	
				<view @tap="skiploading(currentAds)" style="font-size: 25rpx;text-align: center;color: #FFF;width: 200rpx;height: 50rpx;line-height: 50rpx;border-radius: 50rpx;margin: 0 auto;" :style="'background-color: '+currentAds.color">
					我知道了 {{startCountDown&&countdown>0?countdown:''}}
				</view>
			</u-loading-page>
			<view style="position: absolute;z-index: -99;color: #FFF;">
				<u-count-down ref="countDown" :autoStart="true" :time="currentAds.onetime?30000:5000" format="ss" @change="onCountdownChange"></u-count-down>
			</view>	
		</view>
		<view v-if="!loading">
			<view @tap="randomHundred();showDict=false" style="width: 80rpx;
			height: 80rpx;border-radius: 150rpx;position: fixed;bottom: 325rpx;
			right: 35rpx;z-index: 199;" :style="'background-color:'+globalSetting.btnBackgroundColor||'rgba(255,168,0,0.3)'">
				<view style="margin: 10rpx;"><u-icon name="question" :color="globalSetting.mainColor||'#014c46'" size="60rpx"></u-icon></view>
			</view>
			<view @tap="showDictList?showDictList=false:showDictList=true;showDict=true;listDict()" style="width: 80rpx;
			height: 80rpx;border-radius: 150rpx;position: fixed;bottom: 440rpx;
			right: 35rpx;z-index: 199;" :style="'background-color:'+globalSetting.btnBackgroundColor||'rgba(255,168,0,0.3)'">
				<view style="margin: 17rpx;"><pm-icon :color="globalSetting.mainColor||'#014c46'" :icon="showDictList?'trophy':'trophy-fill'" size="xl"></pm-icon></view>
			</view>	
			<view @tap="showDict?showDict=false:showDict=true" style="width: 80rpx;
			height: 80rpx;border-radius: 150rpx;position: fixed;bottom: 555rpx;
			right: 35rpx;z-index: 199;" :style="'background-color:'+globalSetting.btnBackgroundColor||'rgba(255,168,0,0.3)'">
				<view style="margin: 10rpx;"><u-icon :name="showDict?'file-text':'file-text-fill'" :color="globalSetting.mainColor||'#014c46'" size="60rpx"></u-icon></view>
			</view>	
			<u-popup :show="showRate" mode="center" bgColor="rgba(255,255,255,0.7)" :overlayOpacity="0.2" :round="10">
				<view style="width: 280rpx;height: 250rpx;">
					<view style="width: 280rpx;margin: 0 auto;">
						<view style="position: absolute;margin-top: 30rpx;z-index: 99;text-align: center;">	
							<view style="font-size: 72rpx;color: #78b65f;font-weight: bold;">
								{{currentRate}}
							</view>
							<view style="font-size: 25rpx;margin-top: 10rpx;color: #FFF;background-color: #78b65f;width: 200rpx;height: 50rpx;line-height: 50rpx;border-radius: 20rpx;margin: 0 auto;">
								本次得分
							</view>
							<view style="width: 280rpx;margin-top: 20rpx;justify-content:center;display: flex;">
								<u-rate activeColor="#FFA800" :value="currentRate" :allowHalf="true" readonly size="15" gutter="1rpx"></u-rate>
							</view>
						</view>	
					</view>				
				</view>
			</u-popup>
			<u-overlay :show="showOverlay" :duration="400" :z-index ="999" :opacity="0.8">
				<view style="font-size: 45rpx;margin: 300rpx 100rpx;font-weight: 200;color:#f2f5f8">
					<view class="red-dot" style="display: inline-flex;"><pm-icon color="#f2f5f8" icon="heartbeat" size="xl"></pm-icon></view>{{currentRecorder!==0?'Please speak English...':'请说普通话...'}}
				</view>
				<view v-if="currentRecorder!==0" style="text-align: center;font-size: 30rpx;position: fixed;bottom: 300rpx;font-weight: 200;color:rgba(255,255,255,0.7);width: 750rpx;">
					受语音识别精度影响，跟读打分玩法结果仅供参考
				</view>
			</u-overlay>
			<view class="toparea" :class="{'bgColor':scrollTop>=120}"> 
				<view @tap="showProfile?showProfile=false:showProfile=true"  style="top: 100rpx;left: 40rpx;position: absolute;z-index: 99;
				opacity:0;transition: all 0.5s;" :style="scrollTop>=120?'opacity:1;transition: all 0.5s':''">
					<view style="position: absolute;margin-left: 40rpx;z-index: 99;" ><u-icon color="#014c46" size="38rpx" top="45rpx" name="setting-fill"></u-icon></view>
					<image mode="aspectFill" style="width: 70rpx;height: 70rpx;border-radius: 150rpx;
					border: 5rpx #014c46 solid;" 
					:src="model1.userInfo.avatar+`?x-oss-process=image/resize,w_300,m_lfit/format,jpg/quality,q_80`" 
					 ></image>
				</view>
			</view>
			<u-popup bgColor="rgba(255,255,255,0.9)" :closeable="true" :show="showProfile" :round="10" mode="bottom" closeOnClickOverlay @close="showProfile=false">
				<view style="width: 750rpx;height:900rpx;transition: all 0.5s;" :style="extra?'height:1000rpx;transition: all 0.5s;':''">
					<view style="margin: 50rpx auto 20rpx;width: 580rpx;font-size: 27rpx;"  :style="'color: '+globalSetting.mainColor">	
							<view>
								<view v-if="!shares&&!giftcardShow" style="text-align: center;padding: 20rpx;margin: 20rpx auto 0rpx;font-size: 28rpx;margin-top: 30rpx;" :style="'color: '+globalSetting.secondColor">
									{{extra&&vasusage.type=="trial"?membershipRules.trial.desc:''}}
									{{extra&&vasusage.type=="vip1"?membershipRules.vip1.desc:''}}	
									{{extra&&vasusage.type=="vip2"?membershipRules.vip2.desc:''}}	
									{{extra&&vasusage.type=="vip3"?membershipRules.vip3.desc:''}}	
									{{extra?"":'点击可修改或随机获得昵称头像'}}	
								</view>
								<view v-if="shares"  style="text-align: center;padding: 20rpx;margin: 20rpx auto 0rpx;font-size: 26rpx;margin-top: 30rpx;" :style="'color: '+globalSetting.secondColor">
									<view>
										{{membershipRules.general.upgradeNotice[0]}}
										{{membershipRules.general.rewardValue}}
										{{membershipRules.general.upgradeNotice[1]}}
									</view>
									<view style="display: flex;justify-content: space-between;font-weight: 300;">
										<view style="line-height: 70rpx;">
											{{membershipRules.general.currenciesNotice[0]}}
											<view style="display: inline-flex;">
												<u-badge type="warning" :color="globalSetting.secondColor" :inverted="true" :showZero="true" max="99" :value="model1.userInfo.promotionCount"></u-badge>
											</view>
											{{membershipRules.general.currenciesNotice[1]}}
										</view>
										<view style="width: 270rpx;">
											<u-notice-bar :text="inviteList" speed="300" :disableTouch="false" fontSize="28rpx"
											direction="column" duration="5000" bgColor="rgba(255,255,255,0)" :color="globalSetting.secondColor" :icon="null"
											></u-notice-bar> 
										</view>
									</view>
								</view>
								<view v-if="giftcardShow" style="text-align: center;padding: 20rpx;margin: 20rpx auto 0rpx;font-size: 28rpx;margin-top: 30rpx;" :style="'color: '+globalSetting.secondColor">
									<u--input
										placeholder="请输入礼品卡密"
										inputAlign="center"
										:value="giftCardCode"
										confirmType="send"
										:holdKeyboard="true"
										:focus="true"
										@confirm="verifiGiftCard()"
										suffixIcon="gift-fill"
										suffixIconStyle="color: #FFA800"
									></u--input>
								</view>
								<view style="display: flex;">
									<view style="border-radius: 150rpx;border: 2rpx solid #CCC;margin: 20rpx auto;width:200rpx;height:200rpx;overflow:hidden">								
										<view style="border-radius: 150rpx;margin: 0rpx auto;width:200rpx;height:200rpx;z-index: 69;position: absolute;overflow:hidden;">
											<button :disabled="isavatarInPending" style="z-index: 99;position: absolute;width:200rpx;height:200rpx;border-radius: 150rpx;background-color:transparent;" open-type="chooseAvatar" @chooseavatar="bindchooseavatar"></button>
											<view class="avatarbtn" v-if="isavatarInPending" 
												style="line-height: 50rpx;
												text-align:center;width:200rpx;height:60rpx;font-size: 28rpx;font-weight: bold;align-items:flex-end;bottom: 0;
												z-index: 69;position: absolute;" :style="'background-color: '+globalSetting.avatarMaskColor">头像审核中</view>
											<view v-if="!isavatarInPending"  style="line-height: 50rpx;
												text-align:center;width:200rpx;height:60rpx;font-size: 28rpx;font-weight: bold;align-items:flex-end;bottom: 0;
												z-index: 69;position: absolute;" :style="'background-color: '+globalSetting.avatarMaskColor">
												选择头像
											</view>
										</view>
										<image style="width:200rpx;height:200rpx;border-radius: 150rpx;" mode="aspectFill" :src="model1.userInfo.avatar+`?x-oss-process=image/resize,w_300,m_lfit/format,jpg/quality,q_80`"></image>
									</view>
									<view v-if="settedPhone" style="border: 3rpx #FFA800 dashed;border-radius: 10rpx;padding: 10rpx;margin-left: 20rpx;">
										<view>
											<view @tap="extra?extra=false:extra=true" style="margin: 10rpx 20rpx;display: flex;align-items: flex-end;">
												<view style="font-size: 30rpx;color:#FFA800;font-weight: 600;text-align: center;">
													{{vasusage.type=="trial"?membershipRules.trial.name:''}}
													{{vasusage.type=="vip1"?membershipRules.vip1.name:''}}
													{{vasusage.type=="vip2"?membershipRules.vip2.name:''}}
													{{vasusage.type=="vip3"?membershipRules.vip3.name:''}}
													<pm-icon color="#FFA800" icon="tips" size="sm"></pm-icon>
												</view>
												<view style="font-size: 18rpx;color:#FFA800;font-weight: 300;text-align: center;margin-left: 5rpx;">
													<uni-dateformat format="yy/MM/dd" :date="vasusage.expiration_time" :threshold="[0,604800000]"></uni-dateformat>到期
												</view>
											</view>
											<view v-if="vasusage.type=='trial'||vasusage.type=='vip1'">
												<view>
													<u-line-progress :percentage="(vasusage.available_limit/vasusage.totallimit)*100"  :showText="false" height="10" activeColor="#FFA800" inactiveColor="#CCC"></u-line-progress>
												</view>
												<view style="font-size: 22rpx;color:#FFA800;font-weight: 300;text-align: end;">
													{{vasusage.available_limit}}/{{vasusage.totallimit}} 体验点额度
												</view>										
											</view>									
										</view>									
										<view @tap="vasusage.type=='vip3'?comingSoon():wxpay(vasusage.type)" style="margin: 20rpx;">
											<view style="padding: 5rpx 15rpx;
											font-size:28rpx; border-radius: 25rpx;text-align: center; 
											font-weight: 600;background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));
											color: #014c46;border: rgba(255,168,0,0.8) 3rpx solid;">
												{{vasusage.type=="trial"?membershipRules.trial.nextbtn:''}}
												{{vasusage.type=="vip1"?membershipRules.vip1.nextbtn:''}}
												{{vasusage.type=="vip2"?membershipRules.vip2.nextbtn:''}}
												{{vasusage.type=="vip3"?membershipRules.vip3.nextbtn:''}}
											</view>
											<view style="font-size: 19rpx;color:#FFA800;font-weight: 300;text-align: center;">
												{{vasusage.type=="trial"?membershipRules.trial.nextshortdesc:''}}
												{{vasusage.type=="vip1"?membershipRules.vip1.nextshortdesc:''}}
												{{vasusage.type=="vip2"?membershipRules.vip2.nextshortdesc:''}}
												{{vasusage.type=="vip3"?membershipRules.vip3.nextshortdesc:''}}
											</view>	
										</view>
										<view style="display: flex;justify-content: space-between;font-weight: bold;">
											<view @tap="shares?shares=false:shares=true;giftcardShow=false;InvitationCount();subscribeMessage(['k356yYwYq9SfZfbe-vtNWDqzf7Wk0_70Nj0enm_z9b4','8SvLWW0q_Udxu5nZDUE0O3txnVvTvw8RUeFMctE_yrw'])" style="font-size: 22rpx;color:#FFA800;font-weight: 300;">
												{{membershipRules.general.freeUpgrade}}
											</view>											
											<view @tap="giftcardShow?giftcardShow=false:giftcardShow=true;shares=false" style="font-size: 22rpx;color:#FFA800;font-weight: 300;">
												{{membershipRules.general.giftcardRedemption}}
											</view>	
										</view>
									</view>
								</view>
								<view style="justify-content: center;display: flex;">
									<u--form labelPosition="left" :model="model1" :rules="rules" ref="form1" :borderBottom="false">
										<u-form-item labelWidth="60" label="昵称" prop="userInfo.nickname" borderBottom ref="item1" :borderBottom="false" >	
											<view style="display: inline-flex;">
												<u--input type="nickname" inputAlign="center" v-model="model1.userInfo.nickname" border="none" ></u--input>
											</view>
										</u-form-item>
									</u--form>
									<view @tap="onclickSieve()" style="display: inline-flex;">
										<u-icon v-if="clickSieve" size="50rpx" name="../../../../static/clickSieve01.png" top="0rpx"></u-icon>
										<u-icon v-else size="50rpx" name="../../../../static/clickSieve02.png" top="0rpx"></u-icon>
									</view>
								</view>
								<view style="z-index: 2;justify-content: center;margin: 50rpx auto 0;width: 600rpx;">
									<u-button v-if="settedPhone" type="primary" size="normal" :plain="false" :color="'linear-gradient('+globalSetting.editBtnLinearGradient+')'" :hairline="true" text="修改资料" @tap="submitProfile()"></u-button>
									<u-button v-else type="primary" size="normal" :plain="false" :color="'linear-gradient('+globalSetting.editBtnLinearGradient+')'" :hairline="true" icon="weixin-fill" text="微信手机号登录并确认" open-type="getPhoneNumber" @getphonenumber="getPhoneNumberAndSubmit" ></u-button>
									<u-button :customStyle="{'margin-top': '20rpx'}" type="primary" size="normal" :plain="false" color="linear-gradient(to right, rgb(144, 152, 163), rgb(92, 108, 124))" :hairline="true" text="重新试试" @tap="onclickSieve()"></u-button>
								</view>
							</view>
						<!-- <view @click="showtoken?showtoken=false:showtoken=true;copytoken()" style="font-size: 20rpx;margin-top: 20rpx;text-align: center;" :style="'color: '+globalSetting.secondColor">
							生成API密钥
						</view>
						<view v-if="showtoken" @click="showtoken?showtoken=false:showtoken=true;copytoken()" style="font-size: 20rpx;margin-top: 20rpx;text-align: center;width: 500rpx;word-break: break-all;" :style="'color: '+globalSetting.secondColor">
							{{unijwt}}
						</view> -->
					</view>
				</view>
			</u-popup>
			<view v-if="showDict" class="talk" style="padding-top: 150rpx;position: absolute;z-index: 59;width: 750rpx;padding-bottom: 400rpx;">
				<view v-if="dictLoading||dictList.length == 0" style="margin: 30rpx;font-weight: 500;display: flex;">
					<view>
						<view style="font-size: 20rpx;z-index: 9;position: absolute;
				display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 10rpx 0;margin-left: 49rpx;margin-top: 48rpx;color:#f2f5f8;background-color:#FFA800">AI</view>
						<image mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 15rpx;" :src="aiAvatar[0]"></image>
					</view>
					<view>
						<u-icon color="#f2f5f8" size="28rpx" top="15rpx" name="play-left-fill"></u-icon>
					</view>
					<view style="margin-left: -8rpx;padding: 10rpx 10rpx 10rpx 20rpx;border-radius: 15rpx;border: 2rpx solid #f2f5f8;
					background-color: #f2f5f8;color: #014c46;max-width: 510rpx;">
						<view>								
							<view style="display: inline-flex;padding-top: 5rpx;">
								大家好，这是生词本，您可以点击下方识别按钮，拍下题卷并选择识别后的生词，存入生词本，之后就可以不断的刷词来加深记忆啦！
							</view>	
						</view>						
					</view>					
				</view>
				<view v-if="!dictLoading">
					<view v-if="!showDictList" v-for="(iitem,iindex) in alldictList" :key="iindex" style="width: 600rpx;margin: 30rpx;color: #FFF;">
						<view style="font-weight: bold;font-size: 50rpx;">
							{{iitem.dict.en}}
							<view @tap="dealDictInfo(iitem.word);clickdict=iindex" :class="clickdict==iindex?'red-dot':''" class="uplodBtn" style="height: 35rpx; border-radius: 25rpx;
							font-weight: 600;margin-left: 10rpx;display: inline-flex;color:#014c46;padding-right: 10rpx;font-size: 22rpx;
							background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));border: rgba(255,168,0,0.8) 3rpx solid;">
								<pm-icon color="#014c46" icon="sound" size="lg"></pm-icon>朗读
							</view>
						</view>
						<view style="margin-left: 0rpx;font-size: 25rpx;color: rgba(255,168,0,0.8)">
							<view v-if="iitem.last_update_date !== iitem.create_date" style="display: inline-flex;">
								<uni-dateformat :date="iitem.last_update_date" :threshold="[60000,86400000]"></uni-dateformat>练习过
							</view>
							<view v-if="iitem.last_update_date == iitem.initial_date" style="display: inline-flex;">
								<uni-dateformat :date="iitem.initial_date" :threshold="[60000,86400000]"></uni-dateformat>创建
							</view>
							<view v-if="iitem.last_update_date == iitem.create_date && iitem.last_update_date !== iitem.initial_date" style="display: inline-flex;">
								<uni-dateformat :date="iitem.create_date" :threshold="[60000,86400000]"></uni-dateformat>做错过
							</view>
						</view>
						<view style="margin: 30rpx 5rpx;color: #FFF;display: inline-flex;word-break: break-all;">
							{{iitem.dict.cn}}
						</view>
					</view>
					<view v-else v-for="(item,index) in dictList" :key="index" style="width: 680rpx;margin: 30rpx auto;color: #FFF;">
						<view style="font-weight: bold;font-size: 50rpx;">
							{{item.dict_words.en}}
							<view @tap="dealDictInfo(item.word);clickbtn=index" :class="clickbtn==index?'red-dot':''" class="uplodBtn" style="height: 35rpx; border-radius: 25rpx;
							font-weight: 600;margin-left: 10rpx;display: inline-flex;color:#014c46;padding-right: 10rpx;font-size: 22rpx;
							background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));border: rgba(255,168,0,0.8) 3rpx solid;">
								<pm-icon color="#014c46" icon="sound" size="lg"></pm-icon>朗读
							</view>
							<view v-if="item.times>0" style="margin-left: 10rpx;font-size: 25rpx;display: inline-flex;color: rgba(255,168,0,0.8)">
								已完成{{item.times}}次
							</view>						
						</view>
						<view style="margin-left: 0rpx;font-size: 25rpx;color: rgba(255,168,0,0.8)">
							<view v-if="item.last_update_date !== item.create_date" style="display: inline-flex;">
								<uni-dateformat :date="item.last_update_date" :threshold="[60000,86400000]"></uni-dateformat>练习过
							</view>
							<view v-if="item.last_update_date == item.initial_date" style="display: inline-flex;">
								<uni-dateformat :date="item.initial_date" :threshold="[60000,86400000]"></uni-dateformat>创建
							</view>
							<view v-if="item.last_update_date == item.create_date && item.last_update_date !== item.initial_date" style="display: inline-flex;">
								<uni-dateformat :date="item.create_date" :threshold="[60000,86400000]"></uni-dateformat>做错过
							</view>
						</view>
						<view>						
							<view @tap="item.state==0?sendItemChoose(index,iindex):''" v-for="(iitem,iindex) in item.chooseItems" :key="iindex" style="margin: 30rpx 10rpx;color: #FFF;display: inline-flex;word-break: break-all;">
								<view v-if="iitem.state==0" style="height: 25rpx;width:25rpx;border-radius: 25rpx;border: rgba(255,168,0,0.8) 5rpx solid;margin-right: 5rpx;margin-top: 10rpx;"></view>
								<view v-if="iitem.state==1" style="height: 25rpx;width:25rpx;border-radius: 25rpx;background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));border: rgba(255,168,0,0.8) 5rpx solid;;margin-right: 5rpx;margin-top: 10rpx;"></view>
								<view v-if="iitem.state==2" style="height: 25rpx;width:25rpx;border-radius: 25rpx;background-image: linear-gradient(to right,rgba(2,198,52,0.8), rgba(19,135,42,0.8));border: rgba(2,198,52,0.8) 5rpx solid;;margin-right: 5rpx;margin-top: 10rpx;"></view>
								<view v-if="iitem.state==3" style="height: 25rpx;width:25rpx;border-radius: 25rpx;background-image: linear-gradient(to right,rgba(243,38,4,0.8), rgba(247,75,17,0.8));border: rgba(243,38,4,0.8) 5rpx solid;;margin-right: 5rpx;margin-top: 10rpx;"></view>
								{{iitem.dict_words.cn}}
							</view>
						</view>
					</view>
				</view>
				<u-popup bgColor="rgba(255,255,255,0)" :show="showCamera" mode="top">
					<scroll-view v-if="showCamera&&ocrFile" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" style="height:580rpx;position: fixed;z-index: 9999;margin-top: 180rpx;" >
						<view style="display: flex;flex-wrap: wrap;padding: 0 20rpx;justify-content: space-between;">
							<view @tap="searchBook(item,index)" :style="ocrChoose.findIndex((ocr) => {return ocr === index}) !== -1?'background-color: #888;':'background-color: #CCC;'" style="background-color: #CCC;word-break:break-all;border-radius: 20rpx;color: #014c46;display: inline-flex;padding: 3rpx 6rpx;margin: 3rpx;" v-for="(item,index) in ocrWords.split(' ')" :key="index">
								{{item}}
							</view>
						</view>
					</scroll-view>					
					<camera v-if="showCamera&&!ocrFile" device-position="back" flash="off" @error="error" style="width:750rpx; height: 800rpx;"></camera>
					<image v-if="showCamera&&ocrFile" mode="widthFix" style="width:750rpx; height: 800rpx;" :src="ocrFile"></image>
					<view style="display: flex;margin-top: 20rpx;justify-content: flex-end;margin-right: 30rpx;justify-content: space-between;">
						<view style="color: #CCC;margin-left: 50rpx;font-size: 40rpx;height: 100rpx;align-items: center;">
							<input type="text" placeholder=" " v-model="bookText" confirm-type="search" @confirm="searchBook(bookText)"/>
						</view>
						<view style="display: flex;">
							<view @tap="clickOcr()" class="uplodBtn" style="width: 120rpx; height: 70rpx; font-size:38rpx; border-radius: 25rpx;
							line-height: 70rpx; text-align: center; letter-spacing: 8rpx; font-weight: 600;margin-left: 20rpx;
							background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));color: #014c46;border: rgba(255,168,0,0.8) 3rpx solid;">
								拍照
							</view>
							<view @tap="ocrFile=''" class="uplodBtn" style="width: 120rpx; height: 70rpx; font-size:38rpx; border-radius: 25rpx;
							line-height: 70rpx; text-align: center; letter-spacing: 8rpx; font-weight: 600;margin-left: 20rpx;
							background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));color: #014c46;border: rgba(255,168,0,0.8) 3rpx solid;">
								取消
							</view>							
						</view>
					</view>
					<view v-if="dictInfo.cn" style="color: #CCC;margin-left: 50rpx;font-size: 30rpx;max-width: 500rpx;">
						<view style="margin-bottom: 20rpx;">
							<view @tap="dealDictInfo(bookText)" class="uplodBtn" :class="dictInfo.play==1?'red-dot':''"  style="height: 35rpx; border-radius: 25rpx;
							font-weight: 600;margin-left: 0rpx;display: inline-flex;color:#014c46;padding-right: 10rpx;font-size: 22rpx;
							background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));border: rgba(255,168,0,0.8) 3rpx solid;">
								<pm-icon color="#014c46" icon="sound" size="lg"></pm-icon>朗读
							</view>
							<view @tap="addable?addDict(dictInfo._id,dictInfo.en):''" class="uplodBtn" style="height: 35rpx; border-radius: 25rpx;
							font-weight: 600;margin-left: 30rpx;display: inline-flex;color:#014c46;padding-right: 10rpx;font-size: 22rpx;
							background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));border: rgba(255,168,0,0.8) 3rpx solid;">
								<pm-icon color="#014c46" icon="add" size="lg"></pm-icon>加入生词本
							</view>
						</view>
						{{dictInfo.cn}}
					</view>
				</u-popup>
			</view>
			<view v-if="!showDict" class="talk" style="position: absolute;z-index: 59;width: 750rpx;padding-bottom: 400rpx;">
				<view v-for="(item,index) in talkList" :key="index" style="width: 680rpx;margin: 30rpx auto;padding-top: 100rpx;">
					<view v-if="Math.ceil((index>0?new Date(item.updatedAt).getTime()-new Date(talkList[index-1].updatedAt).getTime():'')/1000)>300"
					style="font-size: 25rpx;color: #11221a;text-align: center;line-height: 60rpx;">
						<uni-dateformat  :date="item.updatedAt" :threshold="[0,0]"></uni-dateformat>
					</view>
					<view v-if="item.translate_task.show_source_text" style="margin: 10rpx 0;font-weight: 500;-webkit-justify-content: flex-end;justify-content: flex-end;display: flex;">
						<view @tap="inDelChoose?radiochange(index):''"
						style="padding: 10rpx 10rpx 10rpx 20rpx;border-radius: 15rpx;
						border: 2rpx solid #014c46;
						background-color: #014c46;color: #f2f5f8">
							<view style="pdisplay:inline-flex;word-break: break-all;">
								<u-tooltip v-if="item.translate_task.source_text.length<18" :text="item.translate_task.source_text" :buttons="['删除']" size="32rpx" color="#f2f5f8" @click="chooseItem"></u-tooltip>
								<view v-if="item.translate_task.source_text.length>17">{{item.translate_task.source_text}}</view>
							</view>
							<view style="float:right;">	
								<u-tooltip v-if="item.translate_task.source_text.length>17" :copyText="item.translate_task.source_text" text=" 长按" :buttons="['删除']" size="32rpx" color="#777" @click="chooseItem"></u-tooltip>
							</view>
						</view>					
						<view style="margin-left: -8rpx;"> 
							<u-icon color="#014c46" size="28rpx" top="15rpx" name="play-right-fill"></u-icon>
						</view>
						<view>
							<view style="font-size: 20rpx;z-index: 9;position: absolute;display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 10rpx 0;
							margin-left: 49rpx;margin-top: 48rpx;color:#f2f5f8;background-color:#FFA800">您</view>
							<image mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 15rpx;" :src="model1.userInfo.avatar+`?x-oss-process=image/resize,w_300,m_lfit/format,jpg/quality,q_80`"></image>
						</view>
					</view>
					<checkbox-group v-if="inDelChoose&&item._id!==0" @change="radiochange(index)">
						<checkbox style="transform:scale(0.7)" :checked="item.delChoosed" :color="globalSetting.mainColor" :value="item.delChoosed" />
					</checkbox-group>
					<view v-if="item.translate_task.translated" style="margin: 30rpx 0;font-weight: 500;display: flex;">
						<view>
							<view style="font-size: 20rpx;z-index: 9;position: absolute;
					display: inline-block;padding: 0 5rpx;border-radius: 10rpx 0 10rpx 0;margin-left: 49rpx;margin-top: 48rpx;color:#f2f5f8;background-color:#FFA800">AI</view>
							<view v-if="item.score" style="z-index: 9;position: absolute;margin-left: 0rpx;margin-top: 95rpx;">
								<u-rate activeColor="#FFA800" :value="item.score" :allowHalf="true" readonly size="8" gutter="1rpx"></u-rate>
							</view>
							<image v-if="item.translate_task.play==1" mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 15rpx;" :src="aiAvatar[1]"></image>
							<image v-else mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 15rpx;" :src="aiAvatar[0]"></image>
						</view>
						<view>
							<u-icon color="#f2f5f8" size="28rpx" top="15rpx" name="play-left-fill"></u-icon>
						</view>
						<view style="margin-left: -8rpx;padding: 10rpx 10rpx 10rpx 20rpx;border-radius: 15rpx;border: 2rpx solid #f2f5f8;
						background-color: #f2f5f8;color: #014c46;max-width: 510rpx;">
							<view @tap="dealInnerAudioContext(index)">	
								<view style="line-height: 40rpx;display: flex;justify-content: space-between;">
									<view style="display: inline-flex;">
										<view :class="item.translate_task.play==1?'red-dot':''" style="display: inline-flex;"><pm-icon color="#014c46" icon="all" size="lg"></pm-icon></view> 
										<view style="margin-left: 10rpx;display: inline-flex;font-size: 22rpx;margin-bottom: 5rpx;">{{Math.ceil(item.translate_task.word_count*0.23)}}″</view>
									</view>
									<view v-if="item.translate_task.show_source_text&&!item.translate_task.current" style="display: inline-flex;font-size: 23rpx;font-weight: 300;color: #028277;">
										跟读
									</view>
								</view>
								<view style="display: inline-flex;border-top: #CCC solid 2rpx;padding-top: 5rpx;" :style="item.translate_task.show_source_text&&item.translate_task.current?'max-width: 450rpx;':''">
									<u-tooltip v-if="item.translate_task.translated.length<20" :text="item.translate_task.translated" :buttons="['删除']" size="32rpx" color="#014c46" @click="chooseItem"></u-tooltip>
									<view v-if="item.translate_task.translated.length>19">{{item.translate_task.translated}}</view>
								</view>	
								<view v-if="item.translate_task.show_source_text" style="float:right;">	
									<u-tooltip v-if="item.translate_task.translated.length>19" :copyText="item.translate_task.translated" text=" 长按" :buttons="['删除']" size="32rpx" color="#CCC" @click="chooseItem"></u-tooltip>
								</view>	
							</view>						
						</view>
						<view v-if="item.translate_task.show_source_text&&item.translate_task.current" :style="'margin-left:10rpx;width: 80rpx; height: 80rpx; font-size:30rpx; border-radius: 25rpx;line-height: 30rpx; text-align: center; letter-spacing: 3rpx; font-weight: 600;background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));color: #014c46;border: rgba(255,168,0,0.8) 3rpx solid;'"
						  @touchstart="streamRecord('en_US',item.translate_task._id)" @touchend="endStreamRecord(item.translate_task._id)" >
							<view style="padding-top: 10rpx;padding-left: 5rpx;">长按</view>
							<view style="padding-left: 5rpx;">跟读</view>							
						</view>
					</view>
				</view>
				<view style="padding-top: 100rpx;" class="index-con"></view>
			</view>
			<view class="bgAndBottom"> 
				<view v-if="inDelChoose">
					<view @tap="inDelChoose=false;delList=[];delCount=0" class="uplodBtn" style="position: fixed; z-index: 9996; bottom: 300rpx; width: 120rpx; height: 70rpx; right:175rpx;font-size:38rpx; border-radius: 25rpx;
					line-height: 70rpx; text-align: center; letter-spacing: 8rpx; font-weight: 600;
					background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));color: #014c46;border: rgba(255,168,0,0.8) 3rpx solid;">
						取消
					</view>
					<view @tap="!sending?delItem():''" class="uplodBtn" style="position: fixed; z-index: 9996; bottom: 300rpx; width: 120rpx; height: 70rpx; right:25rpx;font-size:38rpx; border-radius: 25rpx;
					line-height: 70rpx; text-align: center; letter-spacing: 8rpx;font-weight: 600;
					background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));color: #014c46;border: rgba(255,168,0,0.8) 3rpx solid;">
						删除
					</view>
				</view>
				<view v-if="showDict" class="uplodBtn" style="position: fixed; z-index: 9996; bottom: 115rpx; width: 400rpx; height: 100rpx; margin: 0rpx 175rpx;font-size:38rpx; border-radius: 25rpx;
				line-height: 100rpx; text-align: center; letter-spacing: 8rpx; display: flex;font-weight: 600;
				background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));color: #014c46;border: rgba(255,168,0,0.8) 3rpx solid;'"
				 @tap="showCamera?showCamera=false:showCamera=true;listDict()" >
					<view style="margin: 24rpx 33rpx;">
						<u-icon color="#014c46" size="55rpx" name="scan"></u-icon>
					</view>
					<view style="display: inline-flex;">{{showCamera?'返回列表':'拍照识别'}}</view>
				</view>
				
				<view v-if="!showDict" class="uplodBtn" style="position: fixed; z-index: 9996; bottom: 110rpx; width: 400rpx; height: 100rpx; margin: 0rpx 175rpx;font-size:38rpx; border-radius: 25rpx;
				line-height: 100rpx; text-align: center; letter-spacing: 8rpx; display: flex;font-weight: 600;
				background-image: linear-gradient(to right,rgba(255,168,0,0.8), rgba(255,204,0,0.8));color: #014c46;border: rgba(255,168,0,0.8) 3rpx solid;'"
				 @touchstart="streamRecord('zh_CN',0)" @touchend="endStreamRecord(0)" >
					<view :class="onTalking?'red-dot':''" style="margin: 24rpx 33rpx;">
						<u-icon color="#014c46" size="55rpx" name="mic"></u-icon>
					</view>
					<view :class="onTalking?'red-dot':''" style="display: inline-flex;">{{onTalking?'松手发送':'按住说话'}}</view>
				</view>
				<view style="position: fixed;z-index: 99;bottom: 0rpx;">
					<image mode="widthFix" style="width: 750rpx;position: absolute;z-index: 100;" src="../../static/bottom.png"></image>
					<view style="height: 290rpx;width: 750rpx;background-image: radial-gradient(750rpx circle at 10% 80%,rgba(255,242,230,1), rgba(251,208,154,1));margin-top: 30rpx;"></view>
				</view>
				<image mode="widthFix" style="position: fixed;width: 750rpx" src="../../static/bg.jpg"></image>
			</view>			
		</view>
	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	var plugin = requirePlugin("WechatSI")
	let manager = plugin.getRecordRecognitionManager() 
	// 
	// #endif
	// 获取db引用
	const db = uniCloud.database() //代码块为cdb
	const uniIdCo = uniCloud.importObject('uni-id-co')  
	const uniPayCo = uniCloud.importObject('uni-pay-co')
	export default {
		data() {
			return {
				bookText:"",
				alldictList:[],
				indexList:[],
				dictInfo:{cn:""},
				dictpagesize:10,
				dictpageindex:0,
				pagesize:4,
				listCount:0,
				clickbtn:999,
				clickdict:999,
				pageindex:0,
				dictLoading:false,
				showDict:false, 
				showDictList:false,
				showCamera:false, 
				ocrFile:"",
				ocrWords:"",
				ocrChoose:[],
				dictList:[],
				unijwt:"",
				showtoken:false,			
				//				
				globalAudioContext:{},
				refresh:true,
				loading:true,
				currentAds:{
					picurl:'../../../../static/ad1.jpg',
					color:'#78b65f',
					title:'温馨提示',
					desc:'长按跟读，可以尝试AI评分玩法',
					onetime:false
				},
				countdown:0,
				aiAvatar:["../../static/avatar01.png","../../static/avatar01.gif"],
				startCountDown:true,
				scrollTop:0,
				scrollHeight:0,
				//
				talkList:[],
				inDelChoose:false, 
				delCount:0,
				delList:[],
				sending:false,
				onTalking: false,
				currentRecorder:0, 
				showOverlay:false,
				showRate:false,
				currentRate:0,
				//
				formData: {
					mobile: ""
				},
				inviteCode:null,
				addable:false,
				showProfile:false,
				clickSieve:false,
				extra:false,
				globalSetting:{
					mainColor: "#014c46",
					secondColor: "#FFA800",
					avatarMaskColor: "rgba(255,255,255,0.7)",
					editBtnLinearGradient: "to right,rgba(34,60,82,0.8), rgba(34,79,82,0.8)",
				},
				bdtoken:"",
				shares:false,
				shares:false,
				giftcardShow:false,
				vasusage:{},
				membershipRules:{},
				inviteList:[],
				hundred:[],
				giftCardCode:"",
				giftcardOverwrite:false,
				isavatarInPending:false,
				settedPhone:false,
				model1:{
					userInfo: {
						nickname: "",
						avatar: "../../static/avatar.png"
					},
				},
				rules: {
					'userInfo.nickname': {
						type: 'string',
						required: true,
						max: 10,
						min:1,
						message: '昵称为1-10个字',
						trigger: ['blur', 'change']
					},
				},
				randomAvators:[],
				randomNames:[]				
			}
		},
		watch:{
			countdown(){
				console.log(this.countdown)
				if(this.countdown == 0){
					setTimeout(()=>{//1秒延迟
						this.loading = false
						uni.setStorageSync('adsTime',new Date())//更新广告时间
					},1000)
				}
			},
		},
		onPageScroll(res){
			this.scrollTop = res.scrollTop
		},
		onReachBottom() {
			if(this.showDict){
				if(this.alldictList.length < this.dictpageindex*this.dictpagesize) {
					this.endding = true
				}
				else{
					this.dictpageindex++
					console.log('监测到页面触底事件，向API请求第'+this.dictpageindex+'页数据成功',this.listDictList)
				}
			}
		},
		onPullDownRefresh() {
			if(this.talkList.length < this.pageindex*this.pagesize) {
				this.talkList.reverse()
				this.pushWelcomeItem()
				this.talkList.reverse()
				this.endding = true
				uni.stopPullDownRefresh()//关闭下拉刷新
			}
			else{
				this.pageindex++
				this.getList(()=>{//在下拉刷新getList()时使用此回调函数
					uni.stopPullDownRefresh()//关闭下拉刷新
				})
				this.globalAudioContext.stop()
				this.talkList.forEach(item=>{
					item.translate_task.play = 0
					this.refresh = false
					this.refresh = true
				})
			}
		},
		async onLoad(option) {
			this.getBDtoken()
			this.info(()=>{
				this.adsRandomChoose()
			}) 
			this.listDict()
			this.initRecord()			
			this.globalAudioContext = uni.createInnerAudioContext();
			this.globalAudioContext.onEnded(() => {
				this.dictInfo.play = 0
				this.clickbtn = 999
				this.clickdict = 999
				this.talkList.forEach((item,index)=>{
					this.talkList[index].translate_task.play = 0
					this.refresh = false
					this.refresh = true
				})
			});
			this.scrollHeight = uni.getSystemInfoSync().windowHeight/(uni.getSystemInfoSync().screenWidth/750)	
			if(option){
				// console.log("option",option)
				if(option.inviteCode){
					// console.log("option.openid",option.inviteCode)
					uni.setStorageSync('sponsor',option.inviteCode)
					this.inviteCode = option.inviteCode
				}
				if(option.showme=="true"){
					this.showProfile = true
				}
			}
			if(!uni.getStorageSync('uni_id_token_expired')||new Date(uni.getStorageSync('uni_id_token_expired'))<new Date()){
				// console.log('token过期或token不存在',new Date(uni.getStorageSync('uni_id_token_expired')));
				console.log('token',await this.weChatSignin(()=>{						
					this.getAccountInfo()
					this.userinfo(()=>{
						this.getList()
						this.skipAds()
						this.listDictList()
					})					
					this.InvitationCount()
				}));
			}else{
				// console.log('token过期时间:::',new Date(uni.getStorageSync('uni_id_token_expired')));
				this.getAccountInfo()
				this.userinfo(()=>{
					this.getList()
					this.skipAds()
					this.listDictList()
				})	
				this.InvitationCount()
			}
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      // console.log(res.target)
		    }
		    return {
			  path:"/pages/index/index?inviteCode="+this.model1.userInfo.my_invite_code,
		      title: '橙事英语 | 和AI对话练口语',
		    }
		},
		onShareTimeline(res) {
			return {
				title: '都'+new Date().getFullYear()+'年了还在死记硬背？快来和AI对话练口语',
				imageUrl: '../../static/cover.jpg',
				query: 'inviteCode='+this.model1.userInfo.my_invite_code
			}
		},
		methods: {
			error(e){
				console.log(e.detail);
			},
			copytoken(){
				this.unijwt = 'Bearer '+uni.getStorageSync('uni_id_token')
				uni.setClipboardData({
					data: '您的密钥为：Bearer '+uni.getStorageSync('uni_id_token')
				});
			},
			async sendItemChoose(index,iindex){
				if(this.dictList[index].chooseItems[iindex].dict_word==this.dictList[index].dict_word){
					const list = await db.collection('wrong-topic').where({'_id':this.dictList[index]._id}).get()
					const updatelist = await db.collection('wrong-topic').where({'_id':this.dictList[index]._id}).update({
						times:list.result.data[0].times + 1,
						last_update_date:new Date().getTime(),
						wronng_date:32503651199999
					})
					this.dictList[index].times = list.result.data[0].times + 1
					// console.log('dictList11',list.result.data[0]);
					this.dictList[index].chooseItems[iindex].state=1;
					this.dictList[index].state=1;									
					uni.showToast({
						title:'选择正确'
					})
					this.listCount = this.listCount + 1	
					if(this.listCount == this.pagesize){
						this.listDict()
						this.listCount = 0
						this.dictLoading = true
						setTimeout(()=>{
							this.dictLoading = false
						},1000)
					}
					this.refresh=false;
					this.refresh=true
				}
				else{					
					const updatelist = await db.collection('wrong-topic').where({'_id':this.dictList[index]._id}).update({
						create_date:new Date().getTime(),						
						last_update_date:new Date().getTime(),
						wronng_date:new Date().getTime()
					})
					uni.showToast({
						title:'选择有误'
					})					
					this.dictList[index].state=1;
					this.dictList[index].chooseItems[iindex].state=3
					const itemIndex = this.dictList[index].chooseItems.findIndex((item) => {return item._id === this.dictList[index]._id})
					this.dictList[index].chooseItems[itemIndex].state=2
					this.listCount = this.listCount + 1
					if(this.listCount == this.pagesize){
						this.listDict()
						this.listCount = 0
						this.dictLoading = true
						setTimeout(()=>{
							this.dictLoading = false
						},1000)
					}
					this.refresh=false
					this.refresh=true
				}
			},			
			//洗牌算法，用于增加四个随机值
			async randomItems(word){
				let limit = 4
				const countlist = await db.collection('wrong-topic').where({'show_in_list':true}).orderBy('create_date desc').count()
				let randomNum = Math.floor(Math.random()*countlist.result.total)
				if(randomNum - limit < 0){
					randomNum = 0
				}else{
					randomNum = randomNum - limit
				}
				const list = await db.collection('wrong-topic').where({'show_in_list':true}).skip(randomNum).limit(limit).orderBy('create_date desc').get()
				const listIndex = list.result.data.findIndex((item) => {return item._id === word._id})
				let randomFour = Math.floor(Math.random()*4)				
				if(listIndex == -1){
					list.result.data[randomFour] = word
					list.result.data.forEach(async (item,index)=>{
						item.state = 0
						const dict = await db.collection('dict-ec').where({'_id':item.dict_word}).get()
						item.dict_words = dict.result.data[0]
						this.refresh=false
						this.refresh=true
					})					
					return list.result.data
				}
				else{
					list.result.data.forEach(async (item,index)=>{
						item.state = 0
						const dict = await db.collection('dict-ec').where({'_id':item.dict_word}).get()
						item.dict_words = dict.result.data[0]		
						this.refresh=false
						this.refresh=true
					})
					return list.result.data
				}
			},
			
			async listDict(callback){
				let start = 0
				let limit = this.pagesize
				const list = await db.collection('wrong-topic').where({'user':this.model1.userInfo._id,'show_in_list':true}).skip(start).limit(limit).orderBy('wronng_date asc,create_date desc').get()
				this.dictLoading = true				
				this.dictList = []
				this.dictList = list.result.data
				this.dictList.forEach(async (item,index)=>{
					item.state = 0
					const dict = await db.collection('dict-ec').where({'_id':item.dict_word}).get()
					item.dict_words = dict.result.data[0]					
					item.chooseItems = await this.randomItems(JSON.parse(JSON.stringify(item)))
					this.refresh=false
					this.refresh=true
				})
				setTimeout(()=>{
					this.dictLoading = false
				},500)
				// console.log('dictList',this.dictList)
			},
			async addDict(id,text){
				// console.log(id,new Date().getTime());
				const dicttopic = await db.collection('wrong-topic').where({'dict_word':id}).get()
				if(dicttopic.result.data.length>0){
					const updatetopic = await db.collection('wrong-topic').where({'dict_word':id}).update({
						create_date:new Date().getTime(),
						last_update_date:new Date().getTime()
					})
					uni.showToast({
						title:'已更新'
					})
				}else{
					const addtopic = await db.collection('wrong-topic').add({
						dict_word:id,
						user:this.model1.userInfo._id,
						times:0,
						word:text,
						show_in_list:true,						
						create_date:new Date().getTime(),
						initial_date:new Date().getTime(),
						last_update_date:new Date().getTime(),
						wronng_date:32503651199999
					})
					uni.showToast({
						title:'已添加'
					})
				}
			},
			async searchBook(text,index){
				this.ocrChoose.push(index)
				this.bookText = text.toLowerCase()
				// console.log('text',text);
				const dict = await db.collection('dict-ec').where({'en':this.bookText}).get()
				// console.log(dict.result);
				// console.log('dict：：',this.bookText,bookText,dict.result)
				if(dict.result.data.length>0){
					this.dictInfo = dict.result.data[0]
					this.dictInfo.play = 0
					this.addable = true
					this.dealDictInfo(this.bookText)
				}else{
					this.dictInfo.cn = "无结果"
					this.addable = false
				}
				
			},
			dealDictInfo(text){
				// console.log('text',text);
				if(this.dictInfo.play == 0){
					this.globalAudioContext.stop()
					let _this = this
					plugin.textToSpeech({
					    lang: "en_US",
					    tts: true,
					    content: text,
					    success: function(res) {
							// console.log('dealDictInfo',res.filename);
							_this.globalAudioContext.src = res.filename
							_this.globalAudioContext.play()
							_this.dictInfo.play = 1
							_this.refresh = false
							_this.refresh = true
					    },
					    fail: function(res) {
					        console.log("fail tts", res)
					    }
					})
				}				
			},
			async clickOcr(){
				const ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: (res) => {
						this.ocrFile = res.tempImagePath
						let that = this
						uni.getFileSystemManager().readFile({
							filePath: res.tempImagePath, //选择图片返回的相对路径
							encoding: 'base64', //编码格式
							success: ress => { //成功的回调
								let base64 = 'data:image/jpeg;base64,' + ress.data //不加上这串字符，在页面无法显示的哦
								// that.ocrWords = base64
								uni.request({
								    url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token='+this.bdtoken, 
								    data:'image='+encodeURIComponent(base64),
									method:"POST",
								    header: {
								        'Content-Type':'application/x-www-form-urlencoded'
								    },
								    success: (res) => {
										that.ocrWords = ""
								        res.data.words_result.forEach(item=>{
											that.ocrWords = that.ocrWords + " " + item.words.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,' ').replace(/\s+/g, ' ')
											// console.log('that.ocrWords',that.ocrWords)
										})
								    }
								});
							}
						});
					}
				});
				
			},
			async getBDtoken(){
				const token = await db.collection('auth-data').where({'platform':"citiesenbaidubce"}).orderBy('last_update_date desc').get()
				this.bdtoken = token.result.data[0].access_token
				// console.log('bdtoken',this.bdtoken)
			},
			closeSuggest(){
				this.showSuggest = false
			},			
			randomHundred(){
				const randomNum = Math.floor(Math.random()*this.hundred.length)
				this.InsertTalk(this.hundred[randomNum])
			},
			initRecord(){
			   //有新的识别内容返回，则会调用此事件
			   manager.onRecognize = (res) => {
				 let text = res.result
			   }
			   // 识别结束事件
			   manager.onStop = (res) => {
				let text = res.result
				if(text == '') {
					console.log('没有说话')
				  return
				}
				// console.log(this.currentRecorder,text)
				if(this.currentRecorder === 0){
					this.InsertTalk(text)
				}
				else{
					this.CompareText(this.currentRecorder,text)
				}
			   }
			},
			async InsertTalk(text){
				const currentTalkIndex = this.talkList.length
				this.talkList.push({
					id: null,
					score: null,
					show_in_list: true,
					translate_task:{
						source_text: text,
						show_source_text: true,
						current: true,
						showReadingBtn:false,
						translated: null
					}
				})
				if(this.inDelChoose){//录入时,如果删除中,解除状态
					this.inDelChoose=false;this.delList=[];this.delCount=0
				}
				if(this.settedPhone == false && this.talkList.length > 3){
					this.showProfile = true
					uni.showToast({
						title:"登录后免费体验"
					})
				}				
				this.translateTask(text,currentTalkIndex)
			},
			async translateTask(text,currentTalkIndex){
				let _this = this
				plugin.translate({
				    lfrom:"zh_CN",
				    lto:"en_US",
				    content:text,
					tts:true,
				    success: async function(ress) {
				        if(ress.retcode == 0) {
				            // console.log("result:::", ress)		
							// console.log('talkList',_this.talkList,currentTalkIndex)	
							const res = await uniCloud.callFunction({
								name: 'info',
								data: {
									action: 'appinfo/translate',
									data: {
										"text":text,
										"source":"zh_CN",
										"target":"en_US",
										"translated":ress.result,
										"wordCount":ress.result.split(' ').length
									}
								}
							})							
							// console.log('resresresres',res.result)							
							if(res.result.succeed){								
								// console.log('1',res.result.translate)
								res.result.translate.show_source_text = true
								// console.log('2',res.result.translate)
								_this.talkList[currentTalkIndex].translate_task = res.result.translate		
								_this.globalAudioContext.stop()
								_this.globalAudioContext.src = ress.filename
								// console.log('filename',ress.filename,'src::',_this.globalAudioContext.src)
								_this.globalAudioContext.play()
								_this.talkList.forEach((item,index)=>{
									item.translate_task.play = 0
									item.translate_task.current = false						
								})
								_this.talkList[currentTalkIndex].translate_task.play = 1
								_this.talkList[currentTalkIndex].translate_task.current = true
								if(_this.talkList.length<=7){
									const query = uni.createSelectorQuery()
									query
										.select('.index-con')
										.boundingClientRect((data) => {
										  // console.log(data, 'data')
										  let pageScrollTop = Math.round(data.top)
										  uni.pageScrollTo({
											scrollTop: pageScrollTop, //滚动的距离
											duration: 0, //过渡时间
										})
									 })
									.exec()
								}
								_this.refresh = false
								_this.refresh = true
								// console.log(_this.talkList)
							}else{
								uni.showToast({
									title:res.result.reason,
									duration:3000
								})
							}
				        } else {
				            console.warn("翻译失败", res)
				        }
				    },
				    fail: function(res) {
				        console.log("网络失败",res)
				    }
				})
			},
			compare(property){
				return function (a,b){
				    return a[0].dict[property]-b[0].dict[property];
				}
			},
			async listDictList(callback){
				let start = this.dictpageindex*this.dictpagesize
				let limit = this.dictpagesize
				const list = await db.collection('wrong-topic').where({'user':this.model1.userInfo._id,'show_in_list':true}).skip(start).limit(limit).orderBy('last_update_date desc').get({getCount:true})
				// console.log("alldict::",list.result)
				list.result.data.forEach(async(item,index)=>{
					const dict = await db.collection('dict-ec').where({'_id':item.dict_word}).get()
					item.dict = dict.result.data[0]					
				})
				this.alldictList = [...this.alldictList,...list.result.data]
				// console.log("alldictList::",this.alldictList)							
				callback && callback()//如果回调函数存在，则执行该回调函数
			},
			async getList(callback){	
				let start = this.pageindex*this.pagesize
				let limit = this.pagesize
				// console.log('user::::',this.model1.userInfo)
				const list = await db.collection('readingscore').where({'user':this.model1.userInfo._id}).skip(start).limit(limit).orderBy('last_update_date desc').get()
				list.result.data.forEach(async item=>{
					const translate_task = await db.collection('translatetask').where({'_id':item.taskid}).get()
					delete translate_task.result.data[0].owners
					item.translate_task = translate_task.result.data[0]
					item.delChoosed=false
					item.translate_task.play = 0
					item.translate_task.current = false
					item.translate_task.show_source_text = true
					item.translate_task.showReadingBtn = false
				})
				// console.log('list',start,limit,list.result.data)				
				this.talkList = [...this.talkList.reverse(),...list.result.data].reverse()
				//如果是新用户，播放欢迎
				if(this.talkList.length == 0){
					this.pushWelcomeItem()//插入欢迎内容
					this.endding = true
					this.talkList[0].translate_task.play = 1					
					if(!this.loading){
						this.dealDictInfo(this.talkList[0].translate_task.translated)						
					}						
				}	
				// console.log("translate::",this.talkList)				
				callback && callback()//如果回调函数存在，则执行该回调函数
			},
			pushWelcomeItem(){
				if(!this.endding){
					this.talkList.push({
						id:0,
						show_in_list:true,
						score: null,
						taskid: "0",
						translate_task:{
							id:0,
							show_source_text: false,
							current: true,
							word_count:30,
							play:0,
							translated: "Hello everyone, I am English assistant Jenny. You can press and hold the 'Speak' button below and speak to me in Chinese. I will help you translate it into English."
						}
					})					
					// console.log('this.talkList',this.talkList)
				}
			},
			radiochange(index){
				if(this.talkList[index].delChoosed==false){
					this.talkList[index].delChoosed = true
					this.refresh = false
					this.refresh = true
					this.delList.push(this.talkList[index]._id)
					// console.log(this.delList)
				}else{
					this.talkList[index].delChoosed=false
					this.refresh = false
					this.refresh = true
					let newList = []
					this.delList.forEach((item,iindex)=>{
						if(item!==this.talkList[index]._id){
							newList.push(item)
							// console.log(this.delList)
						}
						if(this.delList.length === iindex+1){
							this.delList = newList
							// console.log(this.delList)
						}
					})
				}
			},
			chooseItem(index){
				// console.log(index)
				if(index===1){
					this.inDelChoose = true
					this.refresh = false
					this.refresh = true
				}
			},
			dealInnerAudioContext(index){
				if(this.talkList[index].translate_task.current==false){
					this.talkList.forEach((item,iindex)=>{
						this.talkList[iindex].translate_task.current=false
					})
					this.talkList[index].translate_task.current=true
				}				
				if(this.inDelChoose){
					this.radiochange(index)
				}else{
					//0停止 1播放 2暂停
					// console.log('this.talkList[index]',this.talkList[index])
					if(this.talkList[index].translate_task.play == 0){
						this.globalAudioContext.stop()
						this.talkList.forEach((item,iindex)=>{
							this.talkList[iindex].translate_task.play = 0
						})	
						let _this = this
						plugin.textToSpeech({
						    lang: "en_US",
						    tts: true,
						    content: _this.talkList[index].translate_task.translated,
						    success: function(res) {
						        // console.log("succ tts", res.filename)
								_this.globalAudioContext.src = res.filename
								// console.log('this.globalAudioContext.src',_this.globalAudioContext.src)
								_this.globalAudioContext.play()
								_this.talkList[index].translate_task.play = 1
								_this.refresh = false
								_this.refresh = true
						    },
						    fail: function(res) {
						        console.log("fail tts", res)
						    }
						})
					}
					else if(this.talkList[index].translate_task.play == 1){
						this.globalAudioContext.pause()
						this.talkList[index].translate_task.play = 2
						this.refresh = false
						this.refresh = true
					}
					else{
						this.globalAudioContext.play()
						this.talkList[index].translate_task.play = 1
						this.refresh = false
						this.refresh = true
					}
				}
			},
			async delItem(){
				if(this.delList.length==0){
					uni.showToast({
						title:"请选择删除内容",
						duration:1000
					})
				}
				else{
					this.sending = true
					// console.log("transList",this.delList)
					const res = await uniCloud.callFunction({
						name: 'info',
						data: {
							action: 'appinfo/del',
							data: {
								"transList":this.delList
							}
						}
					})
					// console.log('1',res.data.translate)
					if(res.result.succeed){
						this.sending = false
						uni.showToast({
							title:"删除成功",
							duration:1000
						})
						this.delList = []
						setTimeout(()=>{//0.7秒延迟
							uni.reLaunch({
								url:"/pages/index/index"
							})					
						},700)
					}
				}
			}, 
			streamRecord(lang,id){
				this.globalAudioContext.stop()
				this.currentRecorder = id
				this.onTalking = true
				this.showOverlay = true
				// console.log('=======开始====')
				manager.start({
					lang: lang//'zh_CN',//'zh_HK'
				})
			},
			endStreamRecord(id){
				this.currentRecorder = id
				this.onTalking = false
				this.showOverlay = false
				// console.log('=======结束====')
				manager.stop()
			}, 
			async CompareText(id,text){
				// console.log('CompareText',id,text)
				this.sending = true
				const res = await uniCloud.callFunction({
					name: 'info',
					data: {
						action: 'appinfo/compare',
						data: {
							"text":text,
							"id":id
						}
					}
				})				
				this.sending = false
				if(res.result.succeed){
					const talkIndex = this.talkList.findIndex((item) => {return item.translate_task._id === id})	
					// console.log('compare::',res.result)
					this.talkList[talkIndex].score = res.result.compare					
					this.showRate = true
					this.currentRate = res.result.currentCompare
					setTimeout(()=>{
						this.showRate = false
					},1000)
				}else{
					// console.log('compare::',res.result)
					uni.showToast({
						title:res.result.reason,
						duration:3000
					})
				}
			},
			//			
			skipAds(){
				if(this.vasusage.level){
					if(parseInt(this.model1.userInfo.current_vasusage_level)>=1){
						// console.log('current_vasusage_level::',parseInt(this.model1.userInfo.current_vasusage_level))
						this.loading = false
					}
				}
				if(uni.getStorageSync('adsTime')){//
					if(uni.getStorageSync('adsTime').getTime()+3600000 > new Date().getTime()){
						this.loading = false
					}
				}
			},
			onCountdownChange(e){
				this.countdown = e.seconds
			},
			skiploading(currentAds){
				this.loading = false
				if(currentAds.onetime){
					let onetimeActivedList = []
					if(uni.getStorageSync('adsOnetimeActivedList')){//如果存在，取回缓存中的adsOnetimeActivedList 已阅读一次性通知内容
						onetimeActivedList = uni.getStorageSync('adsOnetimeActivedList')
					}	
					onetimeActivedList.push(currentAds.sn)//将其加入已读
					uni.setStorageSync('adsOnetimeActivedList',onetimeActivedList)//更新已读缓存
				}
				uni.setStorageSync('adsTime',new Date())//更新广告时间
				if(this.talkList.length==1&&this.talkList[0].id==0){
					this.globalAudioContext.stop()	
					this.globalAudioContext.play()	
				}
			},
			adsRandomChoose(){
				if(uni.getStorageSync('ads')){//如果缓存存在ads广告列表
					// console.log('ads',uni.getStorageSync('ads'))
					const adsList = uni.getStorageSync('ads')//取回缓存中的ads广告列表
					let onetimeActivedList = []//设置一个已阅读一次性通知内容空集
					if(uni.getStorageSync('adsOnetimeActivedList')){//如果存在，取回缓存中的adsOnetimeActivedList 已阅读一次性通知内容
						onetimeActivedList = uni.getStorageSync('adsOnetimeActivedList')
					}	
					// onetimeActivedList = uni.getStorageSync('adsOnetimeActivedList')
					let onetimeAds = []//设置待使用一次性通知空集
					let randomAds = []//设置随机广告空集
					adsList.forEach((item,index)=>{//广告列表遍历开始
						const adsIndex = onetimeActivedList.findIndex((ads) => {return ads === item.sn})//遍历中确认该对象在已读一次性通知中的位置
						if(!item.onetime&&item.actived){//如果该对象【不】是一次性，且激活中
							randomAds.push(item)//将其推送到随机广告集合
						}
						if(item.onetime&&item.actived && adsIndex ==-1){//若该对象是一次性，且激活中，且未读
							onetimeAds.push(item)//将其推送到待使用一次性通知集合
						}
						
						if(index==adsList.length-1){//当该条对象是最后一个时
							if(onetimeAds.length>0){//如果一次性通知集合【不】为0条
								this.currentAds = onetimeAds[0]//设置全局实时广告为一次性通知集合的第一个对象								
								// console.log('更新已读缓存',onetimeActivedList)
							}
							else{//如果一次性通知集合为0条
								const randomNum = Math.floor(Math.random()*randomAds.length)//生成一个小于随机广告集合条数的随机数
								this.currentAds = randomAds[randomNum]//随机指定全局实时广告为一条随即广告
								// console.log('随机指定全局实时广告为一条随即广告',this.currentAds)
							}
						}
						
					})
				}else{//如果缓存不存在ads
					let Ads = this.membershipRules.yingyuAds
					uni.setStorageSync('ads',Ads)
				}
			},
			//
			async wxpay(type){
				// console.log('type：',type)
				let order_no = new Date().getTime().toString()
				let out_trade_no = order_no+(Math.floor(Math.random()*(999999-100000))+100000).toString()
				// 打开支付收银台
				let res = await uniPayCo.createOrder({
					provider: "wxpay", // 支付供应商
					total_fee: this.membershipRules[type].price, // 支付金额，单位分 100 = 1元
					type: "appleiap", // 支付回调类型
					order_no: order_no, // 业务系统订单号
					out_trade_no: out_trade_no, // 插件支付单号
					description: this.membershipRules[type].orderdesc, // 支付描述
					openid:this.model1.userInfo.wx_openid.mp,
					custom: {
						owner: this.model1.userInfo._id,
						vasusage_ids: this.model1.userInfo.vasusage_ids,
						vasid: this.model1.userInfo.current_vasusage_id,
						level:this.membershipRules[type].nexttype
					}, // 自定义数据
				});
				const requestPayment = await uni.requestPayment({
				    provider: 'wxpay',
					timeStamp: res.order.timeStamp,
					nonceStr: res.order.nonceStr,
					package: res.order.package,
					signType: 'MD5',
					paySign: res.order.paySign,
					success: function (ress) {
						// console.log('success:' + JSON.stringify(ress));
						uni.showToast({
							title:"会员已升级",
							duration:1000
						})
						setTimeout(()=>{//0.4秒延迟
							uni.reLaunch({
								url:"/pages/index/index"
							})					
						},400)
					},
					fail:function (err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},
			async verifiGiftCard(code){
				if((parseInt(this.model1.userInfo.current_vasusage_level)>1)&&this.giftcardOverwrite==false){
					uni.showToast({
						title:"礼品卡低于您的会员等级，再次发送将覆盖您的等级",
						duration:3000
					})
					this.giftcardOverwrite = true
				}
				else{
					this.sending = true
					const res = await uniCloud.callFunction({
						name: 'info',
						data: {
							action: 'appinfo/verifiGiftCard',
							data: {
								code
							}
						}
					})
					if(res.result.succeed){
						this.sending = false
						uni.showToast({
							title:"兑换成功",
							duration:1000
						})
						setTimeout(()=>{//0.7秒延迟
							uni.reLaunch({
								url:"/pages/index/index"
							})					
						},700)
					}else{
						this.sending = false
					}
				}
			},
			async sponsorRefresh(){
				const res = await uniCloud.callFunction({
					name: 'info',
					data: {
						action: 'appinfo/sponsorRefresh',
						data: {}
					}
				})
				// console.log('sponsorRefresh',res.result)
			},
			async vasIntial(callback){
				const res = await uniCloud.callFunction({
					name: 'info',
					data: {
						action: 'appinfo/vasIntial',
						data: {}
					}
				})
				// console.log('vasIntial',res.result)
				callback && callback()//如果回调函数存在，则执行该回调函数
			},
			async userinfo(callback){
				const res = await uniCloud.callFunction({
					name: 'info',
					data: {
						action: 'appinfo/userinfo',
						data: {}
					}
				})
				// console.log('userinfo',res.result)
				if(res.result.succeed){
					this.model1.userInfo = res.result.user
					uni.setStorageSync('user',this.model1.userInfo)
					// console.log('model1',this.model1.userInfo)
					if(!this.model1.userInfo.nickname){
						this.model1.userInfo.nickname = this.randomNames.fristName[Math.floor(Math.random()*this.randomNames.fristName.length)]+this.randomNames.theAnd[Math.floor(Math.random()*this.randomNames.theAnd.length)]+this.randomNames.secondaryName[Math.floor(Math.random()*this.randomNames.secondaryName.length)]
					}
					if(this.model1.userInfo.mobile){
						this.settedPhone = true
					}
					if(!this.model1.userInfo.avatar_in_pending){
						this.isavatarInPending = false
					}
					if(res.result.user.current_vasusage_id){
						const vasinfo = await db.collection('vasusage').where({'_id':res.result.user.current_vasusage_id}).get()
						this.vasusage = vasinfo.result.data[0]
						// console.log('vasinfo::',this.vasusage)						
					}
					callback && callback()//如果回调函数存在，则执行该回调函数
				}else{
					_this.sending = false
					console.log('报错了::',res);
					uni.showToast({
						title:res.result.reason,
						duration:3000
					})
				}
			},
			async bindchooseavatar(e){
				let _this = this
				const uploadavatar = await uniCloud.uploadFile({
					filePath: e.detail.avatarUrl,
					cloudPath: e.detail.avatarUrl.split('/')[e.detail.avatarUrl.split('/').length - 1],
					onUploadProgress: function(progressEvent) {
					  // console.log(progressEvent);
					  var percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					  );
					},
				})
				_this.model1.userInfo.avatar = uploadavatar.fileID
				const res = await uniCloud.callFunction({
					name: 'info',
					data: {
						action: 'appinfo/avatarSet',
						data: {
							"avatar":_this.model1.userInfo.avatar
						}
					}
				})
				if(res.result.succeed){
					_this.sending = false
					_this.isavatarInPending = true
					setTimeout(()=>{//2秒延迟
						_this.userinfo()//更新审核状态
					},2000)	
				}else{
					_this.sending = false
					console.log('报错啦::',res);
					uni.showToast({
						title:res.result.reason,
						duration:3000
					})
				}
			},
			comingSoon(){
				uni.showToast({
					title:"敬请期待..."
				})
			},			
			async InvitationCount(){
				const InvitationCount = await uniIdCo.getInvitedUser({
					level:1,
					limit:20,
					offset:0,
					needTotal:true
				})
				// console.log('邀请::',InvitationCount);
				InvitationCount.invitedUser.forEach(item=>{
					this.inviteList.push(item.nickname)
				})
				this.model1.userInfo.promotionCount = InvitationCount.total
			},
			subscribeMessage(tmplIds){
				uni.requestSubscribeMessage({
					tmplIds: tmplIds,
					success(ress) {
						if(JSON.stringify(ress).indexOf('reject')>-1){
							uni.showToast({
								title:'取消将无法接收礼品卡密',
								duration:5000
							})
						}else{
							// console.log('订阅::',ress);
						}
					}
				})
			},
			onclickSieve(){
				setTimeout(()=>{//0.5秒延迟
					this.randomSet()
				},500)
				if(this.clickSieve == false){
					this.clickSieve = true
					setTimeout(()=>{//0.5秒延迟
						this.clickSieve = false
					},500)
				}
			},
			randomSet(callback){
				this.model1.userInfo.nickname = this.randomNames.fristName[Math.floor(Math.random()*this.randomNames.fristName.length)]+this.randomNames.theAnd[Math.floor(Math.random()*this.randomNames.theAnd.length)]+this.randomNames.secondaryName[Math.floor(Math.random()*this.randomNames.secondaryName.length)]
				this.model1.userInfo.avatar = this.randomAvators[Math.floor(Math.random()*this.randomAvators.length)]
				callback && callback()//如果回调函数存在，则执行该回调函数
			},
			async submitProfile(){
				this.sending = true
				if(!this.model1.userInfo.nickname){
					this.sending = false
					uni.showToast({
						title:'取个厉害的昵称'
					})
				}
				else if(uni.getStorageSync('user').nickname == this.model1.userInfo.nickname){
					this.sending = false
					uni.showToast({
						title:'昵称未修改'
					})
				}
				else{
					let userProfile = {
						"nickname":this.model1.userInfo.nickname,
						"avatar":this.model1.userInfo.avatar
					}
					const res = await uniCloud.callFunction({
						name: 'info',
						data: {
							action: 'appinfo/nicknameSet',
							data:userProfile
						}
					})
					// console.log(userProfile,res)
					if(res.result.succeed){
						this.sending = false
						if(uni.getStorageSync('user').nickname){
							uni.showToast({
								title:'更新成功'
							})
						}
						this.userinfo() 
					}else{
						this.sending = false
						uni.showToast({
							title:res.data.reason,
							duration:2000
						})
					}
				}
			},
			async getAccountInfo(){
				//获取账户简略信息
				const accountInfo = await uniIdCo.getAccountInfo()
				// console.log('accountInfo:::',accountInfo)
				if(accountInfo.isMobileBound){
					this.settedPhone = true
				}
				if(!accountInfo.isNicknameSet){
					this.randomSet(()=>{
						this.submitProfile()
					})
				}
			},
			async getPhoneNumberAndSubmit(e){
				//微信手机号
				if(e.detail.errMsg == 'getPhoneNumber:fail user deny'){
					uni.showToast({
						title:"授权可保护账号",
						duration:3000
					})
				}else{
					const checkSession = await uni.checkSession()
					if(checkSession.errMsg === "checkSession:ok"){
						// console.log('errMsg:::',e,e.detail.code)
						const phone = await uniIdCo.bindMobileByMpWeixin({
							code:e.detail.code
						})
						// console.log('errMsg:::',phone)
						if(phone.errCode == 0){
							uni.showToast({
								title:'更新成功'
							})
							this.vasIntial(()=>{
								this.sponsorRefresh()
								this.userinfo()
							})
							this.settedPhone = true
						}
					}else{
						this.weChatSignin()
					}
				}
			},  
			async weChatSignin(callback){
				//登录，并将jwt存入Storage
				try{
					const loginRes = await uni.login({
						 provider: 'weixin'
					});	
					const code = loginRes.code
					let inviteCode = ''
					if(this.inviteCode){
						inviteCode = this.inviteCode
					}
					const res = await uniIdCo.loginByWeixin({
						code,
						inviteCode
					})
					uni.setStorageSync('uid',res.uid)
					// console.log('InviteCode',res);
					callback && callback()//如果回调函数存在，则执行该回调函数
					// return {token:res.newToken.token,uid:res.uid}
				}catch(e){
					return e
				}
			},
			async info(callback) {
				const res = await uniCloud.callFunction({
					name: 'http',
					data: {
						action: 'http/appinfo',
						data: {}
					}
				})
				this.membershipRules = res.result.data.membership
				this.hundred = res.result.data.hundred
				uni.setStorageSync('ads',res.result.data.yingyuAds)
				this.globalSetting = res.result.data.setting
				this.randomAvators = res.result.data.randomAvators
				this.randomNames = res.result.data.randomNames
				const aiAvatar = res.result.data.aiAvatar
				const randomNum = Math.floor(Math.random()*aiAvatar.length)//生成一个小于随机广告集合条数的随机数
				this.aiAvatar = aiAvatar[randomNum]//随机指定全局实时广告为一条随即广告
				callback && callback()//如果回调函数存在，则执行该回调函数
				
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: rgb(35,69,53);
	}
	.scroll-Y {
		margin: 10rpx 0 20rpx;
		width: 700rpx;		
	}
	.toparea{
			position: fixed;
			top: 0;
			padding-top: 200rpx;
			width: 750rpx;
			z-index: 199;
			background-color: rgba(#FFF,0.01);
			transition: background-color 0.5s;
		}
		.bgColor{
			background-color: rgba(#FFF,0.7);
			transition: background-color 0.5s;
		}

	.red-dot{
	  animation:fade 1500ms infinite;
	  -webkit-animation:fade 1500ms infinite;
	}
	@keyframes fade {
	  from { opacity: 1.0; }
	  50% { opacity: 0.4; }
	  to { opacity: 1.0; }
	}
	@-webkit-keyframes fade {
	  from { opacity: 1.0; }
	  50% { opacity: 0.4; }
	  to { opacity: 1.0; }
	}
</style>
