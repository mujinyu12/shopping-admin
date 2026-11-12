<template>
  <div class="rich-editor" :class="{ 'is-focus': focused }">
    <div class="rich-editor__toolbar">
      <button
        v-for="tool in tools"
        :key="tool.command"
        type="button"
        class="rich-editor__tool"
        :title="tool.label"
        @mousedown.prevent="exec(tool.command, tool.value)"
      >
        <span v-html="tool.icon" />
      </button>
      <span class="rich-editor__divider" />
      <button type="button" class="rich-editor__tool rich-editor__tool--text" title="插入链接" @mousedown.prevent="addLink">
        Link
      </button>
      <button type="button" class="rich-editor__tool rich-editor__tool--text" title="源码" @click="toggleSource">
        {{ source ? '预览' : 'HTML' }}
      </button>
    </div>

    <textarea v-if="source" v-model="inner" class="rich-editor__source" spellcheck="false" />
    <div
      v-else
      ref="editableRef"
      class="rich-editor__body"
      contenteditable="true"
      data-placeholder="请输入商品介绍，支持加粗、列表、链接…"
      @input="onInput"
      @focus="focused = true"
      @blur="focused = false"
      @paste="onPaste"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ modelValue?: string }>(), { modelValue: '' })
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const editableRef = ref<HTMLDivElement>()
const focused = ref(false)
const source = ref(false)
const inner = ref(props.modelValue || '')

const tools = [
  { command: 'bold', label: '加粗', icon: '<b>B</b>' },
  { command: 'italic', label: '斜体', icon: '<i>I</i>' },
  { command: 'underline', label: '下划线', icon: '<u>U</u>' },
  { command: 'formatBlock', value: 'h2', label: '标题', icon: 'H' },
  { command: 'insertUnorderedList', label: '无序列表', icon: '•≡' },
  { command: 'insertOrderedList', label: '有序列表', icon: '1≡' }
]

function syncFromProp() {
  inner.value = props.modelValue || ''
  if (!source.value && editableRef.value && editableRef.value.innerHTML !== inner.value) {
    editableRef.value.innerHTML = inner.value
  }
}

watch(() => props.modelValue, syncFromProp, { immediate: true })
watch(source, async (value) => {
  if (!value) {
    await nextTick()
    if (editableRef.value) editableRef.value.innerHTML = inner.value
  }
})

function exec(command: string, value?: string) {
  editableRef.value?.focus()
  document.execCommand(command, false, value)
  onInput()
}

function addLink() {
  const url = window.prompt('请输入链接地址')
  if (!url) return
  editableRef.value?.focus()
  document.execCommand('createLink', false, url)
  onInput()
}

function onInput() {
  const html = editableRef.value?.innerHTML ?? ''
  inner.value = html
  emit('update:modelValue', html)
}

function onPaste(event: ClipboardEvent) {
  // 粘贴时去掉外部样式，只保留纯文本，避免把网页 CSS 带进商品详情
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain') ?? ''
  document.execCommand('insertText', false, text)
}

function toggleSource() {
  source.value = !source.value
  if (source.value) inner.value = editableRef.value?.innerHTML ?? inner.value
  else emit('update:modelValue', inner.value)
}
</script>

<style scoped lang="scss">
.rich-editor {
  border: 1px solid var(--ink-200);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.18s var(--ease), border-color 0.18s var(--ease);

  &.is-focus {
    border-color: var(--brand-400);
    box-shadow: 0 0 0 4px var(--brand-50);
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    background: #fbfcfe;
    border-bottom: 1px solid var(--ink-100);
  }

  &__tool {
    min-width: 30px;
    height: 28px;
    padding: 0 8px;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--ink-600);
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: var(--brand-50);
      color: var(--brand-700);
    }
  }

  &__tool--text {
    font-size: 11px;
    letter-spacing: 0.04em;
  }

  &__divider {
    width: 1px;
    height: 16px;
    background: var(--ink-100);
    margin: 0 4px;
  }

  &__body {
    min-height: 220px;
    max-height: 460px;
    overflow-y: auto;
    padding: 14px 16px;
    outline: none;
    font-size: 13px;
    line-height: 1.75;
    color: var(--ink-700);

    &:empty::before {
      content: attr(data-placeholder);
      color: var(--ink-300);
    }

    :deep(h2) {
      font-size: 17px;
      margin: 12px 0 8px;
    }
    :deep(img) {
      max-width: 100%;
      border-radius: 10px;
    }
  }

  &__source {
    width: 100%;
    min-height: 220px;
    border: none;
    outline: none;
    resize: vertical;
    padding: 14px 16px;
    font-family: ui-monospace, Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.7;
    color: var(--ink-600);
  }
}
</style>