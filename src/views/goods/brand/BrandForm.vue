<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑品牌' : '新增品牌'" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="form.name" placeholder="例如：华为" maxlength="30" />
      </el-form-item>
      <el-form-item label="品牌 Logo">
        <AppUpload v-model="form.logo" />
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import AppUpload from '@/components/AppUpload.vue'
import { addBrand, updateBrand } from '@/api/goods'
import type { Brand } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Brand | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.id))
const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive<Brand>({ name: '', logo: '' })

const rules: FormRules = { name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }] }

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    form.name = props.record?.name ?? ''
    form.logo = props.record?.logo ?? ''
    form.id = props.record?.id
    formRef.value?.clearValidate()
  }
)

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (isEdit.value) {
      await updateBrand({ id: form.id, name: form.name, logo: form.logo })
      ElMessage.success('修改成功')
    } else {
      await addBrand({ name: form.name, logo: form.logo })
      ElMessage.success('新增成功')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>