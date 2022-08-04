<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">
          {{ goods.categories[1].name }}
        </XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">
          {{ goods.categories[0].name }}
        </XtxBreadItem>
        <XtxBreadItem to="/">{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <goods-image :images="goods.mainPictures"></goods-image>
          <goods-sales></goods-sales>
        </div>
        <div class="spec">
          <goods-name :goods="goods"></goods-name>
          <!-- 规格组件 -->
          <goods-sku :goods="goods" @change="changeSku"></goods-sku>
          <xtx-numbox label="数量" v-model="num" :max="goods.inventory"></xtx-numbox>
          <xtx-button @click="insertCart" type="primary" style="margin-top: 20px">
            加入购物车
          </xtx-button>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <goods-tabs></goods-tabs>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <goods-warn></goods-warn>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <goods-hot :goodsId="goods.id" :type="1"></goods-hot>
          <goods-hot :goodsId="goods.id" :type="2"></goods-hot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { provide, ref, watch } from 'vue-demi'
import GoodsRelevant from './components/goods-relevant'
import { useRoute } from 'vue-router'
import { goodsItem } from '@/api/product'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/message'

// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()

  watch(
    () => route.params.id,
    newVal => {
      if (newVal && `/product/${newVal}` === route.path) {
        goodsItem(route.params.id).then(data => {
          goods.value = data.result
        })
      }
    },
    { immediate: true }
  )

  return goods
}

export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn,
  },
  setup() {
    const goods = useGoods()
    const currSku = ref(null)
    const changeSku = sku => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.ldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
        currSku.value = sku
      } else {
        currSku.value = null
      }
    }
    const num = ref(1)
    provide('goods', goods)
    const store = useStore()
    const insertCart = () => {
      if (!currSku.value) {
        return Message({ type: 'warn', text: '请选择商品规格' })
      }
      if (num.value > goods.inventory) {
        return Message({ type: 'warn', text: '库存不足' })
      }
      store
        .dispatch('cart/insertCart', {
          id: goods.value.id,
          skuId: currSku.value.skuId,
          name: goods.value.name,
          picture: goods.value.mainPictures[0],
          price: currSku.value.price,
          nowPrice: currSku.value.price,
          count: num.value,
          attrsText: currSku.value.specsText,
          selected: true,
          isEffective: true,
          stock: currSku.value.inventory,
        })
        .then(() => {
          Message({ type: 'success', text: '加入购物车成功' })
        })
    }

    return { goods, changeSku, num, insertCart }
  },
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
