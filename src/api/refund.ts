import { form, get, post } from './request'
import type { PageData, Refund } from './types'

/** 退款单分页（仅管理员，需 /admin/refund 权限） */
export async function searchRefunds(params: { page: number; size: number; status?: number }) {
  const page = await get<{ total: number; page: number; size: number; list: Refund[] }>(
    '/admin/refund/findPage',
    params
  )
  return page
}

/** 审批：approved=true 通过（发起微信退款），false 驳回 */
export function auditRefund(id: string, approved: boolean, remark?: string) {
  return post<string>('/admin/refund/audit', form({ id, approved, remark }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export type { Refund, PageData }