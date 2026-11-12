<template>
  <div class="page">
    <PageHeader title="商品分类" description="三级分类体系：一级 → 二级 → 三级，商品挂在三级分类上">
      <el-button type="primary" :icon="Plus" @click="openCreate">新增分类</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <div class="filters">
        <el-input v-model="filters.name" placeholder="分类名称" clearable style="width: 220px" />
        <el-select v-model="filters.parentId" placeholder="按父级筛选" clearable style="width: 200px">
          <el-option label="仅一级分类" :value="0" />
          <el-option v-for="item in level1Options" :key="item.id" :label="item.name" :value="item.id!" />
        </el-select>
      </div>

      <AppTable ref="tableRef" :request="searchTypes" :filters="filters">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column label="层级" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.parentId === 0 ? 'success' : 'info'">
              {{ row.parentId === 0 ? '一级' : '子级' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parentId" label="父级 ID" width="110" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <AppDeleteBtn :title="`确定删除分类「${row.name}」吗？`" @confirm="onDelete(row)" />
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <TypeForm v-model="formVisible" :record="editing" @saved="reload" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import AppDeleteBtn from '@/components/AppDeleteBtn.vue'
import TypeForm from './TypeForm.vue'
import { deleteType, searchTypes, typesByParent } from '@/api/goods'
import type { ProductType } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const editing = ref<ProductType | null>(null)
const level1Options = ref<ProductType[]>([])
const filters = reactive<{ name: string; parentId?: number }>({ name: '', parentId: undefined })

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
  await deleteType(row.id!)
  ElMessage.success('删除成功')
  reload()
}

onMounted(async () => {
  level1Options.value = await typesByParent(0)
})
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
</style>