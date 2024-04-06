<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'

defineOptions({
  name: 'FarmlandAdmin'
})

const request = useAxios()
</script>
<template>
  <van-cell-group>
    <van-cell title="今日活动" is-link to="/farmland/admin/activity" />
    <van-cell title="茬口轮作计划" is-link to="/farmland/admin/cfr-workspace" />
    <van-cell title="物料使用记录" is-link to="/farmland/goods/user-index" />
    <van-cell title="预估菜登记记录" is-link to="/farmland/cfr/output-nextday" />
    <van-cell title="预估菜报表工具" is-link to="/farmland/admin/output-nextday" />
    <van-cell title="快速添加物料" is-link to="/farmland/admin/goods-add" />
    <van-cell title="快速添加茬口" is-link to="/farmland/admin/cfr-add" />
    <van-cell title="下菜单据审核" is-link to="/pack/output" />
    <van-cell title="下菜单汇总确认" is-link to="/farmland/admin/output-checkin" />
    <van-cell title="导入下周菜" is-link to="/farmland/admin/product-subscribe" />
    <van-cell title="导入预估菜(已自动)" is-link to="/farmland/admin/import-shop-goods" />
  </van-cell-group>
</template>
