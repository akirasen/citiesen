'use strict';

const configCenter = require('uni-config-center')

class TaskConfig {

  constructor(options) {
    this._dcloudAppid = options.dcloudAppid
    this._appid = options.appid
    this._secret = options.secret
    this._platform = options.platform
    this._tasks = options.tasks
    this._timeout = 1000 * 10
  }

  get dcloudAppid() {
    return this._dcloudAppid
  }

  get appid() {
    return this._appid
  }

  get secret() {
    return this._secret
  }

  get platform() {
    return this._platform
  }

  get tasks() {
    return this._tasks
  }
}

class ConfigBase {

  constructor() {
    const uniIdConfig = configCenter({
      pluginId: 'uni-id'
    })
    const openBridgeConfig = configCenter({
      pluginId: 'uni-open-bridge'
    })

    this._uniId = uniIdConfig.config()
    this._openBridge = openBridgeConfig.config()

    this._ready = true
  }

  getAppConfig(appid) {
    if (Array.isArray(this._uniId)) {
      return this._uniId.find((item) => {
        return (item.dcloudAppid === appid)
      })
    }

    if (this._uniId.dcloudAppid === appid) {
      return this._uniId
    }

    return null
  }

  inWhiteList(ip) {
    return (this.ipWhiteList.indexOf(ip) > -1)
  }

  get openBridge() {
    return this._openBridge
  }

  get ipWhiteList() {
    return this._openBridge.ipWhiteList
  }

  get ready() {
    return this._ready
  }
}

class OpenBridgeConfig extends ConfigBase {

  constructor() {
    super()

    this._tasks = []

    this.resolve()
  }

  get tasks() {
    return this._tasks
  }

  resolve() {
    this._tasks.length = 0

    const appids = Object.keys(this.openBridge.schedule)

    for (let i = 0; i < appids.length; i++) {
      const appid = appids[i]
      let appConfig = this.getAppConfig(appid)

      if (appConfig != null) {
        const schedule = this.openBridge.schedule[appid]
        if (schedule) {
          this.resolveSchedule(appid, appConfig, schedule)
        }
      }
    }
  }

  resolveSchedule(dcloudAppid, appConfig, schedule) {
    if (schedule.enable !== true) {
      return
    }

    const schedulePlatforms = Object.keys(schedule)

    for (let i = 0; i < schedulePlatforms.length; i++) {
      const platformName = schedulePlatforms[i]
      const scheduleTask = schedule[platformName]

      if (!scheduleTask.enable) {
        continue
      }

      if (!this.isSupport(platformName)) {
        continue
      }

      this._tasks.push({
        dcloudAppid: dcloudAppid,
        platform: platformName,
        tasks: scheduleTask.tasks
      })
    }
  }

  isSupport(platformName) {
    return (OpenBridgeConfig.Support_Platforms.indexOf(platformName) >= 0)
  }
}

OpenBridgeConfig.Support_Platforms = ['weixin-mp', 'weixin-h5']


module.exports = {
  OpenBridgeConfig
};
