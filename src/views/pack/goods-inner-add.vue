<script setup lang="ts">
import ShopDaySteps from '@/views/component/ShopDaySteps.vue'
import { computed, reactive, ref, watch } from 'vue'
import { formatTime } from '@/utils'
import { showConfirmDialog, showFailToast, showNotify, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { useAxios } from '@/hooks/useAxios'
defineOptions({
  name: 'PackGoodsInnerAdd'
})
const router = useRouter()
const request = useAxios()
const loading = ref(false)
const onRefresh = async () => {
  showConfirmDialog({ title: '确认刷新?', message: '刷新会丢失现有未保存的的数据？' }).then(
    async () => {
      loading.value = true
      await onPageLoad()
      loading.value = false
    }
  )
}
const formGoods = {
  sgid: 0,
  productName: '',
  amount: undefined,
  dayAmount: undefined
}
const tempEntity = {
  hitDate: formatTime(new Date(), 'yyyy-MM-dd'),
  fromShopSn: 'YUGU',
  toShopSn: 'INNER'
}
const temp = reactive({ ...tempEntity })
const shopGoodsList = ref([])
const shopDayGoodsList = ref([])
const formShopGoodsList = ref<any[]>([])
const setFormShopGoodsList = () => {
  formShopGoodsList.value = []
  if (shopGoodsList.value.length == 0) {
    return
  }
  shopGoodsList.value.forEach((item: any) => {
    let x = { ...formGoods }
    x.sgid = item.sgid
    x.amount = item.amount
    x.productName = item.productName
    let d: any = shopDayGoodsList.value.find((x: any) => x.productName == item.productName)
    if (d) x.dayAmount = d.amount
    formShopGoodsList.value.push(x)
  })
}
const onSubmit = async () => {
  let data = formShopGoodsList.value.filter((v: any) => v.dayAmount)
  if (data.length == 0) {
    showFailToast('无数据！')
    return
  }
  let dataText = ''
  data.forEach((v: any) => (dataText += v.productName + '(' + v.dayAmount + ') '))
  showConfirmDialog({
    title: '重要提示',
    message: dataText + ' 提交会清除当日之前提交的数据？'
  }).then(async () => {
    const res = await request.post({
      url: 'mapi/shop/goods',
      data: { data: data, shopSn: temp.toShopSn, hitDate: temp.hitDate }
    })
    if (res) {
      showSuccessToast('保存成功!')
      showNotify({ type: 'success', message: '已成功保存数据，当前页面可刷新或退出' })
    }
    if (res.data.errorCode == 404) {
      getShopGoodsList(false)
    }
  })
}
const getShopGoodsList = async (refresh?: Boolean) => {
  const res = await request.get({
    url: 'mapi/shop/goods',
    params: temp
  })
  if (res) {
    shopGoodsList.value = res.data.shopGoodsList
    shopDayGoodsList.value = res.data.shopDayGoodsList
  }
}
const showAppendBox = ref(false)
const btnAppendBox = () => {
  showConfirmDialog({
    title: '保存提示',
    message: '产品： ' + append.productName + ' 库存： ' + append.amount + 'Kg 继续提交？'
  }).then(() => {
    append.dayAmount = append.amount
    let x = { ...append }
    formShopGoodsList.value.push(x)
    request
      .post({
        url: 'api/v1/shop-goods/append',
        data: { ...append, hitDate: temp.hitDate, shopSn: 'YUGU' }
      })
      .then(() => {
        showNotify({ type: 'warning', message: '已成功追加预估菜' })
      })
    Object.assign(append, formGoods)
  })
}
const append = reactive({ ...formGoods })
const onPageLoad = async () => {
  await getShopGoodsList()
  setFormShopGoodsList()
  loading.value = false
}
onPageLoad()
</script>
<template>
  <van-sticky :offset-top="46">
    <shop-day-steps :shop-step-active="1" />
  </van-sticky>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <van-form @submit="onSubmit" label-width="100">
      <van-cell-group>
        <van-field v-model="temp.hitDate" label="当前日期" readonly is-link />
        <van-field
          v-model="item.dayAmount"
          v-for="item in formShopGoodsList"
          type="number"
          clearable
          :key="item.sgid"
          placeholder="请输入重量"
          :label="item.productName"
        >
          <template #button>
            <van-tag type="primary"> 小于 {{ item.amount }}</van-tag>
          </template>
        </van-field>
      </van-cell-group>

      <div v-if="shopGoodsList.length == 0">
        <van-empty description="今日的预估菜去哪里了" />
      </div>
      <van-cell>
        <van-button type="primary" loading-text="申请中..." round block native-type="submit">
          提交保存
        </van-button>
        <van-space direction="vertical" fill>
          <van-button type="success" round size="large" @click.prevent="onPageLoad">
            点击这里更新数据
          </van-button>
          <van-button
            type="warning"
            loading-text="申请中..."
            round
            @click="showAppendBox = true"
            block
          >
            追加产品库存
          </van-button>
        </van-space>
      </van-cell>
    </van-form>
  </van-pull-refresh>
  <van-popup
    v-model:show="showAppendBox"
    position="bottom"
    closeable
    close-icon="close"
    :style="{ height: '50%' }"
  >
    <van-notice-bar wrapable :scrollable="false" text="注意：追加没有的产品类别项目!!!" />
    <van-form @submit="btnAppendBox" style="margin: 10px 0 0">
      <van-cell-group inset>
        <van-field
          v-model="append.productName"
          name="productName"
          label="产品名"
          placeholder="输入产品名"
          :rules="[{ required: true, message: '请填写产品名' }]"
        />
        <van-field
          v-model="append.amount"
          type="number"
          name="amount"
          label="数量"
          placeholder="请输入数量（千克）"
          :rules="[{ required: true, message: '请填写数量' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="warning" native-type="submit">追加可选菜品</van-button>
      </div>
    </van-form>
  </van-popup>
</template>
