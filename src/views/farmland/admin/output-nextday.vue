<script setup lang="ts">
import { formatTime } from '@/utils'
import { reactive, ref, watch } from 'vue'
import {
  closeToast,
  showConfirmDialog,
  showDialog,
  showFailToast,
  showLoadingToast,
  showNotify,
  showSuccessToast
} from 'vant'
import { useAxios } from '@/hooks/useAxios'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
defineOptions({
  name: 'FarmlandAdminOutputNextDay'
})

const request = useAxios()

const date = new Date()
date.setDate(date.getDate() + 1)
const today = formatTime(date, 'yyyy-MM-dd')
const outputEntity: any = {
  hitDate: today,
  groupBy: 'product',
  workspaceName: '库存',
  productName: undefined,
  amount: undefined,
  cfrWorkspaceId: undefined
}
const temp = reactive({ ...outputEntity })
const myOutputNextdayList = ref<any>([])

const onSubmit = async () => {
  if (temp.groupBy != 'product') {
    showFailToast('当前分组方式不正确')
    return
  }
  showDialog({
    title: '生成预估菜',
    message: '确认提交？'
  }).then(async () => {
    const toast = showLoadingToast({
      duration: 0,
      message: '文件生成中...',
      forbidClick: true
    })
    const res = await request.post({
      url: 'api/v1/my/cfr-product/output-nextday/xlsx',
      data: myOutputNextdayList.value
    })
    closeToast()
    showConfirmDialog({
      message: '文件已生成成功，请点击确定下载'
    }).then(() => {
      if (typeof window.Android == 'object') {
        window.Android.downloadFile(res.data.url, '预估菜下载', res.data.name + '.xlsx')
        window.Android.toClipboard(encodeURI(res.data.url))
        showSuccessToast('链接已复制')
      } else {
        toClipboard(encodeURI(res.data.url))
        showSuccessToast('复制下载链接成功')
      }
    })
  })
}
const handleCopy = () => {
  let toClipboardText = '今日预估菜\n'
  myOutputNextdayList.value.forEach((item: any) => {
    toClipboardText += item.workspaceParentName + ' ' + item.productName + item.amount + 'Kg\n'
  })
  if (typeof window.Android == 'object') {
    window.Android.toClipboard(toClipboardText)
  } else {
    toClipboard(toClipboardText)
    showSuccessToast('复制成功')
  }
}
const showOutputAppend = ref(false)
const handleAppend = () => {
  if (!temp.amount || !temp.workspaceName || !temp.productName) {
    showFailToast('没有填写完整数据')
    return
  }
  myOutputNextdayList.value.push({
    workspaceParentName: temp.workspaceName,
    productName: temp.productName,
    amount: temp.amount
  })
  Object.assign(temp, outputEntity)
  showSuccessToast('追加成功')
}
const handleUpdate = async () => {
  showLoadingToast('加载中')
  await getOutputNextdayList()
  showSuccessToast('更新完成')
}
const getOutputNextdayList = async () => {
  showLoadingToast('加载中...')
  const res = await request.get({
    url: 'api/v1/my/cfr-product/output-nextday/report',
    params: { hitDate: temp.hitDate, groupBy: temp.groupBy }
  })
  closeToast()
  myOutputNextdayList.value = res.data.list
}
getOutputNextdayList()

watch(
  () => temp.groupBy,
  () => getOutputNextdayList()
)
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-field label="分组方式">
      <template #input>
        <van-radio-group v-model="temp.groupBy" direction="horizontal">
          <van-radio name="product">产品</van-radio>
          <van-radio name="workspaceProduct">位置与产品</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-cell-group>
      <van-field v-model="temp.hitDate" label="预估日期" readonly />
      <van-field
        v-model="item.amount"
        :label="item.productName"
        placeholder="预估产量"
        clearable
        v-for="item in myOutputNextdayList"
        :key="item.cponid"
        type="number"
      >
        <template #extra> Kg @{{ item.workspaceParentName }} </template>
      </van-field>
      <van-empty description="暂时没有数据" v-if="myOutputNextdayList.length == 0" />
      <van-cell>
        <van-space direction="vertical" fill>
          <van-button type="primary" loading-text="申请中..." round block native-type="submit">
            生成预估菜报表
          </van-button>
          <van-button type="success" @click="showOutputAppend = true" round block>
            追加产品库存
          </van-button>
          <van-button type="primary" @click="handleCopy" round block> 复制预估菜信息 </van-button>
          <van-button type="primary" @click="handleUpdate" round block> 刷新页面数据 </van-button>
        </van-space>
      </van-cell>
    </van-cell-group>
  </van-form>
  <van-popup
    v-model:show="showOutputAppend"
    position="bottom"
    :style="{ height: '80%', width: '100%' }"
  >
    <van-cell-group>
      <van-notice-bar>填写提交追加到预估菜，可连续追加</van-notice-bar>
      <van-field v-model="temp.workspaceName" label="所处位置" readonly placeholder="填写" />
      <van-field v-model="temp.productName" label="产品名称" placeholder="填写" />
      <van-field v-model="temp.amount" type="number" label="预估产量" placeholder="填写" />
      <van-cell>
        <van-button type="success" @click="handleAppend" round block> 追加产品库存 </van-button>
      </van-cell>
    </van-cell-group>
  </van-popup>
</template>
