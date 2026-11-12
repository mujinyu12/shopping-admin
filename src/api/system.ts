import { del, form, get, post, put } from './request' //导入请求方法 
// 仅导入类型：Admin=管理员、MpPage=分页结构、Permission=权限、Role=角色
import type { Admin, MpPage, Permission, Role } from './types' 

/* ------------------------------- 管理员 ------------------------------- */
// 导出分页搜索管理员函数；参数page/size必填，username可选关键字（模糊搜索）
export function searchAdmins(params: { page: number; size: number; username?: string }) {
  // 发GET到/admin/search，params作查询参数；泛型表示期望返回分页后的管理员列表
  return get<MpPage<Admin>>('/admin/search', params)
}
// 导出新增管理员函数；data为完整Admin对象，作JSON请求体
export function addAdmin(data: Admin) {
  // 发POST到/admin/update，data作JSON请求体；泛型null表示成功时无业务数据返回
  return post<null>('/admin/add', data)
}
// 导出更新管理员函数；data为Admin对象
export function updateAdmin(data: Admin) {
  return put<null>('/admin/update', data) // 发PUT到/admin/update，data作JSON请求体；泛型null表示无返回数据
}
// 导出删除管理员函数；aid为数字类型主键
export function deleteAdmin(aid: number) {
  return del<null>('/admin/delete', { aid }) // 发DELETE到/admin/delete
}
// 导出按id查询单个管理员函数
export function getAdmin(aid: number) {
  return get<Admin>('/admin/findById', { aid }) // 发GET到/admin/findById，aid作查询函数；
}
// 导出“给管理员分配角色”函数；adi=管理员id，rids=角色id数组
export function updateAdminRoles(aid: number, rids: number[]) {
  return put<null>('/admin/updateRoleToAdmin', form({ aid, rids: rids.join(',') }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

/* -------------------------------- 角色 -------------------------------- */
// 导出分页搜索角色函数；只有page/size，无搜索关键词
export function searchRoles(params: { page: number; size: number }) {
  return get<MpPage<Role>>('/role/search', params)
}
// 导出“查全部角色”函数，无参数（用于下拉框/多选框选项）
export function allRoles() {
  return get<Role[]>('/role/findAll')
}
// 新增角色函数；data为Role对象，作JSON请求体
export function addRole(data: Role) {
  return post<null>('/role/add', data)
}
// 更新角色函数
export function updateRole(data: Role) {
  return put<null>('/role/update', data)
}
// 删除角色函数；rid为角色主键
export function deleteRole(rid: number) {
  return del<null>('/role/delete', { rid })
}
// 按id查询单个角色函数
export function getRole(rid: number) {
  return get<Role>('/role/findById', { rid })
}
// 给角色分配权限函数，rid=角色id，pids=权限id数组
export function updateRolePermissions(rid: number, pids: number[]) {
  return put<null>('/role/updatePermissionToRole', form({ rid, pids: pids.join(',') }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

/* -------------------------------- 权限 -------------------------------- */
// 分页搜索权限函数
export function searchPermissions(params: { page: number; size: number }) {
  return get<MpPage<Permission>>('/permission/search', params)
}
// 查询全部权限函数
export function allPermissions() {
  return get<Permission[]>('/permission/findAll') // 返回权限数组
}
// 新增权限函数，data为Permission对象，JSON请求体
export function addPermission(data: Permission) {
  return post<null>('/permission/add', data)
}
// 更新权限函数
export function updatePermission(data: Permission) {
  return put<null>('/permission/update', data)
}
// 删除权限函数；pid为权限主键
export function deletePermission(pid: number) {
  return del<null>('/permission/delete', { pid })
}