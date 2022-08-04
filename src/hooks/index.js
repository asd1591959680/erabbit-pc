import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
export const useLazyData = apiFn => {
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], dom) => {
      if (isIntersecting) {
        stop()
        apiFn &&
          apiFn().then(data => {
            result.value = data.result
          })
      }
    },
    {
      //threshold 容器和可视区交叉的占比 取值，0-1 之间，
      //默认比0大，所以需要滚动较多才能触发进入可视区域事件。
      threshold: 0,
    }
  )
  return { target, result }
}

export const usePayTime = () => {
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) {
        pause()
      }
    },
    1000,
    false
  )
  onUnmounted(() => {
    pause()
  })

  const start = countdown => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return { start, timeText }
}
