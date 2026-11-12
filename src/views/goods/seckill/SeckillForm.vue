<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑秒杀活动' : '新建秒杀活动'" width="720px" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="选择商品" prop="goodsId">
        <div class="picker">
          <el-input :model-value="form.title" readonly placeholder="点击右侧按钮选择商品">
            <template #append>
              <el-button @click="pickerVisible = true">选择</el-button>
            </template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item label="活动标题" prop="title">
        <el-input v-model="form.title" placeholder="例如：iPhone 15 限时秒杀" maxlength="60" />
      </el-form-item>

      <div class="grid-2">
        <el-form-item label="原价" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" controls-position="right" />
        </el-form-item>
        <el-form-item label="秒杀价" prop="costPrice">
          <el-input-number v-model="form.costPrice" :min="0.01" :precision="2" controls-position="right" />
        </el-form-item>
      </div>

      <el-form-item label="活动时间" prop="range">
        <el-date-picker
          v-model="form.range"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <div class="grid-2">
        <el-form-item label="秒杀总量" prop="num">
          <el-input-number v-model="form.num" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="剩余库存" prop="stockCount">
          <el-input-number v-model="form.stockCount" :min="0" controls-position="right" />
        </el-form-item>
      </div>

      <el-form-item label="活动介绍">
        <el-input v-model="form.introduction" type="textarea" :rows="4" maxlength="1000" show-word-limit />
      </el-form-item>
    </el-form>

    <GoodsPicker v-model="pickerVisible" @pick="onPick" />
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import GoodsPicker from './GoodsPicker.vue'
import { addSeckill, updateSeckill } from '@/api/goods'
import { htmlToText } from '@/utils/text'
import type { Goods, SeckillGoods } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: SeckillGoods | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.id))
const formRef = ref<FormInstance>()
const saving = ref(false)
const pickerVisible = ref(false)

const form = reactive<{
  goodsId?: number
  title: string
  headerPic: string
  price: number
  costPrice: number
  num: number
  stockCount: number
  introduction: string
  range: [string, string] | null
}>({
  title: '',
  headerPic: '',
  price: 0,
  costPrice: 0,
  num: 1,
  stockCount: 1,
  introduction: '',
  range: null
})

const rules: FormRules = {
  goodsId: [{ required: true, message: '请选择商品', trigger: 'change' }],
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  costPrice: [{ required: true, message: '请输入秒杀价', trigger: 'blur' }],
  range: [{ required: true, message: '请选择活动时间', trigger: 'change' }]
}

/** 上一次由商品带出的标题，用来区分「自动带入」和「用户手动改过」 */
const autoTitle = ref('')

function onPick(goods: Goods) {
  const picked = goods.goodsName ?? ''
  // 标题为空、或还停在上一次自动带出的商品名时跟随新商品；
  // 用户手动改过标题就不再覆盖，避免冲掉自定义文案
  if (!form.title || form.title === autoTitle.value) form.title = picked
  autoTitle.value = picked
  form.goodsId = goods.id
  // 秒杀活动头图直接用商品主图，否则用户端活动卡片是空白图
  form.headerPic = goods.headerPic ?? ''
  form.price = Number(goods.price ?? 0)
  form.costPrice = Number((Number(goods.price ?? 0) * 0.7).toFixed(2))
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    const record = props.record
    form.goodsId = record?.goodsId
    form.title = record?.title ?? ''
    autoTitle.value = form.title
    form.headerPic = record?.headerPic ?? ''
    form.price = Number(record?.price ?? 0)
    form.costPrice = Number(record?.costPrice ?? 0)
    form.num = record?.num ?? 1
    form.stockCount = record?.stockCount ?? record?.num ?? 1
    form.introduction = htmlToText(record?.introduction, { keepImages: true })
    form.range =
      record?.startTime && record?.endTime ? [String(record.startTime), String(record.endTime)] : null
    formRef.value?.clearValidate()
  }
)

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  const payload: SeckillGoods = {
    id: props.record?.id,
    goodsId: form.goodsId,
    title: form.title,
    headerPic: form.headerPic || undefined,
    price: form.price,
    costPrice: form.costPrice,
    num: form.num,
    stockCount: form.stockCount,
    introduction: form.introduction.trim(),
    startTime: form.range?.[0],
    endTime: form.range?.[1]
  }
  saving.value = true
  try {
    if (isEdit.value) {
      await updateSeckill(payload)
      ElMessage.success('修改成功')
    } else {
      await addSeckill(payload)
      ElMessage.success('创建成功')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 18px;
}

.picker {
  width: 100%;
}
</style>