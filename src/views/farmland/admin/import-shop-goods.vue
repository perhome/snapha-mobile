<script setup lang="ts">
import { reactive, ref } from 'vue'
import { formatTime } from '@/utils'
import {
  closeToast,
  showDialog,
  showFailToast,
  showLoadingToast,
  showNotify,
  showSuccessToast,
  showToast
} from 'vant'
import { useRouter } from 'vue-router'
import { useAxios } from '@/hooks/useAxios'
import { UploaderBeforeRead } from 'vant/lib/uploader/types'
import { read, utils } from 'xlsx'
import ShopDaySteps from '@/views/component/ShopDaySteps.vue'
import ignore from 'ignore'
defineOptions({
  name: 'FarmlandAdminImportShopGoods'
})
const router = useRouter()
const request = useAxios()

const appendEntity: any = {
  hitDate: formatTime(new Date(), 'yyyy-MM-dd'),
  shopSn: 'INNER',
  productName: '',
  amount: undefined
}
const append = reactive({ ...appendEntity })
const tempEntity: {
  hitDate: string | undefined
  shopSn: string
  data: any[]
} = {
  hitDate: formatTime(new Date(new Date().getTime() + 24 * 3600 * 1000), 'yyyy-MM-dd'),
  shopSn: 'YUGU',
  data: []
}
const minDate = new Date(new Date().getTime() - 24 * 3600 * 1000)
const maxDate = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000)
const temp = reactive({ ...tempEntity })
const showCalendar = ref(false)
const onCalendarConfirm = (date: Date) => {
  temp.hitDate = formatTime(date, 'yyyy-MM-dd')
  showCalendar.value = false
}
const onSubmit = async () => {
  if (!temp.hitDate || !temp.data) {
    showNotify({ type: 'danger', message: '数据不完整' })
    return
  }
  const toast = showLoadingToast({
    duration: 0,
    message: '保存中...',
    forbidClick: true
  })
  const res = await request.post({
    url: 'api/v1/shop-goods/import',
    data: temp
  })
  closeToast()
  if (res) {
    showSuccessToast('保存成功！')
    Object.assign(temp, tempEntity)
    tempFiles.value = []
  } else {
    showFailToast('保存失败！')
  }
}
// const onAppendSubmit = async () => {
//   if (!append.hitDate || !append.productName) {
//     showNotify({ type: 'danger', message: '数据不完整' })
//     return
//   }
//   const res = await request.post({
//     url: 'api/v1/shop-goods/append',
//     data: append
//   })
//   if (res) {
//     showSuccessToast('保存成功！')
//     Object.assign(append, appendEntity)
//   }
// }

//文件上传
const tableFields: any = {
  YUGU: {
    产品名称: 'productName',
    '求和项:预估量/kg': 'amount'
  }
}
const isExcel = (file: any) => {
  return /\.(xlsx|xls|csv)$/.test(file.name)
}
const readerData = (rawFile: any) => {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      const workbook = read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet: any = workbook.Sheets[firstSheetName]
      const range = utils.decode_range(worksheet['!ref'])
      range.s.r = 1
      const header = getHeaderRow(worksheet, range)
      const results = utils.sheet_to_json(worksheet, { range: range })
      setTempData(results)
      resolve()
    }
    reader.readAsArrayBuffer(rawFile)
  })
}
const setTempData = (results: any) => {
  temp.data = []
  let totalAmount = 0
  results.forEach((item: any) => {
    const row: { [productName: string]: any; [amount: number]: any } = {
      productName: '',
      amount: 0
    }
    if (item['序号'] == '合计') return false
    const tf: any = tableFields[temp.shopSn]
    Object.keys(tf).forEach((val) => {
      const tfk: string = tf[val]
      switch (tf[val]) {
        case 'productName':
          item[val] = item[val]
          break
        case 'amount':
          item[val] = parseFloat(item[val]).toFixed(2)
          totalAmount += Number(item[val])
          break
      }
      row[tfk] = item[val]
    })
    temp.data.push(row)
  })
  showDialog({
    title: '文件识别结果',
    message: '发现品种数： ' + temp.data.length + ' 个，合计产品重量：' + totalAmount + ' 千克'
  })
}
const getHeaderRow = (sheet: any, range: any) => {
  const headers: string[] = []
  let C
  const R = range.s.r
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[utils.encode_cell({ c: C, r: R })]
    /* find the cell in the first row */
    let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}
const tempFiles = ref([])
const beforeFileDelete = (file: any, detail: any) => {
  // console.log(detail)
  // showSuccessToast('删除了上第 ' + (detail.index + 1) + '个文件')
  return true
}
const beforeFileRead: UploaderBeforeRead = (file: any, detail: any) => {
  // console.log(detail)
  return true
}
const afterFileRead = async (file: any, detail: object) => {
  await readerData(file.file)
  const postParam = new FormData()
  postParam.append('file', file.file)
  postParam.append('directory', 'farmland-product-shop')
  const res = await request.post({
    url: 'api/v2/uploader',
    data: postParam,
    headersType: 'multipart/form-data'
  })
  if (res) {
    file.status = 'done'
    file.message = '上传成功'
  }
  return true
}
</script>
<template>
  <van-notice-bar wrapable :scrollable="false" text="选择电子表格文件，具体格式见 模板文件" />
  <shop-day-steps :shop-step-active="0" />
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <van-field
        v-model="temp.hitDate"
        label="预估日期"
        :rules="[{ required: true, message: '不能为空' }]"
        placeholder="请选择日期时间"
        clearable
        @click="showCalendar = true"
        is-link
      />
      <van-field name="shopSn" label="上架类型">
        <template #input>
          <van-radio-group v-model="temp.shopSn" direction="horizontal">
            <van-radio name="YUGU">预估</van-radio>
            <van-radio name="TEJIA">特价</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <van-field name="uploader" label="选择文件">
        <template #input>
          <van-uploader
            v-model="tempFiles"
            :before-delete="beforeFileDelete"
            :before-read="beforeFileRead"
            :after-read="afterFileRead"
            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px">
      <van-button type="primary" loading-text="申请中..." round block native-type="submit">
        提交保存
      </van-button>
    </div>
  </van-form>

  <van-calendar
    v-model:show="showCalendar"
    :min-date="minDate"
    :max-date="maxDate"
    @confirm="onCalendarConfirm"
  />
</template>
