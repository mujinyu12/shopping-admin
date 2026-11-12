<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑权限' : '新增权限'" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="权限名称" prop="permissionName">
        <el-input v-model="form.permissionName" placeholder="例如：退款管理" />
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input v-model="form.url" placeholder="例如：/admin/refund" />
        <div class="hint">与后端 @PreAuthorize("hasAnyAuthority('/admin/refund')") 中的值保持一致</div>
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import { addPermission, updatePermission } from '@/api/system'
import type { Permission } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Permission | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.pid))
const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive<Permission>({ permissionName: '', url: '' })

const rules: FormRules = {
  permissionName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入资源路径', trigger: 'blur' },
    { pattern: /^\/.*/, message: '路径需要以 / 开头', trigger: 'blur' }
  ]
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    form.permissionName = props.record?.permissionName ?? ''
    form.url = props.record?.url ?? ''
    form.pid = props.record?.pid
    formRef.value?.clearValidate()
  }
)

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (isEdit.value) {
      await updatePermission({ pid: form.pid, permissionName: form.permissionName, url: form.url })
      ElMessage.success('修改成功')
    } else {
      await addPermission({ permissionName: form.permissionName, url: form.url })
      ElMessage.success('新增成功')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.hint {
  font-size: 11px;
  color: var(--ink-300);
  margin-top: 4px;
  line-height: 1.5;
}
</style>