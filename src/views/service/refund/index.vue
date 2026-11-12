<template>
  <div class="page">
    <PageHeader title="退款审批" description="通过后调用微信退款，回调成功时自动回补秒杀库存并关闭订单">
      <el-button :icon="Refresh" @click="reload">刷新</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <div class="filters">
        <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 180px">
          <el-option v-for="item in REFUND_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>

      <AppTable ref="tableRef" :request="searchRefunds" :filters="filters">
        <el-table-column label="退款单号" min-width="190">
          <template #default="{ row }"><code class="mono">{{ row.refundNo }}</code></template>
        </el-table-column>
        <el-table-column label="订单号" min-width="190">
          <template #default="{ row }"><span class="mono text-muted">{{ row.orderId }}</span></template>
        </el-table-column>
        <el-table-column label="金额" width="130">
          <template #default="{ row }"><b class="amount">{{ money(row.amount) }}</b></template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
        <el-table-column label="原因" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ row.reason || '—' }}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="170">
          <template #default="{ row }">{{ datetime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
            <template v-if="row.status === 0 || row.status === 4">
              <el-button link type="success" :disabled="row.status === 4" @click="openAudit(row, true)">通过</el-button>
              <el-button link type="danger" :disabled="row.status === 4" @click="openAudit(row, false)">驳回</el-button>
            </template>
            <el-button
              v-else-if="row.status === 3"
              link
              type="warning"
              disabled
              title="已驳回的退款单需要用户重新申请"
            >
              已驳回
            </el-button>
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <AuditDialog v-model="auditVisible" :refund="current" :approved="approved" @done="reload" />
    <RefundDetail v-model="detailVisible" :record="current" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import StatusTag from '@/components/StatusTag.vue'
import AuditDialog from './AuditDialog.vue'
import RefundDetail from './RefundDetail.vue'
import { searchRefunds } from '@/api/refund'
import { REFUND_STATUS_OPTIONS } from '@/utils/constants'
import { datetime, money } from '@/utils/format'
import type { Refund } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const filters = reactive<{ status?: number }>({ status: undefined })
const auditVisible = ref(false)
const detailVisible = ref(false)
const approved = ref(true)
const current = ref<Refund | null>(null)

function reload() {
  tableRef.value?.reload()
}

function openAudit(row: any, pass: boolean) {
  current.value = row
  approved.value = pass
  auditVisible.value = true
}

function openDetail(row: any) {
  current.value = row
  detailVisible.value = true
}
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.mono {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
}

.amount {
  color: #d92d20;
}
</style>