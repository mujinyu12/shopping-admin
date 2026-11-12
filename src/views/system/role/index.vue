<template>
  <div class="page">
    <PageHeader title="角色" description="角色是权限的集合，管理员通过角色获得权限">
      <el-button type="primary" :icon="Plus" @click="openCreate">新增角色</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <AppTable ref="tableRef" :request="searchRoles">
        <el-table-column prop="rid" label="ID" width="90" />
        <el-table-column prop="roleName" label="角色名称" min-width="180" />
        <el-table-column label="权限" min-width="240">
          <template #default="{ row }">
            <template v-if="row.permissions?.length">
              <el-tag v-for="p in row.permissions.slice(0, 4)" :key="p.pid" size="small" class="mr-6">
                {{ p.permissionName }}
              </el-tag>
              <span v-if="row.permissions.length > 4" class="text-muted">+{{ row.permissions.length - 4 }}</span>
            </template>
            <span v-else class="text-muted">未分配</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="openPerms(row)">分配权限</el-button>
            <AppDeleteBtn :title="`确定删除角色「${row.roleName}」吗？`" @confirm="onDelete(row)" />
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <RoleForm v-model="formVisible" :record="editing" @saved="reload" />
    <RolePermissionDialog v-model="permVisible" :role-id="permRoleId" @saved="reload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import AppDeleteBtn from '@/components/AppDeleteBtn.vue'
import RoleForm from './RoleForm.vue'
import RolePermissionDialog from './RolePermissionDialog.vue'
import { deleteRole, searchRoles } from '@/api/system'
import type { Role } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const permVisible = ref(false)
const editing = ref<Role | null>(null)
const permRoleId = ref(0)

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

function openPerms(row: any) {
  permRoleId.value = row.rid!
  permVisible.value = true
}

async function onDelete(row: any) {
  await deleteRole(row.rid!)
  ElMessage.success('删除成功')
  reload()
}
</script>

<style scoped lang="scss">
.mr-6 {
  margin-right: 6px;
}
</style>