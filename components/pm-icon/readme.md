# 使用说明

使用方法：

```
<template>
	<view class="content">
		<view class="icon">
		  <view class="title">
		    基础使用:
		  </view>
      <view class="data">
        <tn-icon icon="logo-tuniao"></tn-icon>
      </view>
		</view>
    <view class="icon">
      <view class="title">
        加粗使用:
      </view>
      <view class="data">
        <tn-icon icon="logo-tuniao" bold></tn-icon>
      </view>
    </view>
    <view class="icon">
      <view class="title">
        使用公共类:
      </view>
      <view class="data">
        <tn-icon icon="logo-tuniao" class-name="tuniao-color"></tn-icon>
      </view>
    </view>
    <view class="icon">
      <view class="title">
        显示图片:
      </view>
      <view class="data">
        <tn-icon icon="/static/logo108.png"></tn-icon>
      </view>
    </view>
    <view class="icon">
      <view class="title">
        默认尺寸:
      </view>
      <view class="data">
        <tn-icon icon="logo-tuniao" size="sm"></tn-icon>
        <tn-icon icon="logo-tuniao"></tn-icon>
        <tn-icon icon="logo-tuniao" size="lg"></tn-icon>
        <tn-icon icon="logo-tuniao" size="xl"></tn-icon>
        <tn-icon icon="logo-tuniao" size="80"></tn-icon>
      </view>
    </view>
    <view class="icon">
      <view class="title">
        默认尺寸:
      </view>
      <view class="data">
        <tn-icon icon="/static/logo108.png" size="sm"></tn-icon>
        <tn-icon icon="/static/logo108.png"></tn-icon>
        <tn-icon icon="/static/logo108.png" size="lg"></tn-icon>
        <tn-icon icon="/static/logo108.png" size="xl"></tn-icon>
        <tn-icon icon="/static/logo108.png" size="80"></tn-icon>
      </view>
    </view>
	</view>
</template>

<script>
  import TnIcon from '@/uni_modules/tuniaoui-icon/components/tuniaoui-icon/tuniaoui-icon.vue'
	export default {
    components: {
      TnIcon
    },
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.content {
    position: relative;
    padding: 30rpx;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .icon {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .data {
        margin-left: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .icon + .icon {
      margin-top: 20rpx;
    }
  }
</style>


```

参数说明：

| 参数       | 说明                                                 |
| :-------- | ---------------------------------------------------- |
| icon   | 图标名称，可以传入图片地址(支持jpg、jpeg、png, gif)                               |
| size   | 图标大小，如果是图片类型的图片则定义宽高(内置sm、lg、xl)                               |
| bold   | 是否加粗图标                               |
| imgMode   | 图片模式mode，当图片为图片时生效                               |
| top   | 垂直方向的偏移量，单位rpx                               |
| className   | 公共class名称                               |

## 图标预览

![](https://tnuiimage.tnkjapp.com/uniapp_market/single_component/tn-icon/icons2.jpg)
