<script setup lang="ts">
import { onMounted, reactive, ref, toRef, watch } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { closeToast, showFailToast, showLoadingToast, showNotify, showSuccessToast } from 'vant'
import { formatTime, noEmptyTree } from '@/utils'
import { UploaderBeforeRead } from 'vant/lib/uploader/types'
import useClipboard from 'vue-clipboard3'
import moment from 'moment'

defineOptions({
  name: 'LivestockInoutAdd'
})
const request = useAxios()
const { toClipboard } = useClipboard()
const livestockProductList = ref<
  {
    pid: number
    name: string
  }[]
>([])
const getLivestockProductList = async () => {
  const res = await request.get({
    url: 'api/v2/product/category/children',
    params: { categoryNameSpell: 'livestock' }
  })
  if (res) {
    livestockProductList.value = res.data.list
  }
}
const getLivestockEventList = async () => {
  const res = await request.get({
    url: 'api/v2/livestock/event/tree',
    params: { parentNameSpell: 'chulan' }
  })
  if (res) {
    noEmptyTree(res.data.list)
    livestockEventList.value = res.data.list
    // console.log('livestockEventList => ', livestockEventList.value)
  }
}

const inoutTextToClipboard = () => {
  let text = moment().format('MM-DD ' + tempProduct.value.name + '数量变更')
  text += '\n当前批次/耳牌：' + temp.livestockSn + '\n'
  if (temp.eventAmount && temp.eventAmount.length > 0) {
    temp.eventAmount.forEach((item: eventAmountScheme) => {
      text += item.eventName + '：' + item.amount + '\n'
    })
  } else {
    text += '出现异常情况'
  }
  if (temp.photo) {
    text += '图像：'
    temp.photo.forEach((url: string) => {
      text += url + ' '
    })
  }
  if (typeof window.Android == 'object') {
    window.Android.toClipboard(text)
  } else {
    toClipboard(text)
  }
  showSuccessToast('变更信息已复制')
}

// 提交保存
const onSubmit = async () => {
  showLoadingToast({
    duration: 0,
    message: '保存中...',
    forbidClick: true
  })

  temp.eventAmount = eventAmountList.value
  const res = await request.post({
    url: 'api/v2/livestock/inout/batch-add',
    data: temp
  })
  closeToast()
  if (res) {
    // livestockList.value = res.data.list
    showSuccessToast('保存成功！')
    // Object.assign(temp, livestockInoutEntity)
    inoutTextToClipboard()
    temp.livestockSn = ''
    temp.remark = ''
    eventAmountList.value.splice(0, eventAmountList.value.length - 1)
    tempFiles.value = []
    // Object.assign(tempProduct.value, tempProductTpl)
  } else {
    showFailToast('保存失败！')
  }
}

const livestockInoutEntity: livestockInoutScheme = {
  productId: undefined,
  livestockSn: undefined,
  eventAmount: [],
  hitDate: formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  remark: undefined,
  flowableEnable: true,
  photo: []
}

const eventAmountTpl: eventAmountScheme = {
  id: 0,
  eventId: 0,
  amount: undefined,
  eventName: '事件/合计'
}
const eventAmountList = ref<eventAmountScheme[]>([])
eventAmountList.value.push({ ...eventAmountTpl })
const temp = reactive({ ...livestockInoutEntity })
const handleEventPopup = () => {
  // eventAmountTpl.id++
  // eventAmountList.value.unshift({ ...eventAmountTpl })
  showLivestockEventSelect.value = true
}
const tempProductTpl = {
  pid: undefined,
  name: undefined,
  nameSpell: undefined,
  nameAbbr: undefined
}
const tempProduct = ref<productScheme>({
  ...tempProductTpl
})
watch(tempProduct, (val) => {
  temp.productId = val.pid
  temp.livestockSn = ''
  if (
    val.nameSpell != undefined &&
    (val.nameSpell.toUpperCase() == 'JI' || val.nameSpell.toUpperCase() == 'E')
  ) {
    getLivestockList()
  } else {
  }
})
// 批次与耳牌号
const livestockList = ref<livestockScheme[]>([])
const showLivestockSnSelect = ref(false)
const onSnConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  showLivestockSnSelect.value = false
  temp.livestockSn = selectedValues[0]
}
const onSnCancel = () => {
  showLivestockSnSelect.value = false
}
const onSnChange = () => {
  // showLivestockSnSelect.value = false
}

const getLivestockList = async () => {
  if (!temp.productId) {
    showFailToast('未选择产品类别！')
    return
  }
  // console.log('请求养殖档案...', temp)
  const res = await request.get({
    url: 'api/v2/livestock/search',
    params: { lsn: temp.livestockSn, productId: temp.productId }
  })
  if (res) {
    livestockList.value = res.data.list
  }
  showLivestockSnSelect.value = true
}
const minDate = new Date(new Date().getTime() - 60 * 24 * 3600 * 1000)
const maxDate = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000)
// 出栏日期
const showHitDate = ref(false)
const onHitDateConfirm = (date: Date) => {
  showHitDate.value = false
  temp.hitDate = formatTime(date, 'yyyy-MM-dd 00:00:00')
}

