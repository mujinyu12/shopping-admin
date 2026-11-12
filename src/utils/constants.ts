import type { TagProps } from 'element-plus'

/** 退款单状态：0 待审核 1 退款中 2 已退款 3 已驳回 4 退款失败 */
export const REFUND_STATUS: Record<number, { label: string; type: TagProps['type']; hint: string }> = {
  0: { label: '待审核', type: 'warning', hint: '等待运营审批' },
  1: { label: '退款中', type: 'primary', hint: '已提交微信，等待回调' },
  2: { label: '已退款', type: 'success', hint: '资金已原路退回' },
  3: { label: '已驳回', type: 'info', hint: '审批未通过，订单已恢复' },
  4: { label: '退款失败', type: 'danger', hint: '微信退款失败，可重新审批' }
}

/** 订单状态（后端 Orders.status） */
export const ORDER_STATUS: Record<number, string> = {
  1: '未付款',
  2: '已付款',
  3: '未发货',
  4: '已发货',
  5: '交易成功',
  6: '交易关闭',
  7: '待评价',
  8: '退款中',
  9: '已退款'
}

/** FAQ 分类 */
export const FAQ_CATEGORY: Record<number, string> = {
  1: '订单问题',
  2: '支付问题',
  3: '商品问题',
  4: '账户问题',
  5: '其他问题'
}

export const REFUND_STATUS_OPTIONS = Object.entries(REFUND_STATUS).map(([value, item]) => ({
  value: Number(value),
  label: item.label
}))