<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router'
import { useAppStoreWithOut } from '@/store/modules/app'

const route = useRoute()
const router = useRouter()
const title = route.meta.title
</script>
<template>
  <van-nav-bar
    :fixed="true"
    :title="title"
    :placeholder="true"
    :left-arrow="true"
    safe-area-inset-top
    @click-left="$router.go(-1)"
  >
    <template #right>
      <van-icon name="chat-o" size="2rem" />
    </template>
  </van-nav-bar>
  <router-view />
</template>
