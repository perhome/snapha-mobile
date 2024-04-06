<script setup lang="ts">
import { onBeforeUpdate, ref } from 'vue'
import WorkspaceSelection from '@/views/component/WorkspaceSelection.vue'

defineOptions({
  name: 'FarmlandCfrAdd'
})
</script>
<template>
  <van-empty description="此数据暂未开放" />
  <van-skeleton title :row="3" />
</template>
<style scoped>
.workspace-row {
  display: flex;
  flex-wrap: wrap;
}
.workspace-col {
  color: #ffffff;
  font-size: 16px;
  display: block;
  background-color: #ff976a;
  border-bottom: 1px slateblue solid;
  box-sizing: border-box;
  min-height: 1px;
  padding: 10px 10px;
  flex: 0 0 33.33333333%;
  max-width: 33.33333333%;
}
div.workspace-col:nth-child(odd) {
  border-right: 1px solid #576b95;
}
</style>
