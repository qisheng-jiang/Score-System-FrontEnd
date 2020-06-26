import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/AreaInfo',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/AddArea',
    method: 'post',
    params: data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/AddArea/${id}`,
    method: 'put',
    params: data
  })
}

export function deleteRole(id) {
  return request({
    url: `/DeleteArea/${id}`,
    method: 'get'
  })
}

export function resetPassword(data) {
  return request({
    url: `/ResetPassword`,
    method: 'post',
    params: data
  })
}
