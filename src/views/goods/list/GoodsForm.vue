<template>
  <AppDialog v-model="visible" :title="isEdit ? '编辑商品' : '发布商品'" width="880px" :loading="saving" @submit="submit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="goods-form">
      <div class="section-title">基本信息</div>

      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="form.goodsName" placeholder="例如：iPhone 15 128G 蓝色" maxlength="60" show-word-limit />
      </el-form-item>

      <el-form-item label="卖点简介" prop="caption">
        <el-input v-model="form.caption" placeholder="一句话卖点，展示在商品卡片上" maxlength="60" />
      </el-form-item>

      <div class="grid-2">
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0.01" :precision="2" :step="100" controls-position="right" />
        </el-form-item>
        <el-form-item label="品牌" prop="brandId">
          <el-select v-model="form.brandId" placeholder="选择品牌" filterable>
            <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id!" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="商品分类" prop="productType3Id">
        <TypeCascader v-model="form.productType3Id" @change-chain="onTypeChain" />
      </el-form-item>

      <el-form-item label="上架状态">
        <el-switch v-model="form.isMarketable" active-text="上架" inactive-text="下架" />
      </el-form-item>

      <div class="section-title">商品图片</div>

      <el-form-item label="主图" prop="headerPic">
        <AppUpload v-model="form.headerPic" />
      </el-form-item>

      <el-form-item label="图集">
        <AppUpload v-model="form.images" :limit="6" />
        <div class="hint">最多 6 张，第一张建议与主图一致</div>
      </el-form-item>

      <div class="section-title">商品规格</div>

      <el-form-item label="规格项">
        <div class="specs">
          <div v-for="spec in specs" :key="spec.id" class="spec">
            <span class="spec__name">{{ spec.specName }}</span>
            <el-checkbox-group v-model="selected[spec.id!]">
              <el-checkbox v-for="opt in spec.specificationOptions || []" :key="opt.id" :value="opt.id!">
                {{ opt.optionName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <el-empty v-if="!specs.length" description="当前分类还没有规格，先去「规格管理」添加" :image-size="70" />
        </div>
      </el-form-item>

      <div class="section-title">商品介绍</div>
      <el-form-item label="详情">
        <RichEditor v-model="form.introduction" />
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AppDialog from '@/components/AppDialog.vue'
import AppUpload from '@/components/AppUpload.vue'
import RichEditor from '@/components/RichEditor.vue'
import TypeCascader from '@/components/TypeCascader.vue'
import { addGoods, allBrands, specsByType, updateGoods } from '@/api/goods'
import type { Brand, Goods, Specification } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Goods | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved'): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const isEdit = computed(() => Boolean(props.record?.id))
const formRef = ref<FormInstance>()
const saving = ref(false)
const brands = ref<Brand[]>([])
const specs = ref<Specification[]>([])
const selected = ref<Record<number, number[]>>({})

const form = reactive<{
  goodsName: string
  caption: string
  price: number
  brandId?: number
  productType1Id?: number
  productType2Id?: number
  productType3Id?: number
  headerPic: string
  images: string[]
  introduction: string
  isMarketable: boolean
}>({
  goodsName: '',
  caption: '',
  price: 0,
  headerPic: '',
  images: [],
  introduction: '',
  isMarketable: true
})

const rules: FormRules = {
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  brandId: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  productType3Id: [{ required: true, message: '请选择三级分类', trigger: 'change' }],
  headerPic: [{ required: true, message: '请上传主图', trigger: 'change' }]
}

function onTypeChain(chain: { level1?: number; level2?: number; level3?: number }) {
  form.productType1Id = chain.level1
  form.productType2Id = chain.level2
  form.productType3Id = chain.level3
  loadSpecs(chain.level3)
}

async function loadSpecs(typeId?: number) {
  if (!typeId) {
    specs.value = []
    return
  }
  specs.value = await specsByType(typeId)
}

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return
    brands.value = await allBrands()
    const record = props.record

    form.goodsName = record?.goodsName ?? ''
    form.caption = record?.caption ?? ''
    form.price = Number(record?.price ?? 0)
    form.brandId = record?.brandId
    form.productType1Id = record?.productType1Id
    form.productType2Id = record?.productType2Id
    form.productType3Id = record?.productType3Id
    form.headerPic = record?.headerPic ?? ''
    form.images = (record?.images ?? []).map((img) => img.imageUrl)
    form.introduction = record?.introduction ?? ''
    form.isMarketable = record?.isMarketable !== false

    selected.value = {}
    ;(record?.specifications ?? []).forEach((spec) => {
      if (spec.id) selected.value[spec.id] = (spec.specificationOptions ?? []).map((opt) => opt.id!)
    })

    await loadSpecs(record?.productType3Id)
    formRef.value?.clearValidate()
  }
)

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (!form.images.length) {
    ElMessage.warning('请至少上传一张商品图片')
    return
  }

  const specifications = specs.value
    .map((spec) => {
      const picked = selected.value[spec.id!] ?? []
      const options = (spec.specificationOptions ?? []).filter((opt) => picked.includes(opt.id!))
      return { id: spec.id, specName: spec.specName, specificationOptions: options }
    })
    .filter((spec) => spec.specificationOptions.length > 0)

  if (!specifications.length) {
    ElMessage.warning('请至少勾选一个规格项')
    return
  }

  const payload: Goods = {
    id: props.record?.id,
    goodsName: form.goodsName,
    caption: form.caption,
    price: form.price,
    brandId: form.brandId,
    productType1Id: form.productType1Id,
    productType2Id: form.productType2Id,
    productType3Id: form.productType3Id,
    headerPic: form.headerPic,
    isMarketable: form.isMarketable,
    introduction: form.introduction,
    images: form.images.map((url) => ({ imageUrl: url })),
    specifications
  }

  saving.value = true
  try {
    if (isEdit.value) {
      await updateGoods(payload)
      ElMessage.success('修改成功，正在同步到搜索')
    } else {
      await addGoods(payload)
      ElMessage.success('发布成功，正在同步到搜索')
    }
    visible.value = false
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.section-title {
  margin: 6px 0 16px;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-800);
  border-left: 3px solid var(--brand-500);
  line-height: 1.2;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 18px;
}

.specs {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--ink-100);
  border-radius: 12px;
  background: #fbfcfe;

  &__name {
    width: 76px;
    flex-shrink: 0;
    font-size: 12px;
    color: var(--ink-500);
    padding-top: 4px;
  }
}

.hint {
  font-size: 11px;
  color: var(--ink-300);
  margin-top: 4px;
}

.goods-form {
  max-height: 66vh;
  overflow-y: auto;
  padding-right: 12px;
}
</style>