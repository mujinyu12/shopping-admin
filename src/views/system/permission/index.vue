<template>
  <div class="page">
    <PageHeader title="权限" description="权限点对应后端接口，角色勾选后管理员即可访问">
      <el-button type="primary" :icon="Plus" @click="openCreate">新增权限</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <AppTable ref="tableRef" :request="searchPermissions">
        <el-table-column prop="pid" label="ID" width="90" />
        <el-table-column prop="permissionName" label="权限名称" min-width="180" />
        <el-table-column label="资源路径" min-width="220">
          <template #default="{ row }"><code class="url">{{ row.url }}</code></template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <AppDeleteBtn :title="`确定删除权限「${row.permissionName}」吗？`" @confirm="onDelete(row)" />
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <PermissionForm v-model="formVisible" :record="editing" @saved="reload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import AppDeleteBtn from '@/components/AppDeleteBtn.vue'
import PermissionForm from './PermissionForm.vue'
import { deletePermission, searchPermissions } from '@/api/system'
import type { Permission } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const editing = ref<Permission | null>(null)

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
  await deletePermission(row.pid!)
  ElMessage.success('删除成功')
  reload()
}
</script>

<style scoped lang="scss">
.url {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--brand-700);
  background: var(--brand-50);
  padding: 2px 8px;
  border-radius: 999px;
}
</style>