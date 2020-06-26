import request from '@/utils/request'

export function getRule() {
  return request({
    url: `/RuleInfo`,
    method: 'get'
  })
}

export function addRule(data) {
  return request({
    url: '/AddRule',
    method: 'post',
    params: data
  })
}

export function updateRule(id, data) {
  return request({
    url: `/AddRule/${id}`,
    method: 'put',
    params: data
  })
}

export function deleteRule(id) {
  return request({
    url: `/DeleteRule/${id}`,
    method: 'get'
  })
}
