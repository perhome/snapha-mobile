<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { useRouter } from 'vue-router'
import { useAppStoreWithOut } from '@/store/modules/app'

defineOptions({
  name: 'MyAttendanceIndex'
})

const appStore = useAppStoreWithOut()
const userCode = appStore.getUserCode
</script>
<template>
  <van-cell-group>
    <van-cell title="月度考勤缺卡登记" is-link to="/my/attendance/exception-checkin" />
    <van-cell title="我的休班记录" is-link to="/my/break-day" />
    <van-cell title="我的补卡记录" is-link to="/my/absence-checkin" />
    <van-cell title="我的考勤记录" is-link to="/my/attendance" />
    <van-cell
      title="我的剩余假期"
      is-link
      :url="'http://1.13.255.199:9083/sty-tools/holiday.cgi?username=' + userCode"
    />
  </van-cell-group>
</template>
