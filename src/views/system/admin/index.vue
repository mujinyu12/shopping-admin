<template>
  <div class="page">
    <PageHeader title="管理员" description="后台账号管理，账号的权限由所属角色决定">
      <el-button type="primary" :icon="Plus" @click="openCreate">新增管理员</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <AppTable ref="tableRef" :request="searchAdmins">
        <el-table-column prop="aid" label="ID" width="90" />
        <el-table-column prop="username" label="用户名" min-width="160">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="28">{{ row.username?.slice(0, 1)?.toUpperCase() }}</el-avatar>
              <span>{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="220">
          <template #default="{ row }">
            <template v-if="row.roles?.length">
              <el-tag v-for="role in row.roles" :key="role.rid" size="small" class="mr-6">{{ role.roleName }}</el-tag>
            </template>
            <span v-else class="text-muted">未分配</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="openRoles(row)">分配角色</el-button>
            <AppDeleteBtn :title="`确定删除管理员「${row.username}」吗？`" @confirm="onDelete(row)" />
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <AdminForm v-model="formVisible" :record="editing" @saved="onSaved" />
    <RoleAssignDialog v-model="roleVisible" :admin-id="roleAdminId" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import AppDeleteBtn from '@/components/AppDeleteBtn.vue'
import AdminForm from './AdminForm.vue'
import RoleAssignDialog from './RoleAssignDialog.vue'
import { searchAdmins, deleteAdmin } from '@/api/system'
import type { Admin } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const roleVisible = ref(false)
const editing = ref<Admin | null>(null)
const roleAdminId = ref<number>(0)

function openCreate() {
  editing.value = null
  formVisible.value = true
}

function openEdit(row: any) {
  editing.value = { ...row, password: '' }
  formVisible.value = true
}

function openRoles(row: any) {
  roleAdminId.value = row.aid!
  roleVisible.value = true
}

async function onDelete(row: any) {
  await deleteAdmin(row.aid!)
  ElMessage.success('删除成功')
  tableRef.value?.reload()
}

function onSaved() {
  tableRef.value?.reload()
}
</script>

<style scoped lang="scss">
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;

  :deep(.el-avatar) {
    background: var(--brand-50);
    color: var(--brand-700);
    font-weight: 600;
  }
}

.mr-6 {
  margin-right: 6px;
}
</style>