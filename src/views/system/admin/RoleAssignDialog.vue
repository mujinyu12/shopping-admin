<template>
  <AppDialog v-model="visible" title="分配角色" :loading="saving" @submit="submit">
    <p class="tip">勾选后保存，管理员将拥有这些角色对应的全部权限。</p>
    <el-checkbox-group v-model="checked" class="role-list">
      <el-checkbox v-for="role in roles" :key="role.rid" :value="role.rid!" border>
        {{ role.roleName }}
      </el-checkbox>
    </el-checkbox-group>
    <el-empty v-if="!roles.length" description="还没有角色" :image-size="70" />
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import { allRoles, getAdmin, updateAdminRoles } from '@/api/system'
import type { Role } from '@/api/types'

const props = defineProps<{ modelValue: boolean; adminId: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const roles = ref<Role[]>([])
const checked = ref<number[]>([])
const saving = ref(false)

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return
    roles.value = await allRoles()
    const detail = await getAdmin(props.adminId)
    checked.value = (detail.roles ?? []).map((role) => role.rid!).filter(Boolean)
  }
)

async function submit() {
  saving.value = true
  try {
    await updateAdminRoles(props.adminId, checked.value)
    ElMessage.success('角色已更新')
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.tip {
  font-size: 12px;
  color: var(--ink-400);
  margin-bottom: 16px;
}

.role-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  :deep(.el-checkbox) {
    margin-right: 0;
    border-radius: 10px;
  }
}
</style>