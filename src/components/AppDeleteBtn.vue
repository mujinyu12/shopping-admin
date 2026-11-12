<template>
  <el-popconfirm :title="title" confirm-button-text="删除" cancel-button-text="取消" width="240" @confirm="emit('confirm')">
    <template #reference>
      <el-button link type="danger">删除</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: '确定要删除吗？' })
const emit = defineEmits<{ (e: 'confirm'): void }>()
</script>