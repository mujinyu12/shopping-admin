<template>
  <AppDialog v-model="visible" title="选择商品" width="760px" confirm-text="使用选中商品" @submit="confirm">
    <el-input v-model="keyword" placeholder="输入商品名称搜索" :prefix-icon="Search" clearable class="search" @change="load" />
    <el-table :data="rows" height="380" highlight-current-row @current-change="onSelect">
      <el-table-column width="70">
        <template #default="{ row }">
          <el-image :src="row.headerPic" fit="cover" class="pic" />
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品" min-width="220" />
      <el-table-column label="价格" width="120">
        <template #default="{ row }">{{ money(row.price) }}</template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="170" />
    </el-table>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import AppDialog from '@/components/AppDialog.vue'
import { searchGoods } from '@/api/goods'
import { money } from '@/utils/format'
import type { Goods } from '@/api/types'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'pick', goods: Goods): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const keyword = ref('')
const rows = ref<Goods[]>([])
const picked = ref<Goods | null>(null)

async function load() {
  const page = await searchGoods({ goodsName: keyword.value, page: 1, size: 50 })
  rows.value = page.records || []
}

function onSelect(row: any) {
  picked.value = row
}

function confirm() {
  if (!picked.value) {
    ElMessage.warning('请先选择一个商品')
    return
  }
  emit('pick', picked.value)
  visible.value = false
}

onMounted(load)
</script>

<style scoped lang="scss">
.search {
  margin-bottom: 12px;
}

.pic {
  width: 42px;
  height: 42px;
  border-radius: 8px;
}
</style>