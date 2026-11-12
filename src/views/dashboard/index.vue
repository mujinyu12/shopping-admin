<template>
  <div class="page">
    <section class="hero">
      <div class="hero__text">
        <p class="hero__eyebrow">DASHBOARD</p>
        <h1>你好，{{ user.username || '管理员' }} 👋</h1>
        <p class="hero__sub">今天也来看看店铺的经营情况吧。</p>
        <div class="hero__actions">
          <el-button type="primary" @click="router.push('/goods/list')">管理商品</el-button>
          <el-button @click="router.push('/service/refund')">处理退款</el-button>
        </div>
      </div>
      <div class="hero__art">
        <div class="hero__ring hero__ring--1" />
        <div class="hero__ring hero__ring--2" />
        <el-icon :size="54"><ShoppingCartFull /></el-icon>
      </div>
    </section>

    <section class="stats">
      <article v-for="card in cards" :key="card.label" class="stat" :style="{ '--accent': card.color }">
        <div class="stat__icon"><el-icon :size="20"><component :is="card.icon" /></el-icon></div>
        <div class="stat__meta">
          <span class="stat__label">{{ card.label }}</span>
          <strong class="stat__value">{{ card.value }}</strong>
          <span class="stat__hint">{{ card.hint }}</span>
        </div>
      </article>
    </section>

    <section class="surface surface--pad">
      <div class="flex-between">
        <div>
          <h3 class="section-title">最新退款申请</h3>
          <p class="section-sub">最近的退款单会出现在这里，点击「去审批」处理</p>
        </div>
        <el-button link type="primary" @click="router.push('/service/refund')">查看全部</el-button>
      </div>

      <el-table v-loading="loading" :data="refunds" class="mt-16">
        <el-table-column label="退款单号" min-width="180">
          <template #default="{ row }">
            <span class="text-mono">{{ row.refundNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="130">
          <template #default="{ row }"><b>{{ money(row.amount) }}</b></template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
        <el-table-column label="申请时间" width="180">
          <template #default="{ row }">{{ datetime(row.createTime) }}</template>
        </el-table-column>
        <template #empty>
          <el-empty description="还没有退款申请" :image-size="80" />
        </template>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { searchAdmins } from '@/api/system'
import { searchGoods } from '@/api/goods'
import { searchRefunds } from '@/api/refund'
import { money, datetime } from '@/utils/format'
import StatusTag from '@/components/StatusTag.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const refunds = ref<Array<Record<string, any>>>([])
const loading = ref(false)
const counts = ref({ admin: 0, goods: 0, refund: 0, pending: 0 })

const cards = computed(() => [
  { label: '管理员', value: counts.value.admin, hint: '个后台账号', icon: 'User', color: '#0ea5a4' },
  { label: '商品总数', value: counts.value.goods, hint: '个在售 / 全部商品', icon: 'Goods', color: '#2e90fa' },
  { label: '退款单', value: counts.value.refund, hint: '张累计退款单', icon: 'RefreshLeft', color: '#f79009' },
  { label: '待审批', value: counts.value.pending, hint: '张等待处理', icon: 'Bell', color: '#f04438' }
])

onMounted(async () => {
  loading.value = true
  try {
    const [admins, goods, all, pending] = await Promise.allSettled([
      searchAdmins({ page: 1, size: 1 }),
      searchGoods({ page: 1, size: 1 }),
      searchRefunds({ page: 1, size: 5 }),
      searchRefunds({ page: 1, size: 1, status: 0 })
    ])
    if (admins.status === 'fulfilled') counts.value.admin = admins.value.total
    if (goods.status === 'fulfilled') counts.value.goods = goods.value.total
    if (all.status === 'fulfilled') {
      counts.value.refund = all.value.total
      refunds.value = all.value.list || []
    }
    if (pending.status === 'fulfilled') counts.value.pending = pending.value.total
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  padding: 30px 34px;
  color: #e6fffb;
  background:
    radial-gradient(700px 300px at 85% 0%, rgba(126, 240, 234, 0.35), transparent 60%),
    linear-gradient(120deg, #0b1220 0%, #0f2b2f 55%, #0d3a38 100%);
  box-shadow: var(--shadow-md);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__eyebrow {
    font-size: 11px;
    letter-spacing: 0.3em;
    color: rgba(126, 240, 234, 0.7);
    margin-bottom: 10px;
  }

  h1 {
    font-size: 26px;
    color: #fff;
    letter-spacing: -0.01em;
  }

  &__sub {
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.66);
    font-size: 13px;
  }

  &__actions {
    margin-top: 22px;
    display: flex;
    gap: 10px;
  }

  &__art {
    position: relative;
    width: 180px;
    height: 140px;
    display: grid;
    place-items: center;
    color: rgba(255, 255, 255, 0.85);
  }

  &__ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(126, 240, 234, 0.35);

    &--1 {
      width: 120px;
      height: 120px;
    }
    &--2 {
      width: 168px;
      height: 168px;
      border-style: dashed;
      opacity: 0.55;
      animation: spin 26s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat {
  position: relative;
  display: flex;
  gap: 14px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: #fff;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(16, 24, 40, 0.04);
  overflow: hidden;
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);

  &::after {
    content: '';
    position: absolute;
    inset: auto -30px -40px auto;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &__icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, #fff);
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 3px;
    z-index: 1;
  }

  &__label {
    font-size: 12px;
    color: var(--ink-400);
  }

  &__value {
    font-size: 26px;
    font-weight: 700;
    color: var(--ink-900);
    line-height: 1.1;
  }

  &__hint {
    font-size: 11px;
    color: var(--ink-300);
  }
}

.section-title {
  font-size: 15px;
  color: var(--ink-800);
}

.section-sub {
  margin-top: 5px;
  font-size: 12px;
  color: var(--ink-400);
}

@media (max-width: 1180px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>