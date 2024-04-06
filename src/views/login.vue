<script setup lang="ts">
import { reactive } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useRouter } from 'vue-router'

const router = useRouter()
const appStore = useAppStoreWithOut()

const request = useAxios()
const formData = reactive({
  deviceId: 'mobile',
  forceLogin: 1,
  passport: 'demo',
  password: 'demo'
})

const onSubmit = async () => {
  const res = await request.post({ url: 'api/v1/auth/login', data: formData })
  const ret = res.data

  appStore.setAccessToken(ret.accessToken)
  appStore.setRefreshToken(ret.refreshToken)
  // 注册会话
  // socketStore.sendObj({ invoke: 'user/register', data: { accessToken: result.accessToken } })
  // if (typeof window.Android == 'object') {
  //   window.Android.startNativeWebsocket(
  //     import.meta.env.VITE_API_BASEPATH + 'app/websocket',
  //     result.accessToken
  //   )
  // }
  await router.push('/')
}
</script>
<template>
  <van-form @submit="onSubmit" style="margin: 200px auto 0; width: 90%">
    <van-field
      v-model="formData.passport"
      name="passport"
      label="账户"
      placeholder="请输入员工编码"
      :rules="[{ required: true, message: '账户不能为空' }]"
    />
    <van-field
      v-model="formData.password"
      type="password"
      name="password"
      current-password
      label="密码"
      placeholder="请输入密码"
      :rules="[{ required: true, message: '密码不能为空' }]"
    />
    <van-field name="forceLogin" label="强制登陆">
      <template #input>
        <van-checkbox v-model="formData.forceLogin" name="1" />
      </template>
    </van-field>

    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 登陆 </van-button>
    </div>
  </van-form>
</template>
