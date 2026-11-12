import { get, post, form } from './request' // 从请求封装模块导入三个HTTP方法

/** 登录：Spring Security formLogin，必须用 x-www-form-urlencoded 提交 */
export function login(username: string, password: string) {
  return post<null>('/admin/login', form({ username, password }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

/** 当前登录管理员用户名 */
export function getUsername() {
  return get<string>('/admin/getUsername')
}
// 导出获取当前用户权限列表的函数
export function getPermissions() {
  return get<string[]>('/admin/permissions')
}
// 导入登出函数
export function logout() {
  return post<null>('/admin/logout')
}