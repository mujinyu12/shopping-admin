<template>
  <AppDialog v-model="visible" title="商品详情" width="760px" :loading="false" confirm-text="关闭" @submit="visible = false">
    <div v-if="record" class="detail">
      <div class="detail__head">
        <el-image :src="record.headerPic" fit="cover" class="detail__pic" :preview-src-list="gallery" preview-teleported />
        <div class="detail__meta">
          <h3>{{ record.goodsName }}</h3>
          <p class="detail__caption">{{ record.caption }}</p>
          <div class="detail__price">{{ money(record.price) }}</div>
          <div class="detail__tags">
            <el-tag size="small" :type="record.isMarketable ? 'success' : 'info'">
              {{ record.isMarketable ? '已上架' : '已下架' }}
            </el-tag>
            <el-tag size="small" type="info">ID {{ record.id }}</el-tag>
            <el-tag size="small" type="info">品牌 {{ record.brandId || '-' }}</el-tag>
          </div>
        </div>
      </div>

      <div class="detail__section">
        <h4>商品图片</h4>
        <div class="detail__gallery">
          <el-image
            v-for="(img, index) in record.images || []"
            :key="index"
            :src="img.imageUrl"
            fit="cover"
            :preview-src-list="(record.images || []).map((i) => i.imageUrl)"
            :initial-index="index"
            preview-teleported
          />
        </div>
      </div>

      <div class="detail__section">
        <h4>规格</h4>
        <div v-for="spec in record.specifications || []" :key="spec.id" class="detail__spec">
          <span class="detail__spec-name">{{ spec.specName }}</span>
          <el-tag v-for="opt in spec.specificationOptions || []" :key="opt.id" size="small">{{ opt.optionName }}</el-tag>
        </div>
        <el-empty v-if="!record.specifications?.length" description="未设置规格" :image-size="60" />
      </div>

      <div class="detail__section">
        <h4>商品介绍</h4>
        <div class="detail__intro" v-html="record.introduction || '<p>暂无介绍</p>'" />
      </div>
    </div>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import { money } from '@/utils/format'
import type { Goods } from '@/api/types'

const props = defineProps<{ modelValue: boolean; record: Goods | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const gallery = computed(() => (props.record?.images || []).map((img) => img.imageUrl))
</script>

<style scoped lang="scss">
.detail {
  &__head {
    display: flex;
    gap: 18px;
  }

  &__pic {
    width: 132px;
    height: 132px;
    border-radius: 14px;
    border: 1px solid var(--ink-100);
    flex-shrink: 0;
  }

  &__meta {
    h3 {
      font-size: 18px;
      color: var(--ink-900);
    }
  }

  &__caption {
    margin-top: 6px;
    font-size: 12px;
    color: var(--ink-400);
  }

  &__price {
    margin-top: 12px;
    font-size: 24px;
    font-weight: 700;
    color: #d92d20;
  }

  &__tags {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }

  &__section {
    margin-top: 22px;

    h4 {
      font-size: 13px;
      color: var(--ink-700);
      margin-bottom: 10px;
    }
  }

  &__gallery {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    :deep(.el-image) {
      width: 76px;
      height: 76px;
      border-radius: 10px;
      border: 1px solid var(--ink-100);
    }
  }

  &__spec {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  &__spec-name {
    font-size: 12px;
    color: var(--ink-400);
    width: 70px;
  }

  &__intro {
    max-height: 240px;
    overflow-y: auto;
    border: 1px solid var(--ink-100);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.8;
    color: var(--ink-600);

    :deep(img) {
      max-width: 100%;
    }
  }
}
</style>