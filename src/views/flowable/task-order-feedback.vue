<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'

import { useRoute, useRouter } from 'vue-router'
import { formatTime } from '@/utils'
import { reactive, ref } from 'vue'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import router from '@/router'
import Signature from '@/views/component/Signature.vue'

defineOptions({
  name: 'TaskOrderFeedback'
})
const route = useRoute()
const request = useAxios()
const formUrl = route.params.formUrl
const taskId = route.params.taskId
const tempEntity = {
  hitDate: formatTime(new Date(), 'yyyy-MM-dd'),
  taskId: taskId,
  whiteBox: undefined,
  blueBox: undefined,
  scrapWhiteBox: undefined,
  scrapBlueBox: undefined,
  signature: undefined
}
const temp = reactive({ ...tempEntity })

const showSignature = ref(false)
const onSubmit = async () => {
  // console.log(temp)
  showConfirmDialog({
    title: '重要提示',
    message: '确认当前数据无误，点击确认提交？'
  }).then(async () => {
    const res = await request.post({
      url: 'api/v2/flowable/form',
      data: temp
    })
    if (res.data.result && res.data.result == 1) {
      showSuccessToast('保存成功!')
      router.go(-1)
      // await router.push('/shop/day/success')
    } else {
      showFailToast('保存失败')
    }
  })
}
const setDialogVisible = (isShow: boolean) => (showSignature.value = isShow)
</script>
<template>
  <van-form @submit="onSubmit" :label-width="150">
    <van-cell-group>
      <van-field
        v-model="temp.whiteBox"
        label="正常白色周转筐"
        type="number"
        placeholder="请填写"
        required
        :rules="[{ required: true, message: '请填写数量' }]"
      />

      <van-field
        v-model="temp.blueBox"
        label="正常蓝色周转筐"
        required
        type="number"
        placeholder="请填写"
        :rules="[{ required: true, message: '请填写数量' }]"
      />
      <van-field
        v-model="temp.scrapWhiteBox"
        label="报废白色周转筐"
        type="number"
        placeholder="请填写"
      />
      <van-field
        v-model="temp.scrapBlueBox"
        label="报废蓝色周转筐"
        type="number"
        placeholder="请填写"
      />
      <van-field
        label="电子签名"
        required
        placeholder="点击这里"
        is-link
        readonly
        @click="showSignature = true"
      />
      <van-image v-if="temp.signature" width="300" height="100" :src="temp.signature" />
    </van-cell-group>
    <van-cell>
      <van-button type="primary" loading-text="保存中..." round block native-type="submit">
        提交保存
      </van-button>
    </van-cell>
  </van-form>
  <van-overlay :show="showSignature" style="z-index: 999">
    <signature
      v-if="showSignature"
      v-model="temp.signature"
      @click.stop
      @close-sign="setDialogVisible"
    />
  </van-overlay>
</template>
