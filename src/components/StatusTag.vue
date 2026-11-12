<template>
  <el-tag :type="meta.type" effect="light" size="small" round>{{ meta.label }}</el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { REFUND_STATUS } from '@/utils/constants'

const props = defineProps<{ status: number }>()
const meta = computed(() => REFUND_STATUS[props.status] ?? { label: `未知(${props.status})`, type: 'info' as const })
</script>