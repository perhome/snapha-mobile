<script setup lang="ts">
import { useAppStoreWithOut } from '@/store/modules/app'

defineOptions({
  name: 'MyBreakLeftDay'
})
const appStore = useAppStoreWithOut()
const userCode = appStore.getUserCode
</script>
<template>
  <van-notice-bar wrapable :scrollable="false" text="注意：剩余假期请点击如下按钮!!!" />
  <van-form>
    <van-button
      style="margin: 10px 0"
      type="primary"
      block
      :url="'http://1.13.255.199:9083/sty-tools/holiday.cgi?username=' + userCode"
    >
      点击查询剩余假期
    </van-button>
  </van-form>
</template>
