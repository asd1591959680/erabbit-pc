<template>
  <div class="detail-logistics">
    <p>
      <span>{{ logistics.list[0].time }}</span>
      <span>{{ logistics.list[0].text }}</span>
    </p>
    <a href="javascript:;" @click="onLogisticsOrder(order)">查看物流</a>
    <Teleport to="#dailog">
      <order-logistics ref="logisticsOrderCom"></order-logistics>
    </Teleport>
  </div>
</template>
<script>
import { ref } from 'vue-demi'
import { logisticsOrder } from '@/api/order'
import orderLogistics from './order-logistics.vue'
import { useLogisticsOrder } from '../index.vue'
export default {
  components: { orderLogistics },
  name: 'DetailLogistics',
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },
  async setup(props) {
    const logistics = ref(null)

    const $sleep = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 2000)
      })
    await $sleep() //模拟同步延时效果
    const data = await logisticsOrder(props.order.id)
    logistics.value = data.result
    return { logistics, ...useLogisticsOrder() }
  },
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
