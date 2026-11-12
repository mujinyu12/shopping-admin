<template>
  <div class="not-found">
    <div class="not-found__code">404</div>
    <h2>页面走丢了</h2>
    <p>你访问的地址不存在，或者已经被移动到别处。</p>
    <el-button type="primary" @click="router.replace('/dashboard')">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped lang="scss">
.not-found {
  height: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;

  &__code {
    font-size: 96px;
    font-weight: 800;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, var(--brand-400), var(--brand-700));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  h2 {
    font-size: 20px;
    color: var(--ink-800);
  }

  p {
    color: var(--ink-400);
    margin-bottom: 12px;
  }
}
</style>