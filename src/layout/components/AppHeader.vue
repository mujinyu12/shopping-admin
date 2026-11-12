<template>
  <header class="header">
    <div class="header__left">
      <button class="header__collapse" type="button" @click="app.toggleSidebar()">
        <el-icon :size="18">
          <component :is="app.collapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </button>
      <el-breadcrumb :separator-icon="ArrowRight" class="header__breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item">{{ item }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header__right">
      <el-tooltip content="刷新当前页" placement="bottom">
        <button class="header__icon" type="button" @click="reload">
          <el-icon :size="17"><Refresh /></el-icon>
        </button>
      </el-tooltip>

      <el-dropdown trigger="click" @command="onCommand">
        <div class="header__user">
          <el-avatar :size="30" class="header__avatar">{{ firstChar }}</el-avatar>
          <span class="header__name">{{ user.username || '管理员' }}</span>
          <el-icon :size="12"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>角色：管理员</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const app = useAppStore()
const user = useUserStore()
const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const list: string[] = []
  route.matched.forEach((record) => {
    const title = record.meta?.title as string | undefined
    if (title && !list.includes(title)) list.push(title)
  })
  return list
})

const firstChar = computed(() => (user.username || '管').slice(0, 1).toUpperCase())

function reload() {
  // 把当前地址作为参数带上，/redirect 中转页据此跳回来。
  // 不能只写 path: '/redirect'：那样回来时不知道原页面在哪，
  // 而且 replace 成功不会抛错，catch 里的 location.reload() 永远不会执行。
  router
    .replace({ path: '/redirect', query: { target: route.fullPath, t: Date.now() } })
    .catch(() => location.reload())
}

async function onCommand(command: string) {
  if (command !== 'logout') return
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'warning' })
  } catch {
    return
  }
  await user.logout()
  ElMessage.success('已退出登录')
  router.replace('/login')
}
</script>

<style scoped lang="scss">
.header {
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--ink-100);

  &__left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  &__collapse {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid var(--ink-100);
    background: #fff;
    color: var(--ink-500);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.18s var(--ease);

    &:hover {
      color: var(--brand-600);
      border-color: var(--brand-200);
      background: var(--brand-50);
    }
  }

  &__breadcrumb {
    font-size: 13px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--ink-500);
    cursor: pointer;
    display: grid;
    place-items: center;

    &:hover {
      background: var(--ink-50);
      color: var(--brand-600);
    }
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 4px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.18s var(--ease);

    &:hover {
      background: var(--ink-50);
    }
  }

  &__avatar {
    background: linear-gradient(135deg, var(--brand-400), var(--brand-600));
    color: #fff;
    font-weight: 600;
  }

  &__name {
    font-size: 13px;
    color: var(--ink-700);
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>