<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑管理员' : '新增管理员'" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="4-20 位，登录账号" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="isEdit ? '留空表示不修改密码' : '至少 8 位'"
        />
      </el-form-item>
      <el-alert
        v-if="isEdit"
        type="info"
        :closable="false"
        show-icon
        title="密码留空时后端会沿用原密码，不会重置"
      />
    </el-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import { addAdmin, updateAdmin } from '@/api/system'
import type { Admin } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Admin | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.aid))
const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive<Admin>({ username: '', password: '' })

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度为 4-20 位', trigger: 'blur' }
  ],
  password: [
    {
      validator: (_rule, value: string, callback) => {
        if (!isEdit.value && !value) return callback(new Error('请输入密码'))
        if (value && value.length < 8) return callback(new Error('密码至少 8 位'))
        callback()
      },
      trigger: 'blur'
    }
  ]
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    form.username = props.record?.username ?? ''
    form.password = ''
    form.aid = props.record?.aid
    formRef.value?.clearValidate()
  }
)

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (isEdit.value) {
      await updateAdmin({ aid: form.aid, username: form.username, password: form.password || undefined })
      ElMessage.success('修改成功')
    } else {
      await addAdmin({ username: form.username, password: form.password })
      ElMessage.success('新增成功')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>