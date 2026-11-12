import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: localStorage.getItem('admin:collapsed') === '1',
    pageTitle: ''
  }),
  actions: {
    toggleSidebar() {
      this.collapsed = !this.collapsed
      localStorage.setItem('admin:collapsed', this.collapsed ? '1' : '0')
    },
    setTitle(title: string) {
      this.pageTitle = title
      document.title = title ? `${title} · 慕今予商城运营后台` : '慕今予商城 · 运营后台'
    }
  }
})