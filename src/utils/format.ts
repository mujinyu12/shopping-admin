/** 金额：6999 → ￥6,999.00 */
export function money(value?: number | string | null) {
  const n = Number(value ?? 0)
  if (Number.isNaN(n)) return '￥0.00'
  return `￥${n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** 日期：兼容 Java Date 序列化的毫秒数与 ISO 字符串 */
export function datetime(value?: string | number | Date | null) {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`
}

export function shortId(id?: string | number) {
  if (!id) return '-'
  const text = String(id)
  return text.length > 12 ? `${text.slice(0, 6)}…${text.slice(-4)}` : text
}