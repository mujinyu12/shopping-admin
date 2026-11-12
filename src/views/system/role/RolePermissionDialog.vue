<template>
  <AppDialog v-model="visible" title="分配权限" :loading="saving" width="680px" @submit="submit">
    <p class="tip">勾选该角色可以访问的接口权限。权限的 url 与后端 @PreAuthorize 中的 authority 一致。</p>
    <div v-loading="loading" class="perm-list">
      <el-checkbox-group v-model="checked">
        <label v-for="perm in permissions" :key="perm.pid" class="perm-item">
          <el-checkbox :value="perm.pid!">
            <span class="perm-item__name">{{ perm.permissionName }}</span>
            <code class="perm-item__url">{{ perm.url }}</code>
          </el-checkbox>
        </label>
      </el-checkbox-group>
    </div>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import { allPermissions, getRole, updateRolePermissions } from '@/api/system'
import type { Permission } from '@/api/types'

const props = defineProps<{ modelValue: boolean; roleId: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const permissions = ref<Permission[]>([])
const checked = ref<number[]>([])
const loading = ref(false)
const saving = ref(false)

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return
    loading.value = true
    try {
      const [list, detail] = await Promise.all([allPermissions(), getRole(props.roleId)])
      permissions.value = list
      checked.value = (detail.permissions ?? []).map((p) => p.pid!).filter(Boolean)
    } finally {
      loading.value = false
    }
  }
)

async function submit() {
  saving.value = true
  try {
    await updateRolePermissions(props.roleId, checked.value)
    ElMessage.success('权限已更新')
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
  margin-bottom: 14px;
}

.perm-list {
  max-height: 420px;
  overflow-y: auto;
}

.perm-item {
  display: block;
  padding: 8px 10px;
  border-radius: 10px;

  &:hover {
    background: var(--ink-50);
  }

  &__name {
    color: var(--ink-700);
  }

  &__url {
    margin-left: 10px;
    font-size: 11px;
    color: var(--ink-400);
    background: var(--ink-50);
    padding: 2px 8px;
    border-radius: 999px;
  }
}
</style>