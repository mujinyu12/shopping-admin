<template>
  <AppDialog v-model="visible" :title="approved ? '通过退款申请' : '驳回退款申请'" :loading="saving" @submit="submit">
    <div class="summary">
      <div class="summary__row">
        <span>退款单号</span>
        <code>{{ refund?.refundNo }}</code>
      </div>
      <div class="summary__row">
        <span>退款金额</span>
        <b class="amount">{{ money(refund?.amount) }}</b>
      </div>
      <div class="summary__row">
        <span>订单号</span>
        <code>{{ refund?.orderId }}</code>
      </div>
      <div class="summary__row">
        <span>申请原因</span>
        <span>{{ refund?.reason || '—' }}</span>
      </div>
    </div>

    <el-alert
      v-if="approved"
      type="warning"
      :closable="false"
      show-icon
      title="通过后将立即调用微信退款接口，资金原路退回，请确认金额无误"
      class="mb-12"
    />

    <el-input
      v-model="remark"
      type="textarea"
      :rows="3"
      maxlength="100"
      show-word-limit
      :placeholder="approved ? '审批备注（可选）' : '请填写驳回原因（用户可见）'"
    />
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import { auditRefund } from '@/api/refund'
import { money } from '@/utils/format'
import type { Refund } from '@/api/types'

const props = defineProps<{ modelValue: boolean; refund: Refund | null; approved: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'done'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const saving = ref(false)
const remark = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (open) remark.value = ''
  }
)

async function submit() {
  if (!props.refund) return
  if (!props.approved && !remark.value.trim()) {
    ElMessage.warning('驳回需要填写原因')
    return
  }
  saving.value = true
  try {
    const message = await auditRefund(props.refund.id, props.approved, remark.value || undefined)
    ElMessage.success(message || (props.approved ? '已提交退款' : '已驳回'))
    visible.value = false
    emit('done')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.summary {
  border: 1px solid var(--ink-100);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 14px;
  background: #fbfcfe;

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 0;
    font-size: 13px;

    > span:first-child {
      color: var(--ink-400);
    }

    code {
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 12px;
      color: var(--ink-600);
    }
  }
}

.amount {
  color: #d92d20;
}

.mb-12 {
  margin-bottom: 12px;
}
</style>