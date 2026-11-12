<template>
  <div class="redirect" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

/**
 * 刷新中转页。
 *
 * 头部「刷新」按钮上来先跳到 /redirect，本页再立刻跳回原地址。
 * 这一去一回会让当前页面组件卸载后重新挂载，onMounted 里的数据请求自然会重新执行，
 * 效果等同按 F5，但不会把整个 SPA 重新加载一遍（不白屏、不丢路由状态）。
 *
 * 之前没有这个路由，跳过去只会命中末尾的 /:pathMatch(.*)* 兜底，于是刷新一下就变成 404。
 */
const route = useRoute()
const router = useRouter()

const target = typeof route.query.target === 'string' && route.query.target ? route.query.target : '/'

router.replace(target)
</script>

<style scoped>
.redirect {
  height: 100%;
}
</style>