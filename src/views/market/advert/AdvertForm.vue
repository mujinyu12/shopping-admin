<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑广告位' : '新增广告位'" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="例如：首页轮播一" maxlength="30" />
      </el-form-item>

      <el-form-item label="广告图" prop="pic">
        <AppUpload v-model="form.pic" />
      </el-form-item>

      <el-form-item label="跳转链接" prop="url">
        <el-input v-model="urlValue" placeholder="https://example.com/goods/1" maxlength="255" />
      </el-form-item>

      <el-form-item label="状态">
        <el-switch v-model="statusValue" :active-value="1" :inactive-value="0" active-text="展示" />
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import AppUpload from '@/components/AppUpload.vue'
import { addCategory, updateCategory } from '@/api/market'
import type { Category } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Category | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.id))
const formRef = ref<FormInstance>()
const saving = ref(false)

const form = reactive<Category>({ title: '', url: '', pic: '', status: 1 })

const urlValue = computed({
  get: () => form.url ?? '',
  set: (v: string) => (form.url = v)
})
const statusValue = computed({
  get: () => form.status ?? 1,
  set: (v: number) => (form.status = v)
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  pic: [{ required: true, message: '请上传广告图', trigger: 'change' }]
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    form.id = props.record?.id
    form.title = props.record?.title ?? ''
    form.url = props.record?.url ?? ''
    form.pic = props.record?.pic ?? ''
    form.status = props.record?.status ?? 1
    formRef.value?.clearValidate()
  }
)

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload: Category = {
      id: form.id,
      title: form.title,
      url: form.url,
      pic: form.pic,
      status: form.status
    }
    if (isEdit.value) {
      await updateCategory(payload)
      ElMessage.success('修改成功')
    } else {
      await addCategory(payload)
      ElMessage.success('新增成功')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>