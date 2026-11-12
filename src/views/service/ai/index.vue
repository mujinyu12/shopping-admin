<template>
  <div class="page">
    <PageHeader title="AI 知识库" description="维护智能客服的 FAQ 问答库与敏感词表（对话测试属于商城用户端，不在运营后台）" />

    <el-tabs v-model="tab" class="ai-tabs surface surface--pad">
      <!-- ------------------------------ FAQ ------------------------------ -->
      <el-tab-pane label="FAQ 知识库" name="faq">
        <div class="filters">
          <el-select v-model="faqFilters.categoryId" placeholder="全部分类" clearable style="width: 160px">
            <el-option v-for="(label, value) in FAQ_CATEGORY" :key="value" :label="label" :value="Number(value)" />
          </el-select>
          <el-button type="primary" :icon="Plus" @click="openFaq()">新增问答</el-button>
        </div>

        <AppTable ref="faqTableRef" :request="searchFaq" :filters="faqFilters">
          <el-table-column label="问题" min-width="240" show-overflow-tooltip>
            <template #default="{ row }">{{ row.question }}</template>
          </el-table-column>
          <el-table-column label="答案" min-width="300" show-overflow-tooltip>
            <template #default="{ row }">{{ row.answer }}</template>
          </el-table-column>
          <el-table-column label="分类" width="110">
            <template #default="{ row }">{{ FAQ_CATEGORY[row.categoryId] || '其他' }}</template>
          </el-table-column>
          <el-table-column prop="useCount" label="命中次数" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openFaq(row)">编辑</el-button>
              <AppDeleteBtn :title="`确定删除该问答吗？`" @confirm="removeFaq(row)" />
            </template>
          </el-table-column>
        </AppTable>
      </el-tab-pane>

      <!-- ------------------------------ 敏感词 ------------------------------ -->
      <el-tab-pane label="敏感词" name="word">
        <div class="filters">
          <el-input v-model="wordFilters.word" placeholder="搜索词条" clearable style="width: 200px" />
          <el-select v-model="wordFilters.type" placeholder="全部类型" clearable style="width: 150px">
            <el-option label="拦截 (deny)" value="deny" />
            <el-option label="放行 (allow)" value="allow" />
          </el-select>
          <el-button type="primary" :icon="Plus" @click="openWord">新增词条</el-button>
        </div>

        <AppTable ref="wordTableRef" :request="searchWords" :filters="wordFilters">
          <el-table-column prop="word" label="词条" min-width="220" />
          <el-table-column label="类型" width="130">
            <template #default="{ row }">
              <el-tag :type="row.type === 'deny' ? 'danger' : 'success'" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <AppDeleteBtn :title="`确定删除词条「${row.word}」吗？`" @confirm="removeWord(row)" />
            </template>
          </el-table-column>
        </AppTable>
      </el-tab-pane>
    </el-tabs>

    <!-- FAQ 编辑 -->
    <AppDialog v-model="faqDialog" :title="faqForm.id ? '编辑问答' : '新增问答'" width="720px" :loading="faqSaving" @submit="saveFaq">
      <el-form ref="faqFormRef" :model="faqForm" :rules="faqRules" label-width="80px">
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="faqForm.categoryId" style="width: 220px">
            <el-option v-for="(label, value) in FAQ_CATEGORY" :key="value" :label="label" :value="Number(value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="问题" prop="question">
          <el-input v-model="faqForm.question" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="faqForm.answer" type="textarea" :rows="6" maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="faqForm.status" :active-value="1" :inactive-value="0" active-text="启用" />
        </el-form-item>
      </el-form>
    </AppDialog>

    <!-- 敏感词新增 -->
    <AppDialog v-model="wordDialog" title="新增敏感词" :loading="wordSaving" @submit="saveWord">
      <el-form ref="wordFormRef" :model="wordForm" :rules="wordRules" label-width="70px">
        <el-form-item label="词条" prop="word">
          <el-input v-model="wordForm.word" maxlength="30" placeholder="如 刷单" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="wordForm.type">
            <el-radio-button value="deny">拦截</el-radio-button>
            <el-radio-button value="allow">放行</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import AppTable from '@/components/AppTable.vue'
import AppDialog from '@/components/AppDialog.vue'
import AppDeleteBtn from '@/components/AppDeleteBtn.vue'
import { addFaq, addWord, deleteFaq, deleteWord, searchFaq, searchWords, updateFaq } from '@/api/ai'
import { FAQ_CATEGORY } from '@/utils/constants'
import type { Faq, SensitiveWord } from '@/api/types'

const tab = ref('faq')

/* -------------------------------- FAQ -------------------------------- */
const faqTableRef = ref<InstanceType<typeof AppTable>>()
const faqFilters = reactive<{ categoryId?: number }>({ categoryId: undefined })
const faqDialog = ref(false)
const faqSaving = ref(false)
const faqFormRef = ref<FormInstance>()
const faqForm = reactive<Faq>({ question: '', answer: '', categoryId: 1, status: 1 })
const faqRules: FormRules = {
  question: [{ required: true, message: '请输入问题', trigger: 'blur' }],
  answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

function openFaq(row?: any) {
  faqForm.id = row?.id
  faqForm.question = row?.question ?? ''
  faqForm.answer = row?.answer ?? ''
  faqForm.categoryId = row?.categoryId ?? 1
  faqForm.status = row?.status ?? 1
  faqForm.useCount = row?.useCount ?? 0
  faqDialog.value = true
  nextTick(() => faqFormRef.value?.clearValidate())
}

async function saveFaq() {
  const valid = await faqFormRef.value?.validate().catch(() => false)
  if (!valid) return
  faqSaving.value = true
  try {
    if (faqForm.id) {
      await updateFaq(faqForm)
      ElMessage.success('修改成功')
    } else {
      await addFaq(faqForm)
      ElMessage.success('新增成功')
    }
    faqDialog.value = false
    faqTableRef.value?.reload()
  } finally {
    faqSaving.value = false
  }
}

async function removeFaq(row: any) {
  await deleteFaq(row.id!)
  ElMessage.success('删除成功')
  faqTableRef.value?.reload()
}

/* ------------------------------ 敏感词 ------------------------------ */
const wordTableRef = ref<InstanceType<typeof AppTable>>()
const wordFilters = reactive<{ word?: string; type?: string }>({ word: '', type: undefined })
const wordDialog = ref(false)
const wordSaving = ref(false)
const wordFormRef = ref<FormInstance>()
const wordForm = reactive<SensitiveWord>({ word: '', type: 'deny' })
const wordRules: FormRules = {
  word: [{ required: true, message: '请输入词条', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

function openWord() {
  wordForm.word = ''
  wordForm.type = 'deny'
  wordDialog.value = true
  nextTick(() => wordFormRef.value?.clearValidate())
}

async function saveWord() {
  const valid = await wordFormRef.value?.validate().catch(() => false)
  if (!valid) return
  wordSaving.value = true
  try {
    await addWord(wordForm)
    ElMessage.success('新增成功')
    wordDialog.value = false
    wordTableRef.value?.reload()
  } finally {
    wordSaving.value = false
  }
}

async function removeWord(row: any) {
  await deleteWord(row.id!)
  ElMessage.success('删除成功')
  wordTableRef.value?.reload()
}
</script>

<style scoped lang="scss">
.ai-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
</style>