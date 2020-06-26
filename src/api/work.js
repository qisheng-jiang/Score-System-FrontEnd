import request from '@/utils/request'

export function getWork() {
  return request({
    url: `/WorkInfo`,
    method: 'get'
  })
}

export function addWork(data) {
  return request({
    url: '/AddWork',
    method: 'post',
    params: data
  })
}

export function updateWork(id, data) {
  return request({
    url: `/AddWork/${id}`,
    method: 'put',
    params: data
  })
}

export function deleteWork(id) {
  return request({
    url: `/DeleteWork/${id}`,
    method: 'get'
  })
}
