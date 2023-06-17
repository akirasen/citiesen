'use strict';

const {
  getAccessToken,
  getTicket,
  PlatformType
} = require('uni-open-bridge-common')

const {
  Task
} = require('./basic.js')

class TaskAccessTokenMP extends Task {

  constructor(config) {
    super()

    this._config = config || null
  }

  async run() {
    const key = {
      dcloudAppid: this._config.dcloudAppid,
      platform: PlatformType.WEIXIN_MP
    }

    const result = await getAccessToken(key)

    console.log("setAccessToken...", key, result)
  }
}
TaskAccessTokenMP.ID = 'TaskAccessTokenMP'

class TaskAccessTokenH5 extends Task {

  constructor(config) {
    super()

    this._config = config || null
  }

  async run() {
    const key = {
      dcloudAppid: this._config.dcloudAppid,
      platform: PlatformType.WEIXIN_H5
    }

    const result = await getAccessToken(key)

    console.log("setAccessToken...", key, result)
  }
}
TaskAccessTokenH5.ID = 'TaskAccessTokenH5'

class TaskTicket extends Task {

  constructor(config) {
    super()

    this._config = config || null
  }

  async run() {
    const key = {
      dcloudAppid: this._config.dcloudAppid,
      platform: PlatformType.WEIXIN_H5
    }

    const result = await getTicket(key)

    console.log("setTicket...", key, result)
  }
}
TaskTicket.ID = 'TaskTicket'

module.exports = {
  TaskAccessTokenMP,
  TaskAccessTokenH5,
  TaskTicket
}
