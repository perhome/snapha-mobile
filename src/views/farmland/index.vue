<script setup lang="ts">
import { useAppStoreWithOut } from '@/store/modules/app'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'FarmlandIndex'
})
const appStore = useAppStoreWithOut()
const router = useRouter()
const switchWorkspace = (workspaceName: string) => {
  router.push('/pack/index')
}
</script>
<template>
  <van-notice-bar wrapable :scrollable="false" text="温馨提示：功能试运行中..." />
  <van-grid direction="horizontal" clickable :column-num="2">
    <van-grid-item icon="orders-o" text="物料单历史" to="goods/user-index" badge="新" />
    <van-grid-item icon="add-o" text="登记物料单" to="goods/user-add" badge="新" />
    <van-grid-item icon="orders-o" text="下菜单历史" to="cfr/output" badge="新" />
    <van-grid-item icon="add-o" text="登记下菜单" to="cfr/output-add" badge="新" />
    <van-grid-item icon="orders-o" text="预估菜历史" to="cfr/output-nextday" />
    <van-grid-item icon="add-o" text="登记预估菜" to="cfr/output-nextday-add" />
  </van-grid>
</template>
