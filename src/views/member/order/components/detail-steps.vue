<template>
  <div class="detail-steps" style="padding: 20px">
    <xtx-steps :active="order.orderState === 6 ? 1 : order.orderState">
      <XtxStepsItem title="提交订单" desc="2021-03-18 02:11:47" />
      <XtxStepsItem title="付款成功" desc="2021-03-18 02:11:47" />
      <XtxStepsItem title="商品发货" desc="2021-03-18 02:11:47" />
      <XtxStepsItem title="确认收货" />
      <XtxStepsItem title="订单完成" />
    </xtx-steps>
  </div>
</template>
<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },
  name: 'DetailSteps',
}
</script>
<style scoped lang="less"></style>
