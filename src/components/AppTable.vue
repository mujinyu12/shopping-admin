<template>
  <div class="app-table">
    <div v-if="$slots.toolbar" class="app-table__toolbar">
      <slot name="toolbar" />
    </div>

    <el-table
      v-loading="loading"
      :data="rows"
      stripe
      border
      row-key="id"
      @selection-change="onSelectionChange"
    >
      <slot />
      <template #empty>
        <el-empty description="暂无数据" :image-size="90" />
      </template>
    </el-table>

    <div class="app-table__footer">
      <span class="app-table__total">共 {{ total }} 条</span>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="size"
        background
        layout="prev, pager, next, sizes"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        @current-change="fetchData"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

type RequestFn = (params: any) => Promise<any>;

const props = withDefaults(
  defineProps<{
    request: RequestFn;
    filters?: Record<string, unknown>;
    pageSize?: number;
    immediate?: boolean;
  }>(),
  { filters: () => ({}), pageSize: 10, immediate: true },
);

const emit = defineEmits<{
  (e: "loaded", rows: any[]): void;
  (e: "selection-change", rows: any[]): void;
}>();

const rows = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const size = ref(props.pageSize);
const loading = ref(false);

function normalize(res: any) {
  if (!res) return { list: [], total: 0, page: 1, size: size.value };
  if (Array.isArray(res.records)) {
    return {
      list: res.records as any[],
      total: Number(res.total) || 0,
      page: Number(res.current) || page.value,
      size: Number(res.size) || size.value,
    };
  }
  if (Array.isArray(res.list)) {
    return {
      list: res.list as any[],
      total: Number(res.total) || 0,
      page: Number(res.page) || page.value,
      size: Number(res.size) || size.value,
    };
  }
  if (Array.isArray(res))
    return { list: res as any[], total: res.length, page: 1, size: res.length };
  return { list: [], total: 0, page: 1, size: size.value };
}

async function fetchData() {
  loading.value = true;
  try {
    const res = await props.request({
      ...props.filters,
      page: page.value,
      size: size.value,
    });
    const data = normalize(res);
    rows.value = data.list;
    total.value = data.total;
    emit("loaded", data.list);
  } finally {
    loading.value = false;
  }
}

function onSizeChange() {
  page.value = 1;
  fetchData();
}

/** 重置到第一页并刷新（搜索、新增、编辑后调用） */
function reload(resetPage = false) {
  if (resetPage) page.value = 1;
  return fetchData();
}

function onSelectionChange(selection: any[]) {
  emit("selection-change", selection);
}

watch(
  () => props.filters,
  () => reload(true),
  { deep: true },
);

onMounted(() => {
  if (props.immediate) fetchData();
});

defineExpose({ reload, fetchData });
</script>

<style scoped lang="scss">
.app-table {
  &__toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
  }

  &__total {
    font-size: 12px;
    color: var(--ink-400);
  }
}
</style>
