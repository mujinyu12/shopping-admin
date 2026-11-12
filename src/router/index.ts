import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import { routes } from '../router/routes'
import { useUserStore } from '@/stores/user'

NProgress.configure({ showSpinner: false, trickleSpeed: 120 })

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

const WHITE_LIST = ['/login', '/404']

router.beforeEach(async (to) => {
  NProgress.start()
  const user = useUserStore()

  // 首次进入（含刷新）用 Session Cookie 恢复登录态
  if (!user.initialized) {
    await user.loadProfile()
  }

  if (WHITE_LIST.includes(to.path)) {
    if (to.path === '/login' && user.isLogged) return { path: '/' }
    return true
  }

  if (!user.isLogged) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 菜单级权限：无权限的页面直接跳 403 提示
  const permission = to.meta?.permission as string | undefined
  if (permission && !user.has(permission)) {
    return { path: '/dashboard' }
  }

  return true
})

router.afterEach((to) => {
  const title = (to.meta?.title as string) || ''
  document.title = title ? `${title} · 慕今予商城运营后台` : '慕今予商城 · 运营后台'
  NProgress.done()
})

router.onError(() => NProgress.done())

export default router