import querystring from 'querystring'
import fetch from 'node-fetch'

export default class Api {
  constructor({ host = '' } = {}) {
    this.host = host
    this.paths = {
      api: {
        login: '/api/login/',
        password: {
          email: '/api/password/email',
          reset: '/api/password/reset'
        }
      }
    }
  }

  async request({ path = '', method = 'GET', body = {} } = {}) {
    const response = await fetch(`${this.host}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })

    if (!response.ok) {
      throw {
        name: `Error in request to ${path}`,
        code: response.status,
        message: response.statusText
      }
    }

    return response.json()
  }

  //user authorize jump to definition

  async login({ method = 'POST', email = '', password = '' } = {}) {
    const path = this.paths.api.login
    return this.request({ path, method, body: { email, password } })
  }

  async email({ method = 'POST', email = '' } = {}) {
    const path = this.paths.api.password.email

    return this.request({ path, method, body: { email } })
  }

  async reset({ method = 'POST', email, token, password, passwordConfirmation } = {}) {
    const path = this.paths.api.password.reset

    return this.request({ path, method, body: { email, token, password, passwordConfirmation } })
  }
}