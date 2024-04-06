<script setup lang="ts">
defineOptions({
  name: 'NoFind'
})
</script>
<template>
  <van-empty image="error" description="抱歉，当前此页面找不到！" />
  <van-cell>
    <van-button type="primary" block @click="$router.go(-1)">点击返回上一页面</van-button>
    <van-button type="success" style="margin-top: 10px" block @click="$router.push('/')">
      点击返回默认主页
    </van-button>
  </van-cell>
</template>
