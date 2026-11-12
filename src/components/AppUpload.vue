<template>
  <div class="app-upload">
    <div v-for="(file, index) in files" :key="file.url" class="app-upload__item">
      <el-image :src="file.url" fit="cover" :preview-src-list="[file.url]" preview-teleported />
      <button class="app-upload__remove" type="button" @click="remove(index)">
        <el-icon :size="12"><Close /></el-icon>
      </button>
    </div>

    <button v-if="files.length < limit" class="app-upload__trigger" type="button" @click="pick">
      <el-icon :size="20"><Plus /></el-icon>
      <span>{{ uploading ? '上传中…' : '上传图片' }}</span>
    </button>

    <input ref="inputRef" type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden @change="onFileChange" />
    <p class="app-upload__tip">支持 jpg / png / webp，单张不超过 5MB</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/api/request'

const props = withDefaults(defineProps<{ modelValue?: string | string[]; limit?: number }>(), {
  modelValue: '',
  limit: 1
})
const emit = defineEmits<{ (e: 'update:modelValue', value: string | string[]): void }>()

const inputRef = ref<HTMLInputElement>()
const uploading = ref(false)

const files = computed(() => {
  const value = props.modelValue
  if (!value) return [] as Array<{ url: string }>
  const list = Array.isArray(value) ? value : [value]
  return list.filter(Boolean).map((url) => ({ url }))
})

function pick() {
  inputRef.value?.click()
}

function commit(list: string[]) {
  emit('update:modelValue', props.limit === 1 ? list[0] || '' : list)
}

function remove(index: number) {
  const list = files.value.map((f) => f.url)
  list.splice(index, 1)
  commit(list)
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片不能超过 5MB')
    return
  }
  const formData = new FormData()
  formData.append('file', file)
  uploading.value = true
  try {
    const url = await http.post('/file/uploadImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const list = files.value.map((f) => f.url)
    list.push(url as unknown as string)
    commit(list.slice(0, props.limit))
    ElMessage.success('上传成功')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped lang="scss">
.app-upload {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  &__item {
    position: relative;
    width: 84px;
    height: 84px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--ink-100);
    box-shadow: var(--shadow-xs);

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }
  }

  &__remove {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background: rgba(16, 24, 40, 0.62);
    color: #fff;
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  &__trigger {
    width: 84px;
    height: 84px;
    border-radius: 12px;
    border: 1px dashed var(--ink-200);
    background: #fbfcfe;
    color: var(--ink-400);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    transition: all 0.18s var(--ease);

    &:hover {
      border-color: var(--brand-400);
      color: var(--brand-600);
      background: var(--brand-50);
    }
  }

  &__tip {
    width: 100%;
    margin: 0;
    font-size: 11px;
    color: var(--ink-300);
  }
}
</style>