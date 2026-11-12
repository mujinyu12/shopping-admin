<template>
  <div class="page">
    <PageHeader title="秒杀活动" description="为商品配置限时秒杀价与库存，活动开始后按场次扣减库存">
      <el-button type="primary" :icon="Plus" @click="openCreate">新建活动</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <AppTable ref="tableRef" :request="searchSeckill">
        <el-table-column prop="id" label="场次" width="90" />
        <el-table-column label="商品" min-width="240">
          <template #default="{ row }">
            <div class="seckill-cell">
              <el-image :src="row.headerPic" fit="cover" class="seckill-cell__pic" />
              <div>
                <div class="seckill-cell__title">{{ row.title }}</div>
                <div class="seckill-cell__id">商品 ID {{ row.goodsId }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="150">
          <template #default="{ row }">
            <div class="seckill-price">{{ money(row.costPrice) }}</div>
            <div class="seckill-origin">原价 {{ money(row.price) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="130">
          <template #default="{ row }">
            <span class="stock">{{ row.stockCount }}</span>
            <span class="text-muted"> / {{ row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" min-width="230">
          <template #default="{ row }">
            <div class="time-line">{{ datetime(row.startTime) }}</div>
            <div class="time-line time-line--end">至 {{ datetime(row.endTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="phase(row).type" size="small">{{ phase(row).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <SeckillForm v-model="formVisible" :record="editing" @saved="reload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import SeckillForm from './SeckillForm.vue'
import { searchSeckill } from '@/api/goods'
import { datetime, money } from '@/utils/format'
import type { SeckillGoods } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const editing = ref<SeckillGoods | null>(null)

function reload() {
  tableRef.value?.reload()
}
function openCreate() {
  editing.value = null
  formVisible.value = true
}
function openEdit(row: any) {
  editing.value = { ...row }
  formVisible.value = true
}

function phase(row: any) {
  const now = Date.now()
  const start = row.startTime ? new Date(row.startTime).getTime() : 0
  const end = row.endTime ? new Date(row.endTime).getTime() : 0
  if (now < start) return { label: '未开始', type: 'info' as const }
  if (now > end) return { label: '已结束', type: 'info' as const }
  return { label: '进行中', type: 'success' as const }
}
</script>

<style scoped lang="scss">
.seckill-cell {
  display: flex;
  align-items: center;
  gap: 12px;

  &__pic {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    border: 1px solid var(--ink-100);
  }

  &__title {
    font-size: 13px;
    color: var(--ink-800);
  }

  &__id {
    font-size: 11px;
    color: var(--ink-300);
  }
}

.seckill-price {
  font-weight: 700;
  color: #d92d20;
}

.seckill-origin {
  font-size: 11px;
  color: var(--ink-300);
  text-decoration: line-through;
}

.stock {
  font-weight: 600;
  color: var(--ink-800);
}

.time-line {
  font-size: 12px;
  color: var(--ink-500);

  &--end {
    color: var(--ink-300);
  }
}
</style>