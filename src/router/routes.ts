import type { RouteRecordRaw } from 'vue-router'

export interface MenuMeta {
  [key: string]: unknown
  title: string
  icon?: string
  group?: string
  permission?: string
  hidden?: boolean
}

/**
 * 路由即菜单：侧边栏和面包屑都由这份配置生成，
 * 新增页面只改这一处（meta.group 决定归到哪个分组下）。
 */
export const layoutChildren: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: '数据概览', icon: 'Odometer', group: '' }
  },
  {
    path: 'system/admin',
    name: 'AdminList',
    component: () => import('@/views/system/admin/index.vue'),
    meta: { title: '管理员', icon: 'User', group: '系统管理', permission: '/admin/search' }
  },
  {
    path: 'system/role',
    name: 'RoleList',
    component: () => import('@/views/system/role/index.vue'),
    meta: { title: '角色', icon: 'Avatar', group: '系统管理', permission: '/role/search' }
  },
  {
    path: 'system/permission',
    name: 'PermissionList',
    component: () => import('@/views/system/permission/index.vue'),
    meta: { title: '权限', icon: 'Key', group: '系统管理' }
  },
  {
    path: 'goods/brand',
    name: 'BrandList',
    component: () => import('@/views/goods/brand/index.vue'),
    meta: { title: '品牌管理', icon: 'CollectionTag', group: '商品中心' }
  },
  {
    path: 'goods/types',
    name: 'TypeList',
    component: () => import('@/views/goods/types/index.vue'),
    meta: { title: '商品分类', icon: 'Files', group: '商品中心' }
  },
  {
    path: 'goods/spec',
    name: 'SpecList',
    component: () => import('@/views/goods/spec/index.vue'),
    meta: { title: '规格管理', icon: 'Operation', group: '商品中心' }
  },
  {
    path: 'goods/list',
    name: 'GoodsList',
    component: () => import('@/views/goods/list/index.vue'),
    meta: { title: '商品列表', icon: 'Goods', group: '商品中心' }
  },
  {
    path: 'goods/seckill',
    name: 'SeckillList',
    component: () => import('@/views/goods/seckill/index.vue'),
    meta: { title: '秒杀活动', icon: 'AlarmClock', group: '商品中心' }
  },
  {
    path: 'market/advert',
    name: 'AdvertList',
    component: () => import('@/views/market/advert/index.vue'),
    meta: { title: '广告位', icon: 'Picture', group: '营销中心' }
  },
  {
    path: 'service/refund',
    name: 'RefundList',
    component: () => import('@/views/service/refund/index.vue'),
    meta: { title: '退款审批', icon: 'RefreshLeft', group: '售后服务', permission: '/admin/refund' }
  },
  {
    path: 'service/ai',
    name: 'AiKnowledge',
    component: () => import('@/views/service/ai/index.vue'),
    meta: { title: 'AI 知识库', icon: 'Collection', group: '售后服务' }
  }
]

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: layoutChildren
  },
  // 头部「刷新」按钮的中转路由：跳过来再跳回去，让当前页面组件重新挂载。
  // 必须放在末尾的通配路由之前，否则 /redirect 会先被 /:pathMatch(.*)* 吃掉，直接显示 404。
  {
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@/views/redirect/index.vue'),
    meta: { title: '刷新中', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在', hidden: true }
  }
]