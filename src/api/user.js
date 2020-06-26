import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/Login',
    // url: '/vue-admin-template/user/login',
    // method: 'get'
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/Info',
    // url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/Logout',
    method: 'post'
  })
}
