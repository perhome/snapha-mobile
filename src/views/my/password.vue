<script setup lang="ts">
import { reactive } from 'vue'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useAxios } from '@/hooks/useAxios'
import { closeToast, showFailToast, showLoadingToast, showNotify, showSuccessToast } from 'vant'

import { useRouter } from 'vue-router'

defineOptions({
  name: 'MyLoading'
})

const appStore = useAppStoreWithOut()

const request = useAxios()
const router = useRouter()

const tempEntity: {
  password: string | undefined
  userCode: string
} = {
  password: undefined,
  userCode: appStore.getUserCode
}
const temp = reactive({ ...tempEntity })

const onSubmit = async () => {
  if (!temp.password || temp.password.length < 5) {
    showNotify({ type: 'danger', message: '密码长度太短，最短五位！' })
    return
  }
  const toast = showLoadingToast({
    duration: 0,
    message: '保存中...',
    forbidClick: true
  })
  const res = await request.post({
    url: 'api/v2/user/password',
    data: temp
  })
  closeToast()
  if (res) {
    showSuccessToast('重置密码成功！')
    router.push('/my')
    Object.assign(temp, tempEntity)
  } else {
    showFailToast('重置密码失败！')
  }
}
</script>
<template>
  <van-notice-bar wrapable :scrollable="false" text="第一次登陆之后，你应立即重置你的密码！" />
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <van-field v-model="temp.userCode" placeholder="工号" label="工号" readonly />
      <van-field v-model="temp.password" placeholder="请输入新密码" label="新密码" />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button type="primary" loading-text="申请中..." round block native-type="submit">
        重置密码
      </van-button>
    </div>
  </van-form>
</template>
