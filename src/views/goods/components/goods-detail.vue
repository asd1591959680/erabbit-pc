<!-- 商品详情 -->
<template>
  <div class="goods-detail">
    <ul class="attrs">
      <li v-for="item in goods.details.properties" :key="item.value">
        <span class="dt">{{ item.name }}</span>
        <span class="dd">{{ item.value }}</span>
      </li>
    </ul>
    <img
      v-for="itey in goods.details.pictures"
      :key="itey"
      :src="itey"
      alt=""
    />
  </div>
</template>

<script>
import { inject } from "vue-demi";
export default {
  name: "GoodsDetail",
  setup() {
    const goods = inject("goods");
    return { goods };
  },
};
</script>
<style lang="less" scoped>
.goods-detail {
  padding: 40px;
  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;
      .dt {
        width: 100px;
        color: #999;
      }
      .dd {
        flex: 1;
        color: #666;
      }
    }
  }
  > img {
    width: 100%;
  }
}
</style>
