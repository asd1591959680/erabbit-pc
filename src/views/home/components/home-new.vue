<!--  -->
<template>
  <div class="home-new">
    <home-panel title="新鲜毫无" subTitle="新鲜出炉 品质靠谱">
      <template #right>
        <xtx-more path="/" />
      </template>
      <div style="position: relative; height: 426px" ref="target">
        <transition name="fade">
          <!-- 面板内容 -->
          <ul class="goods-list" v-if="goods.length" ref="pannel">
            <li v-for="item in goods" :key="item.id">
              <router-link :to="`/product/${item.id}`">
                <img :src="item.picture" alt="" />
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </router-link>
            </li>
          </ul>
          <home-skeleton bg="#f0f9f4" v-else></home-skeleton>
        </transition>
      </div>
    </home-panel>
  </div>
</template>

<script>
import { ref } from "vue-demi";
import { findNew } from "@/api/home";
import homePanel from "./home-panel.vue";
import HomeSkeleton from "./home-skeleton.vue";
import { useLazyData } from "@/hooks/index";

export default {
  name: "HomeNew",
  components: { homePanel, HomeSkeleton },
  setup() {
    //懒加载钩子函数
    const { target, result } = useLazyData(findNew);
    //赋值goods
    return { goods: result, target };
  },
};
</script>
<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
