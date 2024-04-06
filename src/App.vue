<script setup lang="ts">
import { useAppStoreWithOut } from '@/store/modules/app'
import { useAxios } from '@/hooks/useAxios'
const useAppStore = useAppStoreWithOut()
const request = useAxios()

if (useAppStore.getAccessToken) {
  // const appStore = useAppStoreWithOut()
  // appStore.setTitle('sds')
  // appStore.setAccessToken(userInfo.accessToken)
}
</script>
<template>
  <van-config-provider
    theme="light"
    :theme-vars="{
      tabbarBackground: '#42b983',
      tabbarItemActiveColor: '#ffffff',
      tabbarItemActiveBackground: '#42b983',
      navBarBackground: '#42b983',
      navBarTextColor: '#ffffff',
      navBarTitleTextColor: '#ffffff',
      navBarIconColor: '#ffffff',
      tabbarItemFontSize: '18px',
      tabbarHeight: '60px',
      dropdownMenuTitleFontSize: '18px'
    }"
  >
    <router-view />
  </van-config-provider>
</template>
<style>
body {
  margin: 0;
}
:root {
  --van-primary-color: #42b983;
  --van-success-color: #1989fa;
  --van-font-size-xs: 12px;
  --van-font-size-sm: 14px;
  --van-font-size-md: 16px;
  --van-font-size-lg: 20px;
  --van-font-bold: 600;
  --van-line-height-xs: 16px;
  --van-line-height-sm: 20px;
  --van-line-height-md: 22px;
  --van-line-height-lg: 28px;
}
#btnSwitch {
  position: fixed;
  right: 10px;
  bottom: 70px;
  height: 36px;
  overflow: hidden;
  transition: width 0.6s;
}
</style>
