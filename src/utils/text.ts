/**
 * 富文本 → 纯文本。
 * 秒杀活动介绍等字段历史上被存成了带 <p>/<img> 的 HTML，直接塞进 textarea 会看到一堆标签，
 * 这里统一转成可编辑的纯文本（保留段落换行）。
 *
 * keepImages=true 时把 <img> 换成「[图片] 地址」，避免图片信息被静默丢掉（管理端编辑用）。
 */
export function htmlToText(input?: string | null, opts?: { keepImages?: boolean }): string {
  const s = String(input ?? '')
  if (!s) return ''
  if (!looksLikeHtml(s)) return s.trim()

  let text = s
  if (opts?.keepImages) {
    text = text.replace(/<img[^>]*?src\s*=\s*["']([^"']+)["'][^>]*>/gi, (_m, src: string) => `\n[图片] ${src}\n`)
  }
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** 是否含有 HTML 标签 */
export function looksLikeHtml(input?: string | null): boolean {
  return /<[a-z!/][^>]*>/i.test(String(input ?? ''))
}