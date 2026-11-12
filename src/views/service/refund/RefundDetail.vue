<template>
  <AppDialog v-model="visible" title="退款单详情" width="640px" confirm-text="关闭" @submit="visible = false">
    <el-descriptions v-if="record" :column="2" border>
      <el-descriptions-item label="退款单号" :span="2"><code>{{ record.refundNo }}</code></el-descriptions-item>
      <el-descriptions-item label="订单号" :span="2"><code>{{ record.orderId }}</code></el-descriptions-item>
      <el-descriptions-item label="退款金额"><b class="amount">{{ money(record.amount) }}</b></el-descriptions-item>
      <el-descriptions-item label="状态"><StatusTag :status="record.status" /></el-descriptions-item>
      <el-descriptions-item label="退款原因" :span="2">{{ record.reason || '—' }}</el-descriptions-item>
      <el-descriptions-item label="微信退款单号" :span="2">{{ record.wxRefundId || '—' }}</el-descriptions-item>
      <el-descriptions-item label="原订单状态">{{ ORDER_STATUS[record.orderStatusBefore || 0] || '—' }}</el-descriptions-item>
      <el-descriptions-item label="审批人">{{ record.auditBy || '—' }}</el-descriptions-item>
      <el-descriptions-item label="审批备注" :span="2">{{ record.auditRemark || '—' }}</el-descriptions-item>
      <el-descriptions-item label="申请时间">{{ datetime(record.createTime) }}</el-descriptions-item>
      <el-descriptions-item label="成功时间">{{ datetime(record.successTime) }}</el-descriptions-item>
    </el-descriptions>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import StatusTag from '@/components/StatusTag.vue'
import { ORDER_STATUS } from '@/utils/constants'
import { datetime, money } from '@/utils/format'
import type { Refund } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Refund | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
</script>

<style scoped lang="scss">
.amount {
  color: #d92d20;
}

code {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
}
</style>