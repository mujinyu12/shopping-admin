<template>
  <div class="login">
    <section class="login__brand">
      <div class="login__glow login__glow--one" />
      <div class="login__glow login__glow--two" />

      <div class="login__brand-inner">
        <div class="login__logo">慕</div>
        <h1>慕今予商城<br />运营管理平台</h1>
        <p class="login__slogan">商品 · 订单 · 售后 · AI 客服，一站式运营中台</p>

        <ul class="login__features">
          <li><el-icon><Goods /></el-icon> 商品与秒杀活动管理</li>
          <li><el-icon><RefreshLeft /></el-icon> 退款审批与微信退款</li>
          <li><el-icon><Collection /></el-icon> AI 知识库</li>
        </ul>

        <div class="login__footer">© {{ year }} 慕今予商城</div>
      </div>
    </section>

    <section class="login__panel">
      <div class="login__card">
        <header>
          <h2>欢迎回来</h2>
          <p>请使用管理员账号登录后台</p>
        </header>

        <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="onSubmit">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" clearable />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-button type="primary" class="login__submit" :loading="loading" @click="onSubmit">
            登 录
          </el-button>
        </el-form>

        <p class="login__hint">登录状态由 Session 维持，关闭浏览器后需要重新登录</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const year = new Date().getFullYear()
const form = reactive({ username: '', password: '' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await user.login(form.username, form.password)
    ElMessage.success('登录成功')
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.replace(redirect)
  } catch {
    // 错误提示已由 axios 拦截器统一处理
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  background: var(--ink-50);

  &__brand {
    position: relative;
    overflow: hidden;
    color: #e2e8f0;
    background:
      radial-gradient(900px 500px at 10% 0%, rgba(20, 184, 180, 0.35), transparent 60%),
      linear-gradient(160deg, #071018 0%, #0d1a2b 55%, #102438 100%);
    display: flex;
    align-items: center;
  }

  &__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.55;

    &--one {
      width: 320px;
      height: 320px;
      right: -80px;
      top: 18%;
      background: #0ea5a4;
    }
    &--two {
      width: 260px;
      height: 260px;
      left: -60px;
      bottom: 6%;
      background: #2563eb;
      opacity: 0.35;
    }
  }

  &__brand-inner {
    position: relative;
    z-index: 1;
    padding: 0 clamp(40px, 7vw, 96px);
    max-width: 620px;
  }

  &__logo {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    font-size: 24px;
    font-weight: 700;
    color: #04211f;
    background: linear-gradient(135deg, #8df3ed, #14b8b4);
    box-shadow: 0 14px 40px -16px rgba(20, 184, 180, 0.95);
    margin-bottom: 26px;
  }

  h1 {
    font-size: clamp(28px, 3vw, 40px);
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: #fff;
    font-weight: 700;
  }

  &__slogan {
    margin-top: 14px;
    color: rgba(226, 232, 240, 0.66);
    font-size: 14px;
    letter-spacing: 0.02em;
  }

  &__features {
    margin-top: 34px;
    display: flex;
    flex-direction: column;
    gap: 14px;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13.5px;
      color: rgba(226, 232, 240, 0.86);
    }

    .el-icon {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.08);
      color: #7ef0ea;
    }
  }

  &__footer {
    margin-top: 56px;
    font-size: 12px;
    color: rgba(148, 163, 184, 0.5);
    letter-spacing: 0.06em;
  }

  &__panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }

  &__card {
    width: 100%;
    max-width: 360px;

    header {
      margin-bottom: 26px;

      h2 {
        font-size: 24px;
        color: var(--ink-900);
        letter-spacing: -0.02em;
      }

      p {
        margin-top: 8px;
        font-size: 13px;
        color: var(--ink-400);
      }
    }
  }

  &__submit {
    width: 100%;
    height: 44px;
    margin-top: 6px;
    font-size: 15px;
    letter-spacing: 0.14em;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--brand-400), var(--brand-600));
    border: none;
    box-shadow: 0 14px 28px -16px rgba(14, 165, 164, 0.9);
  }

  &__hint {
    margin-top: 18px;
    font-size: 12px;
    color: var(--ink-300);
    text-align: center;
  }
}

@media (max-width: 960px) {
  .login {
    grid-template-columns: 1fr;

    &__brand {
      display: none;
    }
  }
}
</style>