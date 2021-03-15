import request from '@/utils/request'
// 登录的api接口
export function login(data) {
  return request({
    // mock的
    // url: '/vue-admin-template/user/login',
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}
// 自动登录的时候获取的用户信息的api接口
export function getInfo(token) {
  return request({
    // mock的
    // url: '/vue-admin-template/user/info',
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}
// 退出的接口
export function logout() {
  return request({
    // mock的
    // url: '/vue-admin-template/user/logout',
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
