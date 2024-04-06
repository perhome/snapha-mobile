<script setup lang="ts">
import ShopDaySteps from '@/views/component/ShopDaySteps.vue'
import { computed, onBeforeUnmount, onUnmounted, reactive, ref } from 'vue'
import { formatTime } from '@/utils'

import { useRoute, useRouter } from 'vue-router'
import { useAxios } from '@/hooks/useAxios'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'

defineOptions({
  name: 'PackOrderInner'
})

const router = useRouter()
const request = useAxios()
const loading = ref(false)

const activeOrder = ref<any[]>([])
const tempEntity = {
  hitDate: formatTime(new Date(), 'yyyy-MM-dd'),
  shopSn: ''
}
const temp = reactive({ ...tempEntity })

const onRefresh = async () => {
  loading.value = true
  await onPageLoad()
  loading.value = false
}
const getShopOrdersList = async (refresh?: Boolean) => {
  const res = await request.get({
    url: 'mapi/shop/order',
    params: temp
  })
  if (res.data.list.length > 0) {
    shopOrderList.value = res.data.list
    activeOrder.value.push(shopOrderList.value[0]['customerName'])
  }
}
const shopOrderList = ref<any[]>([])
const handleShopOrderDone = (orderId: number) => {
  showFailToast('暂无需处理！')
}
const handleShopOrderSuspend = (orderId: number) => {
  showFailToast('暂无需处理！')
}
const handleShopOrderConfirm = (order: any) => {
  const orderId = order.soid
  showConfirmDialog({
    title: '确认提示',
    message: '已收到内部订单，准备处理？'
  }).then(() => {
    request
      .post({
        url: 'api/v1/shop/order-confirm',
        data: { orderId: orderId }
      })
      .then(() => {
        showSuccessToast('提交成功！')
        order.checkoutUserId = 123
      })
      .catch(() => {
        showFailToast('提交失败，请检查确认！')
      })
  })
}

const onPageLoad = async () => {
  await getShopOrdersList()
}
const cronGetOrderHandle = setInterval(getShopOrdersList, 300000)

onBeforeUnmount(() => {
  clearInterval(cronGetOrderHandle)
})

onPageLoad()
</script>
<template>
  <shop-day-steps :shop-step-active="3" />
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <div v-if="shopOrderList.length == 0">
      <van-empty description="今日的内部订单为空" />
    </div>
    <van-collapse border v-model="activeOrder" v-else>
      <van-collapse-item
        :key="item.soid"
        :name="item.customerName"
        border
        :label="'订单： ' + item.orderDate + ' 创建：' + item.created"
        v-for="item in shopOrderList"
      >
        <template #title>
          <div :class="temp.hitDate == item.orderDate ? 'order-today' : 'order-tomorrow'">{{
            item.customerName +
            (temp.hitDate == item.orderDate ? ' 今日' : ' 明日') +
            '共下单合计 ' +
            item.amount +
            ' 千克'
          }}</div>
        </template>
        <van-notice-bar
          wrapable
          v-if="item.remark && item.remark.length > 0"
          :scrollable="false"
          :text="item.remark"
        />
        <van-list v-if="item.orderGoods && item.orderGoods.length > 0">
          <van-cell v-for="x in item.orderGoods" :key="x.sogid">
            <template #title>
              <span class="custom-title">{{ x.productName + ': ' + x.amount + ' 千克' }}</span>
            </template>
          </van-cell>
          <van-space>
            <van-button @click="handleShopOrderConfirm(item)" size="small" type="success">
              {{ item.checkoutUserId ? '已接收订单' : '接收订单' }}
            </van-button>
            <van-button @click="handleShopOrderDone(item.soid)" size="small" type="primary">
              订单发货
            </van-button>
            <van-button @click="handleShopOrderSuspend(item.soid)" size="small" type="warning">
              订单处理
            </van-button>
          </van-space>
        </van-list>
        <van-cell v-else title="今日不要菜哦" />
      </van-collapse-item>
    </van-collapse>
    <van-cell>
      <van-button
        type="primary"
        round
        :loading="loading"
        style="margin: 20px 0"
        size="large"
        @click="onRefresh"
      >
        点击刷新数据
      </van-button>
    </van-cell>
  </van-pull-refresh>
</template>
<style scoped>
.order-today {
}
.order-tomorrow {
  color: orangered;
}
</style>
