<template>
  <div class="page">
    <PageHeader title="品牌管理" description="商品归属的品牌，前台筛选用">
      <el-button type="primary" :icon="Plus" @click="openCreate">新增品牌</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <AppTable ref="tableRef" :request="searchBrands">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column label="Logo" width="110">
          <template #default="{ row }">
            <el-image v-if="row.logo" :src="row.logo" fit="cover" class="logo" :preview-src-list="[row.logo]" preview-teleported />
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="品牌名称" min-width="200" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <AppDeleteBtn :title="`确定删除品牌「${row.name}」吗？`" @confirm="onDelete(row)" />
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <BrandForm v-model="formVisible" :record="editing" @saved="reload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import AppDeleteBtn from '@/components/AppDeleteBtn.vue'
import BrandForm from './BrandForm.vue'
import { deleteBrand, searchBrands } from '@/api/goods'
import type { Brand } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const editing = ref<Brand | null>(null)

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
async function onDelete(row: any) {
  await deleteBrand(row.id!)
  ElMessage.success('删除成功')
  reload()
}
</script>

<style scoped lang="scss">
.logo {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  border: 1px solid var(--ink-100);
}
</style>