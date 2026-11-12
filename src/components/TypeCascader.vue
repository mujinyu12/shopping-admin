<template>
  <div class="type-cascader">
    <el-select v-model="level1" placeholder="一级分类" clearable @change="onLevel1">
      <el-option v-for="item in level1Options" :key="item.id" :label="item.name" :value="item.id!" />
    </el-select>
    <el-select v-model="level2" placeholder="二级分类" clearable :disabled="!level1" @change="onLevel2">
      <el-option v-for="item in level2Options" :key="item.id" :label="item.name" :value="item.id!" />
    </el-select>
    <el-select v-model="level3" placeholder="三级分类" clearable :disabled="!level2" @change="emitChange">
      <el-option v-for="item in level3Options" :key="item.id" :label="item.name" :value="item.id!" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { typesByParent } from '@/api/goods'
import type { ProductType } from '@/api/types'

/**
 * 三级分类联动选择器。
 * - v-model 绑定三级分类 id（商品/规格都挂在三级上）
 * - 同时抛出 change-chain，方便商品表单保存 productType1Id/2Id/3Id
 */
const props = defineProps<{ modelValue?: number }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value?: number): void
  (e: 'change-chain', chain: { level1?: number; level2?: number; level3?: number }): void
}>()

const level1Options = ref<ProductType[]>([])
const level2Options = ref<ProductType[]>([])
const level3Options = ref<ProductType[]>([])
const level1 = ref<number>()
const level2 = ref<number>()
const level3 = ref<number>()

function emitChange() {
  emit('update:modelValue', level3.value)
  emit('change-chain', { level1: level1.value, level2: level2.value, level3: level3.value })
}

async function onLevel1() {
  level2.value = undefined
  level3.value = undefined
  level3Options.value = []
  level2Options.value = level1.value ? await typesByParent(level1.value) : []
  emitChange()
}

async function onLevel2() {
  level3.value = undefined
  level3Options.value = level2.value ? await typesByParent(level2.value) : []
  emitChange()
}

onMounted(async () => {
  level1Options.value = await typesByParent(0)
  if (!props.modelValue) return
  level3.value = props.modelValue
  // 回显：逐级反查，找到三级所属的一级、二级
  for (const one of level1Options.value) {
    const twos = await typesByParent(one.id!)
    for (const item of twos) {
      const threes = await typesByParent(item.id!)
      if (threes.some((three) => three.id === props.modelValue)) {
        level1.value = one.id
        level2.value = item.id
        level2Options.value = twos
        level3Options.value = threes
        emit('change-chain', { level1: one.id, level2: item.id, level3: props.modelValue })
        return
      }
    }
  }
})

watch(
  () => props.modelValue,
  (value) => {
    if (value && value !== level3.value) level3.value = value
  }
)
</script>

<style scoped lang="scss">
.type-cascader {
  display: flex;
  gap: 8px;
  width: 100%;

  :deep(.el-select) {
    flex: 1;
  }
}
</style>