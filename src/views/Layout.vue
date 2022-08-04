<!--  -->
<template>
  <div>
    <app-topnav></app-topnav>
    <app-header></app-header>
    <app-header-sticky></app-header-sticky>
    <main>
      <!-- 二级路由 -->
      <router-view></router-view>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from "@/components/app-header.vue";
import AppTopnav from "@/components/app-topnav.vue";
import AppFooter from "@/components/app-footer.vue";
import { useStore } from "vuex";
import AppHeaderSticky from "@/components/app-header-sticky.vue";
export default {
  components: { AppHeader, AppTopnav, AppFooter, AppHeaderSticky },
  name: "xtx-layout",
  setup() {
    const store = useStore();
    store.dispatch("category/getList");
  },
};
</script>
<style lang="less" scoped></style>
