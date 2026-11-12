<template>
    <div class="page-header">
        <div class="page-header__text">
            <h2> {{ title }} </h2>
            <p v-if="description"> {{ description }}</p>
        </div>
        <div class="page-header__actions">
            <slot/>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description?: string}>()
</script>

<style scoped lang="scss">
.page-header {                         // 根容器（块）
    display: flex;                     // 弹性布局，子元素横向排列
    align-items: flex-end;             // 交叉轴底部对齐：标题底部与右侧按钮底部平齐
    justify-content: space-between;    // 主轴两端对齐：文本靠左、操作区靠右
    gap: 16px;                         // 子元素之间的最小间距
    flex-wrap: wrap;                   // 允许换行：窄屏时文本与按钮自动折成两行

    &__text h2 {                       // & 代表父选择器 → .page-header__text h2，即标题
        font-size: 22px;               // 标题字号
        font-weight: 650;              // 字重，比常规粗、比 bold 稍细，适合标题层级
        letter-spacing: -0.01em;       // 字间距略收紧，标题更紧凑
        color: var(--ink-900);         // 主题深色变量，用作主标题颜色
    }

    &__text p {                        // → .page-header__text p，即描述文字
        margin-top: 6px;               // 与上方标题拉开一点距离
        font-size: 13px;               // 字号比标题小，形成视觉层级
        color: var(--ink-400);         // 较浅的主题色，弱化次要信息
    }

    &__actions {                       // → .page-header__actions，右侧操作区
        display: flex;                 // 按钮横向排成一行
        align-items: center;           // 按钮在垂直方向居中对齐
        gap: 10px;                     // 按钮之间的间距
    }
}
</style>