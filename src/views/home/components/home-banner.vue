<!--  -->
<template>
  <div class="home-banner">
    <xtx-carousel
      class="xtx-carousel"
      auto-play
      :sliders="sliders"
    ></xtx-carousel>
  </div>
</template>

<script>
import { findBanner } from "@/api/home";
import { ref } from "vue";
export default {
  name: "HomeBanner",
  setup() {
    const sliders = ref([]);
    findBanner().then((data) => {
      sliders.value = data.result;
    });
    return { sliders };
  },
};
</script>
<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
.xtx-carousel {
  :deep(.carousel-btn.prev) {
    left: 270px;
  }
  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}
</style>
