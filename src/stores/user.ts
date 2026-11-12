import { defineStore } from 'pinia'
import { getPermissions, getUsername, login as loginApi, logout as logoutApi } from '@/api/auth'

interface UserState {
  username: string
  permissions: string[] | null // null 表示后端未提供权限接口 → 全部可见
  initialized: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    username: '',
    permissions: null,
    initialized: false
  }),
  getters: {
    /** 是否已登录（有用户名即视为已登录） */
    isLogged: (state) => Boolean(state.username)
  },
  actions: {
    async login(username: string, password: string) {
      await loginApi(username, password)
      await this.loadProfile()
    },
    /** 刷新页面后靠 Session Cookie 恢复登录态 */
    async loadProfile() {
      try {
        const [name, perms] = await Promise.allSettled([getUsername(), getPermissions()])
        if (name.status === 'fulfilled') this.username = name.value || ''
        if (perms.status === 'fulfilled' && Array.isArray(perms.value)) {
          this.permissions = perms.value
        } else {
          this.permissions = null
        }
      } catch {
        this.username = ''
      } finally {
        this.initialized = true
      }
      return this.isLogged
    },
    async logout() {
      try {
        await logoutApi()
      } finally {
        this.$reset()
      }
    },
    /** 权限判断：后端未提供权限接口时默认放行 */
    has(permission?: string) {
      if (!permission) return true
      if (this.permissions === null) return true
      return this.permissions.includes(permission)
    }
  }
})