// 导入axios本体+两个类型：AxiosError（错误对象类型）、AxiosRequestConfig（请求配置类型）
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
// 导入Element Plus的消息提示组件，用于统一弹错误提示
import { ElMessage } from 'element-plus'
// 导入全局路由实例，用于401时跳登录页
import router from '@/router'
// 仅导入类型：ApiEnvelope描述后端统一响应体{code, message, data}
import type { ApiEnvelope } from './types'

/**
 * 后台接口实例
 * 后端所有响应都是 { code, message, data }，这里统一解包成 data，
 * 业务代码里就不用每次都写 res.data.data 了。
 */
// 创建一个独立的axios实例，避免污染全局axios默认配置
const http = axios.create({
  // 基础路径：优先读取环境变量VITE_API_BASE，没配则用/api（配合Vite代理）
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  // 请求超时20秒
  timeout: 20000,
  // 允许跨域时携带Cookie
  withCredentials: true // 后台是 Session（JSESSIONID）认证，必须带 Cookie
})

let lastErrorAt = 0 // 记录上次弹提示的时间戳，用于节流
function toast(message: string) { // 内部函数：统一弹错误提示
  // 简单节流，避免并发请求同时 401 时刷屏
  const now = Date.now() // 当前时间戳
  if (now - lastErrorAt < 800) return // 距上次提示不足800ms则直接丢弃，防止多个请求同时失败弹出一堆
  lastErrorAt = now // 更新上次提示时间
  ElMessage.error(message) // 弹出错误信息
}
// 内部函数：跳转登录页
function goLogin() {
  if (router.currentRoute.value.path !== '/login') { //已经在登录页就不跳，避免重复导航
    // 用replace跳登录页，并把当前完整路径放进redirect查询参数，登录后可回跳
    router.replace({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
  }
}
// 注册响应拦截器：所有经过http的请求都会先走这里
http.interceptors.response.use(
  (response) => { // 成功分支
    const body = response.data as ApiEnvelope<unknown> | unknown // 取出响应体
    // 用'code' in body 判断是否为统一包装结构
    if (body && typeof body === 'object' && 'code' in (body as ApiEnvelope<unknown>)) {
      const envelope = body as ApiEnvelope<unknown> // 断言为包装类型
      if (envelope.code !== 200) { // 业务代码非200视为业务失败
        toast(envelope.message || '请求失败') // 弹后端返回的错误信息，没有就用兜底信息
        if (envelope.code === 401) goLogin() // 业务码401也跳登录页
        // 转成rejected Promise，请调用方catch或.catch能感知
        return Promise.reject(new Error(envelope.message || `业务异常(${envelope.code})`))
      }
      // 成功则只返回data，实现“自动解包”；as never是为了绕过axios的类型约束
      return envelope.data as never
    }
    return body as never // 不是包装结构（如文本流、纯文本）则原样返回
  },
  (error: AxiosError<ApiEnvelope<unknown>>) => { // 失败分支
    const status = error.response?.status // HTTP状态码，网络错误时为undefined
    const message = error.response?.data?.message // 后端响应里的message
    if (status === 401) { // 未登录 或 Session过期
      toast('登录状态已失效，请重新登录')
      goLogin() // 跳登录页面
    } else if (status === 403) { // 已登录但无权限
      toast('没有权限执行该操作')
    } else if (status) { // 其他HTTP错误码
      toast(message || `请求失败（HTTP ${status}）`)
    } else {// 没有status；网络中断、超时、后端没启动等
      toast('网络异常，请检查后端服务是否启动')
    }
    return Promise.reject(error) // 继续向上抛，调用方可按需处理
  }
)
// 封装GET：泛型T为期望返回的数据类型
export function get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig) {
  // params作为query string传入；双重断言修正返回类型为Promise<T> 
  return http.get(url, { params, ...config }) as unknown as Promise<T>
}
// 封装POET：data作为请求体
export function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  // 直接透传data和config，返回类型断言为Promise<T>
  return http.post(url, data, config) as unknown as Promise<T>
}
// 封装PUT：data作为请求体
export function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  // 直接透传data和config，返回类型断言为Promise<T>
  return http.put(url, data, config) as unknown as Promise<T>
}
// 封装DELETE：但是第二个参数是params而不是data
export function del<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig) {
  // 参数走query string（如?id=xxx），而不是请求体
  return http.delete(url, { params, ...config }) as unknown as Promise<T>
}

/** 表单方式提交（后端的 @RequestParam 接口都用这个） */
// 工具函数：把普通对象转成URLSearchParams(x-www-form-urlencoded)
export function form(data: Record<string, unknown>) {  
  return new URLSearchParams( // URLSearchParams序列化后就是a=1&b=2格式
    Object.entries(data) // 把对象转成[key,value]数组
      .filter(([, v]) => v !== undefined && v !== null) // 过滤掉undefined和null，避免出现remark=undefined这种脏数据
      .map(([k, v]) => [k, String(v)]) // 所有值统一转成字符串（布尔true -> "true"， 数字1->"1"）
  )
}

export default http // 默认导出原始axios实例，供需要自定义配置（如取消、原始response）的场景直接使用