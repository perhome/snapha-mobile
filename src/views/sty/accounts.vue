<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAxios } from '@/hooks/useAxios'
import { ref } from 'vue'

defineOptions({
  name: 'StyAccounts'
})

const router = useRouter()
const request = useAxios()
const accountsList = ref<any[]>([])
const getAccountsList = async () => {
  const res = await request.get({
    url: 'api/v2/accounts'
  })
  if (res) {
    accountsList.value = res.data.list
  }
}
const loading = ref(false)
const refreshing = ref(false)
const activeAccounts = ref<any[]>([])
const onRefresh = async () => {
  loading.value = true
  await getAccountsList()
  loading.value = false
}
const genTitle = (item: any) => {
  const realAmount = item.income - item.expense
  return '[账本]' + item.name + ' 实时' + realAmount + '元'
}
getAccountsList()
</script>
<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <div v-if="accountsList.length == 0">
      <van-empty description="账本列表为空" />
    </div>
    <van-collapse border v-model="activeAccounts" v-else>
      <van-collapse-item
        :title="genTitle(item)"
        :key="item.aid"
        :name="item.name"
        border
        :label="'最后更新：' + item.updated"
        v-for="item in accountsList"
      >
        <van-button size="small" disabled type="primary">填写收支</van-button>
        <van-button
          size="small"
          type="success"
          :to="{ path: 'accounts-detail', query: { aid: item.aid } }"
          style="margin-left: 10px"
        >
          查看明细
        </van-button>
      </van-collapse-item>
    </van-collapse>
    <van-button type="warning" round disabled style="margin: 20px 0" size="large">
      下载所选账本明细
    </van-button>
  </van-pull-refresh>
</template>
