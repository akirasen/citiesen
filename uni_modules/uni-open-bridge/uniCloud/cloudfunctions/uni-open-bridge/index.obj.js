'use strict';

const runTask = require('./index.task.js')
const command = require('./bridge.js')

async function executeCommand() {
  const methodName = this.getMethodName()
  const clientInfo = this.getClientInfo()

  let parameters
  if (clientInfo.source === 'http') {
    const postData = this.getHttpInfo().body
    if (!postData || postData.length < 4) {
      throw new Error('Invalid parameter(s)::' + postData)
    }
    parameters = JSON.parse(postData)
  } else if (clientInfo.source === 'function') {
    const args = this.getParams()
    parameters = args[0]
    if (args.length === 2) {
      parameters.value = args[1]
    }
    if (args.length === 3) {
      parameters.expiresIn = args[2]
    }
  } else {
    throw new Error('Invalid')
  }

  return await command.execute(methodName, parameters)
}

module.exports = {
  async _timing() {
    console.log('triggered by timing')
    await runTask()
  },
  async _before() {
    const clientInfo = this.getClientInfo()
    if (clientInfo.source === 'http' && !command.checkIP(clientInfo.clientIP)) {
      throw new Error('Invalid IP::' + clientInfo.clientIP)
    }
  },
  /// AccessToken
  async getAccessToken() {
    return await executeCommand.call(this)
  },
  async setAccessToken() {
    return await executeCommand.call(this)
  },
  async removeAccessToken() {
    return await executeCommand.call(this)
  },
  /// UserAccessToken
  async getUserAccessToken() {
    return await executeCommand.call(this)
  },
  async setUserAccessToken() {
    return await executeCommand.call(this)
  },
  async removeUserAccessToken() {
    return await executeCommand.call(this)
  },
  /// SessionKey
  async getSessionKey() {
    return await executeCommand.call(this)
  },
  async setSessionKey() {
    return await executeCommand.call(this)
  },
  async removeSessionKey() {
    return await executeCommand.call(this)
  },
  /// EncryptKey
  async getEncryptKey() {
    return await executeCommand.call(this)
  },
  async setEncryptKey() {
    return await executeCommand.call(this)
  },
  async removeEncryptKey() {
    return await executeCommand.call(this)
  },
  /// Ticket
  async getTicket() {
    return await executeCommand.call(this)
  },
  async setTicket() {
    return await executeCommand.call(this)
  },
  async removeTicket() {
    return await executeCommand.call(this)
  }
}
