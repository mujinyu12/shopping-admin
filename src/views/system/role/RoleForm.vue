<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑角色' : '新增角色'" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="例如：商品运营" maxlength="30" show-word-limit />
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import { addRole, updateRole } from '@/api/system'
import type { Role } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Role | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.rid))
const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive<Role>({ roleName: '' })

const rules: FormRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    form.roleName = props.record?.roleName ?? ''
    form.rid = props.record?.rid
    formRef.value?.clearValidate()
  }
)

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (isEdit.value) {
      await updateRole({ rid: form.rid, roleName: form.roleName })
      ElMessage.success('修改成功')
    } else {
      await addRole({ roleName: form.roleName })
      ElMessage.success('新增成功')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>