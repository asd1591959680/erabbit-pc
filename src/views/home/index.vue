<template>
  <div class="xtx-home-page">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <home-category></home-category>
        <!-- 轮播图 -->
        <home-banner></home-banner>
        <!-- 新鲜好物 -->
        <home-new></home-new>
        <!-- 人气热门 -->
        <home-hot></home-hot>
        <!-- 热门品牌 -->
        <home-brand></home-brand>
        <!-- 商品区域 -->
        <home-product></home-product>
        <!-- 最新专题 -->
        <home-special></home-special>
      </div>
    </div>
  </div>
</template>

<script>
import HomeCategory from "./components/home-category.vue";
import HomeBanner from "./components/home-banner.vue";
import HomeNew from "./components/home-new.vue";
import HomeHot from "./components/home-hot.vue";
import HomeBrand from "./components/home-brand.vue";
import HomeProduct from "./components/home-product.vue";
import HomeSpecial from "./components/home-special.vue";

export default {
  name: "HomePage",
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial,
  },
};
</script>

<style scoped lang="less">
@import "@/assets/styles/variables.less";
.xtx-home-page {
  color: @xtxColor;
}
</style>
