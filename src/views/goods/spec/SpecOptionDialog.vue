<template>
  <AppDialog v-model="visible" :title="`规格项 · ${specName}`" width="560px" @submit="add">
    <div class="add-row">
      <el-input v-model="optionName" placeholder="输入规格项，例如：曜石黑" maxlength="30" @keyup.enter="add" />
      <el-button type="primary" :loading="saving" @click="add">添加</el-button>
    </div>

    <div v-loading="loading" class="options">
      <div v-for="opt in options" :key="opt.id" class="option">
        <span>{{ opt.optionName }}</span>
        <el-button link type="danger" @click="remove(opt)">删除</el-button>
      </div>
      <el-empty v-if="!loading && !options.length" description="还没有规格项" :image-size="70" />
    </div>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import { addSpecOption, deleteSpecOption, getSpec } from '@/api/goods'
import type { SpecificationOption } from '@/api/types'

const props = defineProps<{ modelValue: boolean; specId: number; specName: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const options = ref<SpecificationOption[]>([])
const optionName = ref('')
const loading = ref(false)
const saving = ref(false)

async function load() {
  loading.value = true
  try {
    const detail = await getSpec(props.specId)
    options.value = detail?.specificationOptions ?? []
  } finally {
    loading.value = false
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      optionName.value = ''
      load()
    }
  }
)

async function add() {
  if (!optionName.value.trim()) return
  saving.value = true
  try {
    await addSpecOption(props.specId, [optionName.value.trim()])
    ElMessage.success('已添加')
    optionName.value = ''
    await load()
    emit('saved')
  } finally {
    saving.value = false
  }
}

async function remove(opt: SpecificationOption) {
  await deleteSpecOption([opt.id!])
  ElMessage.success('已删除')
  await load()
  emit('saved')
}
</script>

<style scoped lang="scss">
.add-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.options {
  max-height: 340px;
  overflow-y: auto;
  border: 1px solid var(--ink-100);
  border-radius: 12px;
  padding: 6px;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border-radius: 8px;

  &:hover {
    background: var(--ink-50);
  }
}
</style>