import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const TokenKey2 = 'vue_admin_template_userid'

export function getToken2() {
  return Cookies.get(TokenKey2)
}

export function setToken2(token2) {
  return Cookies.set(TokenKey2, token2)
}

export function removeToken2() {
  return Cookies.remove(TokenKey)
}
