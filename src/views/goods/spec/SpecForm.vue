<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑规格' : '新增规格'" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="规格名称" prop="specName">
        <el-input v-model="form.specName" placeholder="例如：颜色" maxlength="20" />
      </el-form-item>
      <el-form-item label="所属三级分类" prop="productTypeId">
        <TypeCascader v-model="form.productTypeId" />
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import TypeCascader from '@/components/TypeCascader.vue'
import { addSpec, updateSpec } from '@/api/goods'
import type { Specification } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Specification | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.id))
const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive<Specification>({ specName: '', productTypeId: undefined })

const rules: FormRules = {
  specName: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  productTypeId: [{ required: true, message: '请选择三级分类', trigger: 'change' }]
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    form.specName = props.record?.specName ?? ''
    form.productTypeId = props.record?.productTypeId
    form.id = props.record?.id
    formRef.value?.clearValidate()
  }
)

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload = { id: form.id, specName: form.specName, productTypeId: form.productTypeId }
    if (isEdit.value) {
      await updateSpec(payload as Specification)
      ElMessage.success('修改成功')
    } else {
      await addSpec(payload as Specification)
      ElMessage.success('新增成功（记得再维护规格项）')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>