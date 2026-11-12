import { del, form, get, post, put } from './request'
import type { Category, MpPage } from './types'

/** 广告位（后端沿用 Category 控制器，/category/**） */
// 分页查询广告
export function searchCategories(params: { page: number; size: number }) {
  return get<MpPage<Category>>('/category/search', params)
}
// 增加广告
export function addCategory(data: Category) {
  return post<null>('/category/add', data)
}
// 修改广告状态
export function updateCategory(data: Category) {
  return put<null>('/category/update', data)
}
// 根据ID删除广告
export function deleteCategories(ids: number[]) {
  return del<null>('/category/delete', { ids: ids.join(',') })
}
// 修改广告位状态
export function updateCategoryStatus(id: number, status: number) {
  return put<null>('/category/updateStatus', form({ id, status }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}