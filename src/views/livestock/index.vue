<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'

defineOptions({
  name: 'LivestockIndex'
})
const request = useAxios()
</script>
<template>
  <van-notice-bar wrapable :scrollable="false" text="温馨提示：功能试运行中..." />
  <van-grid direction="horizontal" clickable :column-num="2">
    <van-grid-item icon="records" text="出栏记录" to="/livestock/inout-index" badge="新" />
    <van-grid-item icon="edit" text="添加出栏记录" to="/livestock/inout-add" badge="新" />
    <van-grid-item icon="records" text="产品记录" to="/livestock/output-index" />
    <van-grid-item icon="edit" text="添加产品记录" to="/livestock/output-add" />
    <van-grid-item icon="records" text="称重记录" to="/livestock/weight-index" />
    <van-grid-item icon="edit" text="添加称重记录" to="/livestock/weight-add" />
    <van-grid-item icon="records" text="饲喂记录" to="/livestock/feeding-index" />
    <van-grid-item icon="edit" text="添加饲喂记录" to="/livestock/feeding-add" />
    <van-grid-item icon="records" text="繁殖记录" to="/livestock/reproduction-index" />
    <van-grid-item icon="edit" text="添加繁殖记录" to="/livestock/reproduction-add" />
  </van-grid>
</template>
