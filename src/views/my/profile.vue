<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { ref } from 'vue'

defineOptions({
  name: 'MyProfile'
})
const request = useAxios()

const user = ref<any>({
  name: '',
  userCode: '',
  seniority: 0
})

const getUserProfile = async () => {
  const res = await request.get({
    url: 'api/v1/my/user'
  })
  user.value = res.data.user
}
getUserProfile()
</script>
<template>
  <van-cell-group inset>
    <van-cell title="姓名" :value="user.name" />
    <van-cell title="工号" :value="user.userCode" />
    <van-cell title="组别" :value="user.groupName" label="默认组别待显示" />
    <van-cell title="工龄" :value="user.seniority" />
  </van-cell-group>
</template>
