import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/RewardInfo',
    method: 'get',
    params: query
    // query
  })
}

export function createArticle(data) {
  return request({
    url: '/AddReward',
    method: 'post',
    params: data
  })
}

export function updateArticle(id, data) {
  return request({
    url: `/AddReward/${id}`,
    method: 'put',
    params: data
  })
}

export function deleteArticle(id) {
  return request({
    url: `/DeleteReward/${id}`,
    method: 'get'
  })
}

export function areaConfirmArticle(id) {
  return request({
    url: `/AreaCheck/${id}`,
    method: 'get'
  })
}

export function rootConfirmArticle(id) {
  return request({
    url: `/RootCheck/${id}`,
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

export function getRuleList() {
  return request({
    url: '/GetRuleList',
    method: 'get'
  })
}
