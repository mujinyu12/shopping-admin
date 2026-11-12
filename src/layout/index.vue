<template>
    <div class="layout" :class="{ 'is-collapsed': app.collapsed}">
        <AppSidebar/>
        <div class="layout__main">
            <AppHeader/>
            <main class="layout__content">
                <router-view v-slot="{ Component }">
                    <transition name="fade-slide" mode="out-in">
                        <component :is="Component"/>
                    </transition>
                </router-view>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import { useAppStore } from '@/stores/app' 

const app = useAppStore()
</script>

<style scoped lang="scss">
.layout {
    display: flex;
    height: 100%;
    overflow: hidden;

    &__main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }

    &__content {
        flex: 1;
        overflow-y: auto;
        padding: 20px 24px 32px;
        background: radial-gradient(1200px 400px at 100% -10%, rgba(14, 165, 164, 0.08), transparent 60%),
        var(--ink-50);
    }
}
</style>