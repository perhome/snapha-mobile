<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { useRouter } from 'vue-router'
import { useAppStoreWithOut } from '@/store/modules/app'
import { Toast } from 'vant'
import { useCache } from '@/hooks/useCache'

defineOptions({
  name: 'StyIndex'
})

const router = useRouter()
const request = useAxios()
</script>
<template>
  <van-cell-group>
    <van-cell title="账务公开" is-link to="/sty/accounts" />
    <van-cell title="园区检查" is-link to="/sty/spot-issue" />
    <van-cell title="外部评价" is-link to="/sty/feedback" />
    <van-cell title="公司与部门文件" is-link to="/sty/files" />
    <van-cell title="业务备忘录" is-link to="/sty/memo" />
  </van-cell-group>
</template>
