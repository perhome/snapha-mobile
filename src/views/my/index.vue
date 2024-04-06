<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { useRouter } from 'vue-router'
import { useAppStoreWithOut } from '@/store/modules/app'
import { showConfirmDialog, showLoadingToast, showToast } from 'vant'

defineOptions({
  name: 'MyIndex'
})

const router = useRouter()
const request = useAxios()
const appStore = useAppStoreWithOut()

const upgrade = () => {
  if (typeof window.Android == 'object') {
    showLoadingToast({
      message: '更新中...',
      forbidClick: true
    })
    window.Android.upgrade()
  } else {
    showToast('当前访问方式，无需升级！')
  }
}

const downloadApp = () => {
  if (typeof window.Android == 'object') {
    showConfirmDialog({
      message: '下载完成后，请到文件管理器=>下载 目录中，选择安装 mobile-beta.apk！确定下载么'
    }).then(() => {
      window.Android.downloadFile(
        'http://127.0.0.1:9081/download/sty-beta.apk',
        '骁禾 Android 客户端',
        'snapha-beta.apk'
      )
    })
  } else {
    showToast('当前访问方式，无需升级！')
  }
}
const logout = async () => {
  // const res = await request.delete({ url: '' })
  // if (!res) return
  appStore.resetApp()

  if (typeof window.Android == 'object') {
    // window.Android.stopNativeWebsocket()
  }
  await router.push('/login')
}
</script>
<template>
  <van-cell-group>
    <van-cell title="个人资料" is-link to="/my/profile" />
    <van-cell title="更改密码" is-link to="/my/password" />
    <van-cell title="我的消息" is-link to="/my/message" />
    <van-cell title="我的待办" is-link to="/my/flowable" />
    <van-cell title="我的物料" is-link to="/my/goods" />
    <van-cell title="我的考勤/休班" is-link to="/my/attendance/index" />
    <van-cell title="我的工资" is-link to="/my/salary" />
    <van-cell title="升级基础功能" is-link @click="upgrade" />
    <van-cell title="安装最新软件" is-link @click="downloadApp" />
    <van-cell title="退出系统" is-link @click="logout" />
  </van-cell-group>
</template>
