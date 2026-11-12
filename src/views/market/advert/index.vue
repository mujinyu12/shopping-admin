<template>
  <div class="page">
    <PageHeader title="广告位" description="首页轮播与频道广告图，客户端按状态展示">
      <el-button type="primary" :icon="Plus" @click="openCreate">新增广告位</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <AppTable ref="tableRef" :request="searchCategories">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column label="广告图" width="150">
          <template #default="{ row }">
            <el-image
              v-if="row.pic"
              :src="row.pic"
              fit="cover"
              class="banner"
              :preview-src-list="[row.pic]"
              preview-teleported
            />
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column label="跳转链接" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <a v-if="row.url" :href="row.url" target="_blank" rel="noopener" class="link">{{ row.url }}</a>
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 1"
              inline-prompt
              active-text="展示"
              inactive-text="停用"
              @change="(v: string | number | boolean) => onToggleStatus(row, Boolean(v))"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <AppDeleteBtn :title="`确定删除广告位「${row.title}」吗？`" @confirm="onDelete(row)" />
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <AdvertForm v-model="formVisible" :record="editing" @saved="reload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import AppDeleteBtn from '@/components/AppDeleteBtn.vue'
import AdvertForm from './AdvertForm.vue'
import { deleteCategories, searchCategories, updateCategoryStatus } from '@/api/market'
import type { Category } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const editing = ref<Category | null>(null)

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
async function onToggleStatus(row: any, enabled: boolean) {
  await updateCategoryStatus(row.id, enabled ? 1 : 0)
  ElMessage.success(enabled ? '已启用' : '已停用')
  reload()
}
async function onDelete(row: any) {
  await deleteCategories([row.id!])
  ElMessage.success('删除成功')
  reload()
}
</script>

<style scoped lang="scss">
.banner {
  width: 110px;
  height: 52px;
  border-radius: 8px;
  border: 1px solid var(--ink-100);
}
.link {
  color: var(--brand-600);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>