//文件上传
const tempFiles = ref([])
const beforeFileDelete = (file: any, detail: any) => {
  // console.log(detail)
  delete temp.photo[detail.index]
  showSuccessToast('删除了上第 ' + (detail.index + 1) + '个文件')
  return true
}
const beforeFileRead: UploaderBeforeRead = (file: any, detail: any) => {
  // console.log(detail)
  if (typeof file.length == 'number') {
    showFailToast('只可以上传单个文件！')
    return false
  }
  showLoadingToast({ message: '上传中', duration: 0 })
  return true
}
const afterFileRead = async (file: any, detail: object) => {
  const postParam = new FormData()
  postParam.append('file', file.file)
  postParam.append('directory', 'livestock-inout-daily')
  const res = await request.post({
    url: 'api/v2/uploader',
    data: postParam,
    headersType: 'multipart/form-data'
  })
  closeToast()
  if (res) {
    file.status = 'done'
    file.message = '上传成功'
    temp.photo.push(res.data.url)
    showSuccessToast('成功上传了一个文件！')
    // console.log(temp.photo)
  }
  return true
}

// 出栏事件
const showLivestockEventSelect = ref(false)
const livestockEventList = ref([])
const livestockEventIds = ref(0)

const onEventFinish = ({ selectedOptions }: { selectedOptions: any }) => {
  const target = selectedOptions.pop()
  // console.log(selectedOptions)
  // showLivestockEventSelect.value = false
  eventAmountTpl.id++
  eventAmountTpl.eventId = target.leid
  if (
    tempProduct.value.nameSpell != undefined &&
    (tempProduct.value.nameSpell.toUpperCase() == 'JI' ||
      tempProduct.value.nameSpell.toUpperCase() == 'E')
  ) {
    eventAmountTpl.amount = 1
  }
  eventAmountTpl.eventName = target.name
  eventAmountList.value.unshift({ ...eventAmountTpl })
  // console.log(target, selectedOptions)
}
const updateTotalAmount = () => {
  let length = eventAmountList.value.length
  let total = 0
  eventAmountList.value.forEach((e: any, index) => {
    e.amount = parseInt(e.amount)
    if (index < length - 1) {
      total = total + e.amount
    } else {
      e.amount = total
      // console.log(index, total)
    }
  })
}
// watch(eventAmountList, (val) => {
//   console.log(val)
// })
// 初始化
getLivestockProductList()
getLivestockEventList()
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <van-field name="radio" label="产品类别">
        <template #input>
          <van-radio-group v-model="tempProduct">
            <van-radio
              style="margin: 0 0 10px"
              :name="product"
              :key="product.pid"
              v-for="product in livestockProductList"
            >
              {{ product.name }}
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="temp.livestockSn"
        center
        :rules="[{ required: true, message: '不能为空' }]"
        label="ID编号"
        placeholder="耳牌/批次号码"
        clearable
      >
        <template #button>
          <van-button size="small" @click="getLivestockList" type="primary">
            显示批次耳牌
          </van-button>
        </template>
      </van-field>
      <van-field
        v-model="item.amount"
        center
        :rules="[{ required: true, message: '不能为空' }]"
        type="number"
        label="请选择"
        placeholder="请输入数量"
        clearable
        @change="updateTotalAmount"
        :key="item.id"
        :readonly="item.id == 0"
        v-for="item in eventAmountList"
      >
        <template #label>
          <van-button v-if="item.id == 0" @click="handleEventPopup" size="small" type="warning">{{
            item.eventName
          }}</van-button>
          <van-tag v-else size="medium" type="success">{{ item.eventName }}</van-tag>
        </template>
      </van-field>
      <van-field
        v-model="temp.hitDate"
        label="出栏日期"
        :rules="[{ required: true, message: '不能为空' }]"
        readonly
        placeholder="请选择日期时间"
        clearable
        @click="showHitDate = true"
        is-link
      />
      <van-cell center title="提交审批">
        <template #right-icon>
          <van-switch v-model="temp.flowableEnable" />
        </template>
      </van-cell>
      <van-field
        v-model="temp.remark"
        rows="1"
        type="textarea"
        placeholder="请输入备注"
        label="备注信息"
      />
      <van-field name="uploader" label="上传文件">
        <template #input>
          <van-uploader
            multiple
            capture="capture"
            v-model="tempFiles"
            :before-delete="beforeFileDelete"
            :before-read="beforeFileRead"
            :after-read="afterFileRead"
          />
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button type="success" loading-text="申请中..." round block native-type="submit">
          提交记录
        </van-button>
      </div>
    </van-cell-group>
  </van-form>
  <van-popup v-model:show="showLivestockEventSelect" round position="bottom">
    <van-cascader
      v-model="livestockEventIds"
      title="请选择出栏事件"
      :options="livestockEventList"
      @close="showLivestockEventSelect = false"
      :field-names="{
        text: 'name',
        value: 'leid',
        children: 'children'
      }"
      @finish="onEventFinish"
    />
    <van-button type="primary" @click="showLivestockEventSelect = false" size="large">
      完成
    </van-button>
  </van-popup>
  <van-popup v-model:show="showLivestockSnSelect" round position="top">
    <van-picker
      title="请选择批次/耳牌"
      :columns="livestockList"
      :columns-field-names="{
        text: 'lsn',
        value: 'lsn'
      }"
      @confirm="onSnConfirm"
      @cancel="onSnCancel"
      @change="onSnChange"
    />
  </van-popup>
  <van-calendar
    v-model:show="showHitDate"
    :show-confirm="false"
    :min-date="minDate"
    :max-date="maxDate"
    @confirm="onHitDateConfirm"
  />
</template>
