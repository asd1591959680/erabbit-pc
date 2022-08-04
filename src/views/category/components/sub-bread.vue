<!-- 二级类目-展示面包屑 -->
<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{
      category.top.name
    }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{
        category.sub.name
      }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script>
import { computed } from "vue-demi";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "SubBread",
  setup() {
    const route = useRoute();
    const store = useStore();
    const category = computed(() => {
      const obj = {};
      store.state.category.list.forEach((top) => {
        top.children &&
          top.children.forEach((sub) => {
            if (sub.id === route.params.id) {
              obj.sub = { id: sub.id, name: sub.name };
              obj.top = { id: top.id, name: top.name };
            }
          });
      });
      return obj;
    });
    // 模版需要使用的东西需要setup返回
    return { category };
  },
};
</script>
<style lang="less" scoped></style>
