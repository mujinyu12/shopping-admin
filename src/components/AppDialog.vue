<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    destroy-on-close
    align-center
    @update:model-value="emit('update:modelValue', $event)"
    @closed="emit('closed')"
  >
    <slot />
    <template #footer>
      <div class="app-dialog__footer">
        <el-button @click="emit('update:modelValue', false)">取消</el-button>
        <el-button type="primary" :loading="loading" @click="emit('submit')">
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ modelValue: boolean; title: string; width?: string; loading?: boolean; confirmText?: string }>(),
  { width: '620px', loading: false, confirmText: '保存' }
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit'): void
  (e: 'closed'): void
}>()
</script>

<style scoped lang="scss">
.app-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>