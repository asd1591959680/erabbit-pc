<template>
  <div class="member-order-page">
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      ></XtxTabsPanel>
    </XtxTabs>
    <div class="order-list">
      <order-item
        v-for="i in orderList"
        :key="i.id"
        :order="i"
        @on-cancel-order="onCancelOrder(i)"
        @on-delete-order="onDeleteOrder(i)"
        @on-confirm-order="onConfirmOrder(i)"
        @on-logistics-order="onLogisticsOrder(i)"
      ></order-item>
    </div>
    <div v-if="loading" class="loading"></div>
    <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
    <!-- $event是事件发送的参数 -->
    <xtx-pagination
      v-if="total > 0"
      @current-change="requestParams.page = $event"
      :total="total"
      :page-size="requestParams.pageSize"
      :current-page="requestParams.page"
    ></xtx-pagination>

    <order-cancel ref="OrderCancelCom"></order-cancel>

    <order-logistics ref="logisticsOrderCom" />
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { confirmOrder, delteOrder, findOrderList } from '@/api/order'
import orderItem from './components/order-item.vue'
import OrderCancel from './components/order-cancel.vue'
import message from '@/components/library/message'
import comfirm from '@/components/library/comfirm'
import OrderLogistics from './components/order-logistics.vue'
export default {
  components: { orderItem, OrderCancel, OrderLogistics },
  name: 'MemberOrderPage',
  setup() {
    const activeName = ref('all')
    const loading = ref(true)
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0,
    })
    const orderList = ref([])
    const total = ref(0)
    const _findOrderList = () => {
      loading.value = true
      findOrderList(requestParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }

    const tabClick = tab => {
      requestParams.orderState = tab.index
      requestParams.page = 1
    }

    const onDeleteOrder = i => {
      comfirm({ text: '确认删除订单吗?' }).then(() => {
        delteOrder(i.id)
          .then(() => {
            message({ text: '删除订单成功', type: 'success' })
            _findOrderList()
          })
          .catch(e => {})
      })
    }

    watch(
      requestParams,
      () => {
        _findOrderList()
      },
      { immediate: true }
    )
    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      requestParams,
      ...useCancelOrder(),
      onDeleteOrder,
      ...useConfirmOrder(),
      ...useLogisticsOrder(),
    }
  },
}
export const useConfirmOrder = () => {
  const onConfirmOrder = i => {
    comfirm({ text: '确认收货吗？' }).then(() => {
      confirmOrder(i.id).then(() => {
        message({ text: '确认成功', type: 'success' })

        i.orderState = 4
      })
    })
  }
  return { onConfirmOrder }
}
export const useLogisticsOrder = () => {
  const logisticsOrderCom = ref(null)
  const onLogisticsOrder = item => {
    logisticsOrderCom.value.open(item)
  }
  return { logisticsOrderCom, onLogisticsOrder }
}
export const useCancelOrder = () => {
  const OrderCancelCom = ref(null)
  const onCancelOrder = i => {
    OrderCancelCom.value.open(i)
  }
  return { OrderCancelCom, onCancelOrder }
}
</script>
<style scoped lang="less">
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
