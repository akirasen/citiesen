'use strict';

const {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getUserAccessToken,
  setUserAccessToken,
  removeUserAccessToken,
  getSessionKey,
  setSessionKey,
  removeSessionKey,
  getEncryptKey,
  setEncryptKey,
  removeEncryptKey,
  getTicket,
  setTicket,
  removeTicket
} = require('uni-open-bridge-common')

const {
  Command
} = require('./basic.js');

const {
  OpenBridgeConfig
} = require('./config.js')

const openBridgeConfig = new OpenBridgeConfig()

const Commands = [
  'getAccessToken',
  'setAccessToken',
  'removeAccessToken',
  'getUserAccessToken',
  'setUserAccessToken',
  'removeUserAccessToken',
  'getSessionKey',
  'setSessionKey',
  'removeSessionKey',
  'getEncryptKey',
  'setEncryptKey',
  'removeEncryptKey',
  'getTicket',
  'setTicket',
  'removeTicket'
]

class MainFrame extends Command {

  constructor() {
    super()

    Commands.forEach((name) => {
      this.register(name, this[name].bind(this))
    })
  }

  async getAccessToken(parameters) {
    return await getAccessToken(parameters)
  }

  async setAccessToken(parameters) {
    return await setAccessToken(parameters, parameters.value, parameters.expiresIn)
  }

  async removeAccessToken(parameters) {
    return await removeAccessToken(parameters)
  }

  async getUserAccessToken(parameters) {
    return await getUserAccessToken(parameters)
  }

  async setUserAccessToken(parameters) {
    return await setUserAccessToken(parameters, parameters.value, parameters.expiresIn)
  }

  async removeUserAccessToken(parameters) {
    return await removeUserAccessToken(parameters)
  }

  async getSessionKey(parameters) {
    return await getSessionKey(parameters, parameters.fallback || null)
  }

  async setSessionKey(parameters) {
    return await setSessionKey(parameters, parameters.value, parameters.expiresIn)
  }

  async removeSessionKey(parameters) {
    return await removeSessionKey(parameters)
  }

  async getEncryptKey(parameters) {
    return await getEncryptKey(parameters, null)
  }

  async setEncryptKey(parameters) {
    return await setEncryptKey(parameters, parameters.value, parameters.expiresIn)
  }

  async removeEncryptKey(parameters) {
    return await removeEncryptKey(parameters)
  }

  async getTicket(parameters) {
    return await getTicket(parameters, null)
  }

  async setTicket(parameters) {
    return await setTicket(parameters, parameters.value, parameters.expiresIn)
  }

  async removeTicket(parameters) {
    return await removeTicket(parameters)
  }

  checkIP(ip) {
    return openBridgeConfig.inWhiteList(ip)
  }
}

const mainFrame = new MainFrame();

module.exports = mainFrame;
