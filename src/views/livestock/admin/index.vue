<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'

defineOptions({
  name: 'LivestockAdmin'
})

const request = useAxios()
</script>
<template>
  <van-cell-group>
    <van-cell title="今日活动" is-link to="/livestock/admin/activity" />
    <van-cell title="出入栏记录" is-link to="/livestock/inout-index" />
    <van-cell title="养殖出栏数据汇总" to="/livestock/inout-report" is-link />
    <van-cell title="养殖存栏数据汇总" to="/livestock/stock-report" is-link />
    <van-cell title="月度盘点工具" />
    <van-cell title="添加出栏记录" icon="add" is-link to="/livestock/inout-add" />
    <van-cell title="添加饲喂记录" icon="add" is-link to="/livestock/feeding-add" />
    <van-cell title="添加称重记录" icon="add" is-link to="/livestock/weight-add" />
    <van-cell title="添加繁殖记录" icon="add" is-link to="/livestock/reproduction-add" />
  </van-cell-group>
</template>
