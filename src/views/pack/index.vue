<script setup lang="ts">
import { useAppStoreWithOut } from '@/store/modules/app'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'PackIndex'
})

const appStore = useAppStoreWithOut()
const router = useRouter()
const switchWorkspace = (workspaceName: string) => {
  appStore.setWorkspace(workspaceName)
  router.push('/farmland/index')
}
</script>
<template>
  <van-notice-bar wrapable :scrollable="false" text="温馨提示：功能试运行中..." />
  <van-grid direction="horizontal" :column-num="2">
    <van-grid-item icon="orders-o" text="上内部菜" to="/pack/goods-inner-add" badge="新" />
    <van-grid-item icon="orders-o" text="上菜记录" to="/pack/goods-inner" />
    <van-grid-item icon="orders-o" text="内部订单" to="/pack/order-inner" badge="新" />
    <van-grid-item icon="orders-o" text="内部发货" to="/pack/order-inner-checkin" />
    <van-grid-item icon="orders-o" text="下菜单据" to="/pack/output" badge="新" />
    <van-grid-item
      icon="orders-o"
      text="入库单据"
      :to="{ path: '/pack/output', query: { status: 8 } }"
    />
    <van-grid-item icon="orders-o" text="外部订单" to="/pack/order" />
    <van-grid-item icon="orders-o" text="外部发货" to="/pack/order-checkin" />
  </van-grid>
  <van-cell-group>
    <van-cell title="下菜单汇总确认" is-link to="/farmland/admin/output-checkin" />
    <van-cell title="包装库存数据管理" to="/pack/output-stock" is-link />
  </van-cell-group>
  <van-button
    color="linear-gradient(to right,  #ee0a24, #ff6034)"
    icon="share"
    id="btnSwitch"
    size="small"
    round
    @click="switchWorkspace('farmland')"
  >
    转种植
  </van-button>
</template>
