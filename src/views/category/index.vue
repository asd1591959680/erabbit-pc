<!--  -->
<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <xtx-bread>
        <xtx-bread-item to="/">首页</xtx-bread-item>
        <transition name="fade-right" mode="out-in">
          <!-- 不同的key可以创建移除元素，创造触发动画条件 -->
          <xtx-bread-item :key="topCategory.id">
            {{ topCategory.name }}
          </xtx-bread-item>
        </transition>
      </xtx-bread>
      <!-- 轮播图 -->
      <xtx-carousel :sliders="sliders" style="height: 500px"></xtx-carousel>
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" alt="" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <div class="ref-goods" v-for="item in subList" :key="item.id">
        <div class="head">
          <h3>-{{ item.name }}-</h3>
          <p class="tag">{{ item.desc }}</p>
          <xtx-more />
        </div>
        <div class="body">
          <goods-item v-for="g in item.goods" :key="g.id" :goods="g" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue-demi";
import { findBanner } from "@/api/home";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import GoodsItem from "./components/goods-item.vue";
import { findTopCategory } from "@/api/category";

export default {
  components: { GoodsItem },
  name: "TopCategory",
  setup() {
    const sliders = ref([]);
    const store = useStore();
    const route = useRoute();
    const topCategory = computed(() => {
      let cate = {};
      const item = store.state.category.list.find((item) => {
        return item.id === route.params.id;
      });
      if (item) cate = item;
      return cate;
    });
    findBanner().then((data) => {
      sliders.value = data.result;
    });
    const subList = ref([]);
    const getSubList = () => {
      findTopCategory(route.params.id).then((data) => {
        subList.value = data.result.children;
      });
    };
    //定义API，组件初始化要去加载数据，但是动态路由不会重新初始化组件。
    //如果监听地址栏id的变化，然后变化了就去加载数据，但是有初始化就不会加载了。
    //不过watch提供了 immediate: true 可让watch初始化的时候主动触发一次。
    watch(
      () => route.params.id,
      (newVal) => {
        // newVal && getSubList() 加上一个严谨判断，在顶级类名下才发请求,二级类名不触发
        if (newVal && `/category/${newVal}` === route.path) getSubList();
      },
      { immediate: true }
    );
    return { sliders, topCategory, subList };
  },
};
</script>
<style lang="less" scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
