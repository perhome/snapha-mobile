import { useCache } from '@/hooks/useCache'
const { wsCache } = useCache()

export interface AppState {
  title: string
  pageLoading: boolean
  passport: string
  roles: string[]
  accessToken: string
  refreshToken: string
  websocketConnected: boolean
  isDark: boolean
}
