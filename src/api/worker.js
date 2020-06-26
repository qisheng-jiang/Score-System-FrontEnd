import request from '@/utils/request'

export function getWorker(id) {
  return request({
    url: `/PearsonInfo/${id}`,
    method: 'get'
  })
}

export function addWorker(data) {
  return request({
    url: '/AddWorker',
    method: 'post',
    params: data
  })
}

export function updateWorker(id, data) {
  return request({
    url: `/AddWorker/${id}`,
    method: 'put',
    params: data
  })
}

export function deleteWorker(id) {
  return request({
    url: `/DeleteWorker/${id}`,
    method: 'get'
  })
}

export function getAreaList() {
  return request({
    url: `/GetAreaList`,
    method: 'get'
  })
}

export function getGroupList(id) {
  return request({
    url: `/GetGroupList/${id}`,
    method: 'get'
  })
}

export function getWorkList() {
  return request({
    url: `/GetWorkList`,
    method: 'get'
  })
}
