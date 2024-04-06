<script setup lang="ts">
defineOptions({
  name: 'MyIssues'
})
</script>
<template>
  <van-empty description="此数据暂未开放" />
  <van-skeleton title :row="3" />
</template>
