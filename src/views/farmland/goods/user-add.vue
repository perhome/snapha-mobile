<script setup lang="ts">
import WorkspaceBlockSelection from '../../component/WorkspaceBlockSelection.vue'
import { useAxios } from '@/hooks/useAxios'
import { formatTime } from '@/utils'
import { computed, reactive, ref, watch } from 'vue'
import WorkspaceSelection from '@/views/component/WorkspaceSelection.vue'
import GoodsSelection from '@/views/component/GoodsSelection.vue'
import {
  closeToast,
  showConfirmDialog,
  showFailToast,
  showLoadingToast,
  showSuccessToast
} from 'vant'

defineOptions({
  name: 'FarmlandGoodsUserAdd'
})

const request = useAxios()
const cfrGoodsEntity: any = {
  id: 0,
  goodsId: undefined,
  goodsName: '选择物料',
  amount: undefined
}
const tempWorkspace = ref()

const temp = reactive<{
  workspaceName: string | undefined
  workspaceId: number | undefined
  workspaceScheme: number
  workspaceBlockIds: number[] | undefined
  workspaceBlockNames: string | undefined
}>({
  workspaceName: undefined,
  workspaceId: undefined,
  workspaceScheme: 1,
  workspaceBlockIds: undefined,
  workspaceBlockNames: undefined
})

const showWorkspaceBlockSelection = ref(false)
const showWorkspaceSelection = ref(false)
const minDate = new Date(new Date().getTime() - 360 * 24 * 3600 * 1000)
const maxDate = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000)
// 出栏日期
const showHitDate = ref(false)
const showGoods = ref(false)
const onHitDateConfirm = (date: Date) => {
  showHitDate.value = false
  activeGoods.value.hitDate = formatTime(date, 'yyyy-MM-dd')
  // temp.hitDate = formatTime(date, 'yyyy-MM-dd 00:00:00')
}
const tempGoodsSelection = ref<any>([])
const onSubmit = async () => {
  console.log('submit => ', temp, tempGoodsSelection)
  showLoadingToast({
    duration: 0,
    message: '保存中...',
    forbidClick: true
  })

  const res = await request.post({
    url: 'api/v2/workspace/goods',
    data: { ...temp, goodsItems: tempGoodsSelection.value }
  })
  closeToast()
  if (res) {
    // livestockList.value = res.data.list
    showSuccessToast('保存成功！')
    showConfirmDialog({
      title: '提醒',
      message: '保存完成，是否清空物料与地块信息？'
    })
      .then(() => {
        tempGoodsSelection.value = []
        temp.workspaceBlockNames = ''
        temp.workspaceBlockIds = []
      })
      .catch(() => {
        tempGoodsSelection.value.forEach((goods: any) => {
          goods.hitDate = ''
          goods.used = ''
        })
      })
    // Object.assign(temp, livestockInoutEntity)

    // Object.assign(tempProduct.value, tempProductTpl)
  } else {
    showFailToast('保存失败！')
  }
}

watch(
  () => temp.workspaceName,
  (val) => {
    showWorkspaceSelection.value = false
    showWorkspaceBlockSelection.value = true
  }
)

const handleWorkspaceBlockSelection = () => {
  if (temp.workspaceName) {
    showWorkspaceBlockSelection.value = true
  } else {
    showFailToast('未选择大棚/大田范围')
  }
}

const handleWorkspaceType = computed(() => {
  return temp.workspaceName && temp.workspaceName.startsWith('大田') ? 'dt' : 'dp'
})
const activeGoods = ref()
const tempWorkspaceSchemeName = ref('正常')
watch(
  () => temp.workspaceScheme,
  (val) => {
    tempWorkspaceSchemeName.value = val == 1 ? '正常' : '套种'
  }
)
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-field
      v-model="temp.workspaceName"
      label="大棚/田号"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="请填写棚号/大田 如 3-1,大田F区"
      @click="showWorkspaceSelection = true"
      readonly
      clearable
      is-link
    />
    <van-field
      v-model="temp.workspaceBlockNames"
      label="区块编号"
      :rules="[{ required: true, message: '不能为空' }]"
      placeholder="请填写区块编号"
      clearable
      readonly
      @click="handleWorkspaceBlockSelection"
      is-link
    />
    <van-field
      v-model="tempWorkspaceSchemeName"
      label="地块模式"
      placeholder="请填写区块编号"
      readonly
    />
    <van-divider>
      <van-button type="primary" block @click="showGoods = true">选择物料</van-button>
    </van-divider>
    <van-cell-group v-for="goods in tempGoodsSelection" :key="goods.id">
      <van-field
        v-model="goods.hitDate"
        label="使用日期"
        :rules="[{ required: true, message: '不能为空' }]"
        readonly
        @click=";(activeGoods = goods), (showHitDate = true)"
        placeholder="请选择日期时间"
        clearable
        is-link
      />
      <van-field
        v-model="goods.used"
        :label="goods.text"
        placeholder="请填写使用数量"
        clearable
        type="number"
        is-link
      >
        <template #extra>{{ goods.unitName }} </template>
      </van-field>
    </van-cell-group>
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
    <workspace-selection
      v-model="temp.workspaceId"
      v-model:name="temp.workspaceName"
      v-model:workspace="tempWorkspace"
    />
  </van-popup>
  <van-popup
    v-model:show="showWorkspaceBlockSelection"
    closeable
    position="left"
    :style="{ height: '100%', width: '80%' }"
  >
    <workspace-block-selection
      v-model="temp.workspaceBlockIds"
      v-if="showWorkspaceBlockSelection"
      v-model:name="temp.workspaceBlockNames"
      v-model:scheme="temp.workspaceScheme"
      v-model:show="showWorkspaceBlockSelection"
      :workspace-type="handleWorkspaceType"
    />
  </van-popup>

  <van-popup
    v-model:show="showGoods"
    closeable
    position="left"
    :style="{ height: '100%', width: '80%' }"
  >
    <goods-selection v-if="showGoods" v-model="tempGoodsSelection" />
  </van-popup>
  <van-calendar
    v-model:show="showHitDate"
    :show-confirm="false"
    :min-date="minDate"
    :max-date="maxDate"
    @confirm="onHitDateConfirm"
  />
</template>
