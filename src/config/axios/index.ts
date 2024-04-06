import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'
import { showToast } from 'vant';
import qs from 'qs'
import { config } from '@/config/axios/config'

import { useAppStoreWithOut } from '@/store/modules/app'
import router from '@/router'
import { objToFormData } from '@/utils'

let isRefreshing = false
let requests: ReadonlyArray<(config: any) => void> = []

// @ts-ignore
export const PATH_URL = import.meta.env.VITE_API_BASEPATH
// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout // 请求超时时间
})

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (config.method === 'post' && config.headers['Content-Type'] === 'multipart/form-data') {
    config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.status === 200) {
    return response.data
  } else {
    console.log('TODO: auth failed!')
    // if (response?.data?.code === 401) {
    //   const userStore = useUserStoreWithOut()
    //   userStore.logout()
    // }
  }
}

service.interceptors.request.use(defaultRequestInterceptors)
service.interceptors.response.use(defaultResponseInterceptors)

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const appStore = useAppStoreWithOut()
    if (appStore.getAccessToken && !isRefreshing) {
      ;(config.headers as AxiosRequestHeaders)['Authorization'] = 'Bearer '.concat(
        appStore.getAccessToken
      )
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      if (!('data' in error.response)) {
        return Promise.reject(error)
      }
      const response: any = error.response.data

      if (response.message.indexOf('expired') == -1) {
        const userAppStore = useAppStoreWithOut()
        userAppStore.resetApp()
        return Promise.reject(error)
      }

      try {
        if (!isRefreshing) {
          isRefreshing = true
          // 刷新token
          const accessToken = refreshToken()
          if (accessToken) {
            // service.defaults.headers.common.Authorization = `Bearer ${access_token}`
            requests.forEach((cb) => cb(accessToken))
            requests = []
            return service.request({
              ...error.config,
              headers: {
                ...(error.config?.headers || {}),
                Authorization: `Bearer ${accessToken}`
              }
            })
          }
          return Promise.reject(error)
        }
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests = [
            ...requests,
            (token) =>
              resolve(
                service.request({
                  ...error.config,
                  headers: {
                    ...(error.config?.headers || {}),
                    Authorization: `Bearer ${token}`
                  }
                })
              )
          ]
        })
      } catch (e) {
        isRefreshing = false
        return Promise.reject(error)
      } finally {
        if (!requests.length) {
          isRefreshing = false
        }
      }
    }

    showToast(error?.message);
    return Promise.reject(error)
  }
)

async function refreshToken() {
  const appStore = useAppStoreWithOut()
  const refreshToken = appStore.getRefreshToken
  let accessToken = ''
  if (!refreshToken) {
    return accessToken
  }

  const ret: any = await service.request({
    method: 'post',
    url: '/api/v1/auth/refresh-token',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`
    }
  })
  if (ret.status == 200) {
    const response = ret.data
    appStore.setAccessToken(response.data.accessToken)
    appStore.setRefreshToken(response.data.refreshToken)
    accessToken = response.data.accessToken
  }
  return accessToken
}

export { service }
