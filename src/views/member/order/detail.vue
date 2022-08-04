<!--  -->
<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 组件xtx-steps.vue-->
    <detail-steps :order="order"></detail-steps>
    <!-- 物流栏 -->
    <suspense>
      <template #default>
        <detail-logistics :order="order" v-if="[3, 4, 5].includes(order.orderState)" />
      </template>
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </suspense>

    <!-- 订单商品信息 -->
    <order-info :order="order"></order-info>
  </div>
</template>
<script>
import { ref } from 'vue-demi'
import DetailAction from './components/detail-action'
import { useRoute } from 'vue-router'
import { findOrder } from '@/api/order'
import DetailSteps from './components/detail-steps.vue'
import DetailLogistics from './components/detail-logistics.vue'
import OrderInfo from './components/order-info.vue'
export default {
  name: 'OrderDetailPage',
  components: { DetailAction, DetailSteps, DetailLogistics, OrderInfo },
  setup() {
    const order = ref(null)
    const route = useRoute()
    findOrder(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  },
}
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
}
</style>
