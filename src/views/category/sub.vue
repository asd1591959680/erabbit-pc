<!--  -->
<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <sub-bread></sub-bread>
      <!-- 筛选区 -->
      <sub-filter @filter-change="changeFilter"></sub-filter>
      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <sub-sort @sort-change="changeSort"></sub-sort>
        <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <goods-item :goods="item" />
          </li>
        </ul>
        <!-- 加载 -->
        <xtx-infinite-loading
          :loading="loading"
          :finished="finished"
          @infinite="getData"
        ></xtx-infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue-demi";
import { useRoute } from "vue-router";
import GoodsItem from "./components/goods-item.vue";
import subBread from "./components/sub-bread.vue";
import SubFilter from "./components/sub-filter.vue";
import SubSort from "./components/sub-sort.vue";
import { findSubCategoryGoods } from "@/api/category";
export default {
  components: { subBread, SubFilter, SubSort, GoodsItem },
  name: "SubCategory",
  setup() {
    const route = useRoute();
    const loading = ref(false);
    const finished = ref(false);
    const goodsList = ref([]);

    let reqParams = {
      page: 1,
      pageSize: 20,
    };
    const getData = () => {
      loading.value = true;
      reqParams.categoryId = route.params.id;
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items);
          reqParams.page++;
        } else {
          finished.value = true;
        }
        loading.value = false;
      });
    };
    const changeFilter = (filterParams) => {
      reqParams = { ...reqParams, ...filterParams };
      reqParams.page = 1;
      goodsList.value = [];
      finished.value = false;
    };
    const changeSort = (sortParams) => {
      reqParams = { ...reqParams, ...sortParams };
      console.log(reqParams);
      reqParams.page = 1;
      goodsList.value = [];
      finished.value = false;
    };
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && route.path === "/category/sub/" + newVal) {
          goodsList.value = [];
          reqParams = {
            page: 1,
            pageSize: 20,
          };
          finished.value = false;
        }
      }
    );
    return { loading, finished, goodsList, getData, changeFilter, changeSort };
  },
};
</script>
<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
