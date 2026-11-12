<template>
  <aside class="sidebar" :class="{ 'is-collapsed': app.collapsed }">
    <div class="sidebar__brand">
      <div class="sidebar__logo">百</div>
      <transition name="fade-slide">
        <div v-if="!app.collapsed" class="sidebar__title">
          <strong>慕今予商城</strong>
          <span>运营后台</span>
        </div>
      </transition>
    </div>

    <el-scrollbar class="sidebar__scroll">
      <el-menu
        :default-active="activePath"
        :collapse="app.collapsed"
        :collapse-transition="false"
        router
        class="sidebar__menu"
      >
        <template v-for="section in sections" :key="section.name">
          <div v-if="section.name && !app.collapsed" class="sidebar__group">{{ section.name }}</div>
          <el-menu-item v-for="item in section.items" :key="item.path" :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>

    <div class="sidebar__footer" v-if="!app.collapsed">
      <span class="dot" /> 服务运行中
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { layoutChildren } from '@/router/routes'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const app = useAppStore()
const user = useUserStore()
const route = useRoute()

interface MenuItem {
  path: string
  title: string
  icon: string
}

const sections = computed(() => {
  const groups: Array<{ name: string; items: MenuItem[] }> = []
  layoutChildren.forEach((record) => {
    const meta = record.meta || {}
    if (meta.hidden) return
    if (!user.has(meta.permission as string | undefined)) return
    const groupName = (meta.group as string) || ''
    let group = groups.find((g) => g.name === groupName)
    if (!group) {
      group = { name: groupName, items: [] }
      groups.push(group)
    }
    group.items.push({
      path: `/${record.path}`,
      title: (meta.title as string) || '',
      icon: (meta.icon as string) || 'Menu'
    })
  })
  return groups
})

const activePath = computed(() => route.path)
</script>

<style scoped lang="scss">
.sidebar {
  width: 236px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  color: #cbd5e1;
  background:
    radial-gradient(600px 200px at 0% 0%, rgba(14, 165, 164, 0.28), transparent 65%),
    linear-gradient(180deg, #0b1220 0%, #111c30 100%);
  transition: width 0.24s var(--ease);
  border-right: 1px solid rgba(255, 255, 255, 0.04);

  &.is-collapsed {
    width: 72px;
  }

  &__brand {
    height: 68px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 18px;
  }

  &__logo {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-weight: 700;
    color: #06201f;
    background: linear-gradient(135deg, #7ef0ea, #14b8b4);
    box-shadow: 0 6px 18px -8px rgba(20, 184, 180, 0.9);
  }

  &__title {
    display: flex;
    flex-direction: column;
    line-height: 1.2;

    strong {
      color: #fff;
      font-size: 15px;
      letter-spacing: 0.04em;
    }
    span {
      font-size: 11px;
      color: rgba(203, 213, 225, 0.6);
      letter-spacing: 0.18em;
    }
  }

  &__scroll {
    flex: 1;
  }

  &__group {
    padding: 18px 22px 6px;
    font-size: 11px;
    letter-spacing: 0.16em;
    color: rgba(148, 163, 184, 0.55);
  }

  &__menu {
    border-right: none;
    background: transparent;
    --el-menu-bg-color: transparent;
    --el-menu-hover-bg-color: rgba(255, 255, 255, 0.06);
    --el-menu-text-color: #cbd5e1;
    --el-menu-active-color: #ffffff;
    padding: 0 10px;
  }

  &__footer {
    padding: 14px 22px;
    font-size: 12px;
    color: rgba(203, 213, 225, 0.6);
    display: flex;
    align-items: center;
    gap: 8px;

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.16);
    }
  }
}

:deep(.el-menu-item) {
  height: 44px;
  margin: 2px 0;
  border-radius: 10px;
  font-size: 14px;

  &.is-active {
    background: linear-gradient(90deg, rgba(14, 165, 164, 0.9), rgba(14, 165, 164, 0.55));
    box-shadow: 0 8px 20px -12px rgba(14, 165, 164, 0.9);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 3px;
      height: 18px;
      border-radius: 0 4px 4px 0;
      background: #a7f3d0;
    }
  }
}
</style>