<template>
  <div class="page">
    <PageHeader title="规格管理" description="为三级分类定义规格（如颜色、内存），商品发布时勾选具体规格项">
      <el-button type="primary" :icon="Plus" @click="openCreate">新增规格</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <AppTable ref="tableRef" :request="searchSpecs">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="specName" label="规格名称" min-width="160" />
        <el-table-column prop="productTypeId" label="所属三级分类 ID" width="160" />
        <el-table-column label="规格项" min-width="260">
          <template #default="{ row }">
            <template v-if="row.specificationOptions?.length">
              <el-tag v-for="opt in row.specificationOptions" :key="opt.id" size="small" class="mr-6">
                {{ opt.optionName }}
              </el-tag>
            </template>
            <span v-else class="text-muted">点击「规格项」维护</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="openOptions(row)">规格项</el-button>
            <AppDeleteBtn :title="`确定删除规格「${row.specName}」吗？`" @confirm="onDelete(row)" />
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <SpecForm v-model="formVisible" :record="editing" @saved="reload" />
    <SpecOptionDialog v-model="optionVisible" :spec-id="optionSpecId" :spec-name="optionSpecName" @saved="reload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import AppDeleteBtn from '@/components/AppDeleteBtn.vue'
import SpecForm from './SpecForm.vue'
import SpecOptionDialog from './SpecOptionDialog.vue'
import { deleteSpec, searchSpecs } from '@/api/goods'
import type { Specification } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const optionVisible = ref(false)
const editing = ref<Specification | null>(null)
const optionSpecId = ref(0)
const optionSpecName = ref('')

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
function openOptions(row: any) {
  optionSpecId.value = row.id!
  optionSpecName.value = row.specName
  optionVisible.value = true
}
async function onDelete(row: any) {
  await deleteSpec([row.id!])
  ElMessage.success('删除成功')
  reload()
}
</script>

<style scoped lang="scss">
.mr-6 {
  margin-right: 6px;
}
</style>