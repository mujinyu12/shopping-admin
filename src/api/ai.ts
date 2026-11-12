import { del, get, post, put } from './request' // 从请求封装模块导入四个HTTP方法
// 只导入类型：import type编译后会被擦除，不产生运行时代码；
// Faq=FAQ实体，MpPage=分页结构，SensitiveWord=敏感词实体
import type { Faq, MpPage, SensitiveWord } from './types'

/* -------------------------------- FAQ -------------------------------- */
// 导出分页搜索FAQ的函数
// 参数：page 页码、size 每页条数、categoryId 可选分类
export function searchFaq(params: { page: number; size: number; categoryId?: number }) {
  // 发GET请求到/faq/search，params会作为URL查询参数；泛型表示期望后端返回分页后的Faq列表
  return get<MpPage<Faq>>('/faq/search', params)
}
// 导出新增FAQ的函数；data是完整的Faq对象，将作为请求体
export function addFaq(data: Faq) {
  // 发POST请求到/faq/add，data作为JSON请求体；泛型string表示期望返回字符串
  return post<string>('/faq/add', data)
}
// 导出更新FAQ的函数；data为要更新的Faq对象
export function updateFaq(data: Faq) {
  // 发PUT到/faq/update，data作为请求体；泛型null表示期望无业务数据返回，仅表示操作成功
  return put<null>('/faq/update', data)
}
// 导出删除FAQ的函数；id为字符串类型主键
export function deleteFaq(id: string) {
  // 发DELETE到/faq/delete，把id作为参数传给后端；泛型null表示期望无业务数据返回
  return del<null>('/faq/delete', { id }) 
}

/* ------------------------------ 敏感词 ------------------------------ */
// 导出分页搜索敏感词的函数；参数：page 页码、size 每页条数、word 可选关键词、type 可选类型
export function searchWords(params: { page: number; size: number; word?: string; type?: string }) {
  // 发GET到/sensitiveWord/search，params作查询参数；泛型表示期望返回分页后的SensitiveWord列表
  return get<MpPage<SensitiveWord>>('/sensitiveWord/search', params)
}
// 导出新增敏感词的函数；data为SensitiveWord对象，作为请求体
export function addWord(data: SensitiveWord) {
  // 发POST到/sensitiveWord/add，data作为JSON请求体；泛型null表示期望无业务数据返回
  return post<null>('/sensitiveWord/add', data)
}
// 导出删除敏感词的函数；id为数字类型主键
export function deleteWord(id: number) {
  // 发DELETE到/sensitiveWord/delete，传id；泛型string表示期望返回字符串
  return del<string>('/sensitiveWord/delete', { id })
}