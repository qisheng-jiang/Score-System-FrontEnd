import request from '@/utils/request'

export function getGroup(id) {
  return request({
    url: `/GroupInfo/${id}`,
    method: 'get'
  })
}

export function addGroup(data) {
  return request({
    url: '/AddGroup',
    method: 'post',
    params: data
  })
}

export function updateGroup(id, data) {
  return request({
    url: `/AddGroup/${id}`,
    method: 'put',
    params: data
  })
}

export function deleteGroup(id) {
  return request({
    url: `/DeleteGroup/${id}`,
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

export function getAreaList() {
  return request({
    url: `/GetAreaList`,
    method: 'get'
  })
}
