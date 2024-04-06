<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'

import WorkspaceSelection from '@/views/component/WorkspaceSelection.vue'
import ProductSelection from '@/views/component/ProductSelection.vue'
import {
  closeToast,
  showConfirmDialog,
  showFailToast,
  showLoadingToast,
  showSuccessToast
} from 'vant'
import { reactive, ref, watch } from 'vue'
import moment from 'moment'
defineOptions({
  name: 'FarmlandAdminCfrAdd'
})

const request = useAxios()
const tempEntity = {
  workspaceId: undefined,
  workspaceName: undefined,
  productName: undefined,
  productCategoryName: undefined,
  category: 1,
  productId: null,
  unitAmount: undefined,
  workspaceArea: undefined,
  startDate: undefined,
  harvestDate: undefined,
  endDate: undefined
}
const temp = reactive<{
  workspaceId: number | undefined
  workspaceName: string | undefined
  productName: string | undefined
  productCategoryName: string | undefined
  productId?: number | null
  category: number | undefined
  unitAmount: number | undefined
  workspaceArea: number | undefined
  startDate: string | undefined
  endDate: string | undefined
  harvestDate: string | undefined
}>({
  ...tempEntity
})

const tempWorkspaceParentName = ref('')
const tempWorkspaceName = ref('')
const showWorkspaceSelection = ref(false)
const showProductSelection = ref(false)
const onSubmit = async () => {
  if (!temp.productCategoryName) {
    showFailToast('未选择产品分类')
    return
  }
  showLoadingToast({
    duration: 0,
    message: '保存中...',
    forbidClick: true
  })
  // temp.startDate = moment(temp.startDate)
  const res = await request.post({
    url: 'api/v1/cfr/fast-add',
    data: { ...temp }
  })
  closeToast()
  if (res.data.result == 1) {
    // livestockList.value = res.data.list
    showSuccessToast('保存成功！')
    Object.assign(temp, tempEntity)
    tempWorkspaceName.value = ''
  } else {
    showFailToast('保存失败！')
  }
}
watch(tempWorkspaceName, () => {
  temp.workspaceName = tempWorkspaceName.value + '@' + tempWorkspaceParentName.value
})
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-field
      v-model="temp.productName"
      label="产品名称"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="请选择或者填写产品名称"
      clearable
      is-link
    >
      <template #button>
        <van-button size="small" @click="showProductSelection = true" type="primary">
          选择
        </van-button>
      </template>
    </van-field>
    <van-field
      v-model="tempWorkspaceParentName"
      label="大棚/田号"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="请填写棚号/大田 如 3-1,大田F区"
      @click="showWorkspaceSelection = true"
      readonly
      clearable
      is-link
    />
    <van-field
      v-model="tempWorkspaceName"
      label="区块编号"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="请填写区块编号"
      clearable
    />
    <van-field label="茬口模式" clearable>
      <template #input>
        <van-radio-group v-model="temp.category" direction="horizontal">
          <van-space wrap>
            <van-radio :name="1">正式</van-radio>
            <van-radio :name="4">实验</van-radio>
            <van-radio :name="8">临时</van-radio>
            <van-radio :name="16">育苗</van-radio>
          </van-space>
        </van-radio-group>
      </template>
    </van-field>

    <van-field
      v-model="temp.workspaceArea"
      label="地块面积"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="地块面积"
      type="number"
    />
    <van-field
      v-model="temp.unitAmount"
      label="亩产量"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="亩产量"
      type="number"
    />
    <van-field
      v-model="temp.startDate"
      label="开始日期"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="填写日期"
      type="date"
    />
    <van-field
      v-model="temp.harvestDate"
      label="收获日期"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="填写日期"
      type="date"
    />
    <van-field
      v-model="temp.endDate"
      label="结束日期"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="填写日期"
      type="date"
    />
    <van-cell>
      <van-button type="success" block native-type="submit"> 提交记录 </van-button>
    </van-cell>
  </van-form>

  <van-popup
    v-model:show="showWorkspaceSelection"
    closeable
    position="left"
    :style="{ height: '100%', width: '80%' }"
  >
    <workspace-selection v-model="temp.workspaceId" v-model:name="tempWorkspaceParentName" />
  </van-popup>

  <van-popup
    v-model:show="showProductSelection"
    closeable
    position="left"
    :style="{ height: '100%', width: '80%' }"
  >
    <product-selection
      v-model="temp.productId"
      v-model:category-name="temp.productCategoryName"
      v-model:name="temp.productName"
    />
  </van-popup>
</template>
