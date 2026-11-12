import { del, form, get, post, put } from './request'
import type { Brand, Goods, MpPage, ProductType, SeckillGoods, Specification } from './types'

/* -------------------------------- 品牌 -------------------------------- */
export function searchBrands(params: { page: number; size: number; name?: string }) {
  return get<MpPage<Brand>>('/brand/search', params)
}
export function allBrands() {
  return get<Brand[]>('/brand/all')
}
export function addBrand(data: Brand) {
  return post<null>('/brand/add', data)
}
export function updateBrand(data: Brand) {
  return put<null>('/brand/update', data)
}
export function deleteBrand(id: number) {
  return del<null>('/brand/delete', { id })
}

/* ------------------------------ 商品类型 ------------------------------ */
export function searchTypes(params: { page: number; size: number; name?: string }) {
  return get<MpPage<ProductType>>('/productType/search', params)
}
export function typesByParent(parentId: number) {
  return get<ProductType[]>('/productType/findByParentId', { parentId })
}
export function addType(data: ProductType) {
  return post<null>('/productType/add', data)
}
export function updateType(data: ProductType) {
  return put<null>('/productType/update', data)
}
export function deleteType(id: number) {
  return del<null>('/productType/delete', { id })
}

/* -------------------------------- 规格 -------------------------------- */
export function searchSpecs(params: { page: number; size: number }) {
  return get<MpPage<Specification>>('/specification/search', params)
}
export function getSpec(id: number) {
  return get<Specification>('/specification/findById', { id })
}
export function specsByType(id: number) {
  return get<Specification[]>('/specification/findByProductTypeId', { id })
}
export function addSpec(data: Specification) {
  return post<null>('/specification/add', data)
}
export function updateSpec(data: Specification) {
  return put<null>('/specification/update', data)
}
export function deleteSpec(ids: number[]) {
  return del<null>('/specification/delete', { ids: ids.join(',') })
}
/** 后端 SpecificationOptions 的字段是 specId + optionName(String[]) */
export function addSpecOption(specId: number, optionNames: string[]) {
  return post<null>('/specification/addOption', { specId, optionName: optionNames })
}
export function deleteSpecOption(ids: number[]) {
  return del<null>('/specification/deleteOption', { ids: ids.join(',') })
}

/* -------------------------------- 商品 -------------------------------- */
export function searchGoods(params: Record<string, unknown>) {
  return get<MpPage<Goods>>('/goods/search', params)
}
export function getGoods(id: number) {
  return get<Goods>('/goods/findById', { id })
}
export function addGoods(data: Goods) {
  return post<null>('/goods/add', data)
}
export function updateGoods(data: Goods) {
  return put<null>('/goods/update', data)
}
export function putAwayGoods(id: number, isMarketable: boolean) {
  return put<null>('/goods/putAway', form({ id, isMarketable }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

/* ------------------------------ 秒杀商品 ------------------------------ */
export function searchSeckill(params: { page: number; size: number }) {
  return get<MpPage<SeckillGoods>>('/seckillGoods/findPage', params)
}
export function addSeckill(data: SeckillGoods) {
  return post<null>('/seckillGoods/add', data)
}
export function updateSeckill(data: SeckillGoods) {
  return put<null>('/seckillGoods/update', data)
}