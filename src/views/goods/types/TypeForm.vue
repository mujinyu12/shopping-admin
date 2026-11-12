<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑分类' : '新增分类'" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="层级">
        <el-radio-group v-model="level" :disabled="isEdit">
          <el-radio-button :value="1">一级</el-radio-button>
          <el-radio-button :value="2">二级</el-radio-button>
          <el-radio-button :value="3">三级</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="level >= 2" label="所属一级" prop="level1">
        <el-select v-model="form.level1" placeholder="请选择一级分类" @change="onLevel1">
          <el-option v-for="item in level1Options" :key="item.id" :label="item.name" :value="item.id!" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="level === 3" label="所属二级" prop="level2">
        <el-select v-model="form.level2" placeholder="请选择二级分类" :disabled="!form.level1">
          <el-option v-for="item in level2Options" :key="item.id" :label="item.name" :value="item.id!" />
        </el-select>
      </el-form-item>

      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="例如：手机通讯" maxlength="30" />
      </el-form-item>

      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" />
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import { addType, typesByParent, updateType } from '@/api/goods'
import type { ProductType } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: ProductType | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.id))
const formRef = ref<FormInstance>()
const saving = ref(false)
const level = ref(1)
const level1Options = ref<ProductType[]>([])
const level2Options = ref<ProductType[]>([])
const form = reactive<{ name: string; status: number; level1?: number; level2?: number }>({
  name: '',
  status: 1
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

async function onLevel1() {
  form.level2 = undefined
  level2Options.value = form.level1 ? await typesByParent(form.level1) : []
}

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return
    level1Options.value = await typesByParent(0)
    form.name = props.record?.name ?? ''
    form.status = props.record?.status ?? 1
    form.level1 = undefined
    form.level2 = undefined
    level.value = 1

    const parentId = props.record?.parentId
    if (parentId) {
      const parent = await findType(parentId)
      if (parent) {
        if (parent.parentId === 0) {
          level.value = 2
          form.level1 = parent.id
          level2Options.value = await typesByParent(parent.id!)
        } else {
          level.value = 3
          form.level2 = parent.id
          const grand = await findType(parent.parentId!)
          if (grand) {
            form.level1 = grand.id
            level1Options.value = await typesByParent(0)
            level2Options.value = await typesByParent(grand.id!)
          }
        }
      }
    }
    formRef.value?.clearValidate()
  }
)

/** 从一级/二级列表里找一个分类（后端没有 findById，就用列表匹配） */
async function findType(id: number): Promise<ProductType | undefined> {
  const ones = await typesByParent(0)
  for (const one of ones) {
    if (one.id === id) return one
    const twos = await typesByParent(one.id!)
    const hit = twos.find((t) => t.id === id)
    if (hit) return hit
  }
  return undefined
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (level.value >= 2 && !form.level1) {
    ElMessage.warning('请选择一个一级分类')
    return
  }
  if (level.value === 3 && !form.level2) {
    ElMessage.warning('请选择一个二级分类')
    return
  }
  const parentId = level.value === 1 ? 0 : level.value === 2 ? form.level1 : form.level2
  saving.value = true
  try {
    const payload: ProductType = { id: props.record?.id, name: form.name, parentId, status: form.status }
    if (isEdit.value) {
      await updateType(payload)
      ElMessage.success('修改成功')
    } else {
      await addType(payload)
      ElMessage.success('新增成功')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>