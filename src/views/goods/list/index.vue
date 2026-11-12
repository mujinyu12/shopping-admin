<template>
  <div class="page">
    <PageHeader title="商品列表" description="商品的上下架、价格与详情维护">
      <el-button type="primary" :icon="Plus" @click="openCreate">发布商品</el-button>
    </PageHeader>

    <section class="surface surface--pad">
      <div class="filters">
        <el-input
          v-model="filters.goodsName"
          placeholder="搜索商品名称"
          clearable
          :prefix-icon="Search"
          style="width: 260px"
        />
      </div>

      <AppTable ref="tableRef" :request="searchGoods" :filters="filters">
        <el-table-column label="商品" min-width="300">
          <template #default="{ row }">
            <div class="goods-cell">
              <el-image :src="row.headerPic" fit="cover" class="goods-cell__pic" />
              <div class="goods-cell__meta">
                <span class="goods-cell__name">{{ row.goodsName }}</span>
                <span class="goods-cell__caption">{{ row.caption || '—' }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="140">
          <template #default="{ row }"><b class="price">{{ money(row.price) }}</b></template>
        </el-table-column>
        <el-table-column prop="brandId" label="品牌 ID" width="100" />
        <el-table-column prop="productType3Id" label="三级分类" width="110" />
        <el-table-column label="上架" width="100">
          <template #default="{ row }">
            <el-switch
              :model-value="row.isMarketable === true"
              @change="(value: any) => toggleMarketable(row, value)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </AppTable>
    </section>

    <GoodsForm v-model="formVisible" :record="editing" @saved="reload" />
    <GoodsDetail v-model="detailVisible" :record="detail" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import GoodsForm from './GoodsForm.vue'
import GoodsDetail from './GoodsDetail.vue'
import { getGoods, putAwayGoods, searchGoods } from '@/api/goods'
import { money } from '@/utils/format'
import type { Goods } from '@/api/types'

const tableRef = ref<InstanceType<typeof AppTable>>()
const formVisible = ref(false)
const detailVisible = ref(false)
const editing = ref<Goods | null>(null)
const detail = ref<Goods | null>(null)
const filters = reactive<{ goodsName: string }>({ goodsName: '' })

function reload() {
  tableRef.value?.reload()
}

async function openCreate() {
  editing.value = null
  formVisible.value = true
}

async function openEdit(row: any) {
  const full = await getGoods(row.id!)
  editing.value = full
  formVisible.value = true
}

async function openDetail(row: any) {
  detail.value = await getGoods(row.id!)
  detailVisible.value = true
}

async function toggleMarketable(row: any, value: boolean) {
  await putAwayGoods(row.id!, value)
  row.isMarketable = value
  ElMessage.success(value ? '已上架，正在同步到搜索' : '已下架，正在从搜索移除')
}
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.goods-cell {
  display: flex;
  align-items: center;
  gap: 12px;

  &__pic {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    border: 1px solid var(--ink-100);
    flex-shrink: 0;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  &__name {
    font-size: 13px;
    color: var(--ink-800);
    font-weight: 500;
  }

  &__caption {
    font-size: 11px;
    color: var(--ink-300);
  }
}

.price {
  color: #d92d20;
  font-weight: 600;
}
</style>