<!--  -->
<template>
  <home-panel title="人气推荐" subTitle="人气爆款 不容错过">
    <div ref="target" style="position: relative; height: 426px">
      <transition name="fade">
        <ul ref="pannel" class="goods-list" v-if="goods.length">
          <li v-for="item in goods" :key="item.id">
            <router-link to="/">
              <img :src="item.picture" alt="" />
              <p class="name">{{ item.title }}</p>
              <p class="desc">{{ item.alt }}</p>
            </router-link>
          </li>
        </ul>
        <home-skeleton v-else></home-skeleton>
      </transition>
    </div>
  </home-panel>
</template>

<script>
import { ref } from "vue-demi";
import homePanel from "./home-panel.vue";
import { findHot } from "@/api/home";
import HomeSkeleton from "./home-skeleton.vue";
import { useLazyData } from "@/hooks/index";
export default {
  name: "HomeHot",
  components: { homePanel, HomeSkeleton },
  setup() {
    //懒加载钩子函数
    const { target, result } = useLazyData(findHot);
    //赋值goods
    return { goods: result, target };
  },
};
</script>
<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
