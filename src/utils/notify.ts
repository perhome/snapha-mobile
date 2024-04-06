import { showToast } from 'vant'

export const notify = (channel: string, message: string) => {
  if (typeof window.Android == 'object') {
    window.Android.notify(channel, message, '')
  } else {
    showToast(message)
  }
}
