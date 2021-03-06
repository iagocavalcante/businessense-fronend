import axios from 'axios'

const login = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    commit('auth_request')
    axios(
      {
        url: `${process.env.VUE_APP_HOST}/user/login`,
        data: user,
        method: 'POST'
      })
      .then(resp => {
        if (resp.data.status) {
          const token = resp.data.account.token
          const user = resp.data.account
          window.localStorage.setItem('token', token)
          window.localStorage.setItem('accountId', user.ID)
          axios.defaults.headers.common['Authorization'] = token
          commit('auth_success', token, user)
          resolve(resp)
        } else {
          reject(new Error(resp.data.message))
        }
      })
      .catch(err => {
        commit('auth_error')
        localStorage.removeItem('token')
        reject(err)
      })
  })
}

export default {
  login
}