<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import GoodsSelection from '@/views/component/GoodsSelection.vue'
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
  name: 'FarmlandAdminGoodsAdd'
})

const request = useAxios()
const tempEntity = {
  goodsName: undefined,
  goodsCategoryName: undefined,
  unitName: undefined
}
const temp = reactive<{
  goodsName: string | undefined
  goodsCategoryName: string | undefined
  unitName: string | undefined
}>({
  ...tempEntity
})

const tempWorkspaceName = ref('')
const showGoodsSelection = ref(false)
const onSubmit = async () => {
  if (!temp.goodsCategoryName) {
    showFailToast('未选择物料分类')
    return
  }
  showLoadingToast({
    duration: 0,
    message: '保存中...',
    forbidClick: true
  })
  // TODO 替换此API接口
  // temp.startDate = moment(temp.startDate)
  const res = await request.post({
    url: '/mapi/migration/goods',
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
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-field
      v-model="temp.goodsName"
      label="物料名称"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="请选择或者填写产品名称"
      clearable
    >
      <template #button>
        <van-button size="small" @click="showGoodsSelection = true" type="primary">
          选择
        </van-button>
      </template>
    </van-field>

    <van-field
      v-model="temp.unitName"
      label="使用单位"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="使用单位"
      clearable
    />
    <van-cell>
      <van-button type="success" block native-type="submit"> 提交记录 </van-button>
    </van-cell>
  </van-form>

  <van-popup
    v-model:show="showGoodsSelection"
    closeable
    position="left"
    :style="{ height: '100%', width: '80%' }"
  >
    <goods-selection v-model:category-name="temp.goodsCategoryName" />
  </van-popup>
</template>
