<template>
  <div class="member-home">
    <home-overview />
    <home-panel :title="'我的收藏'">
      <goods-item v-for="i in collectGoods" :key="i.id" :goods="i" />
    </home-panel>
    <home-panel :title="'我的足迹'">
      <goods-item v-for="i in tailGoods" :key="i.id" :goods="i" />
    </home-panel>
    <goods-relevant />
  </div>
</template>
<script>
import GoodsRelevant from '@/views/goods/components/goods-relevant.vue'
import HomeOverview from './components/home-overview.vue'
import HomePanel from './components/home-panel.vue'
import GoodsItem from '@/views/category/components/goods-item.vue'
import { ref } from 'vue-demi'
import { findCollect, findTail } from '@/api/index'
export default {
  components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },
  name: 'MemberHome',
  setup() {
    const collectGoods = ref([])
    const tailGoods = ref([])
    findCollect({
      page: 1,
      pageSize: 4,
    }).then(data => {
      collectGoods.value = data.result.items
    })
    findTail({
      page: 1,
      pageSize: 4,
    }).then(data => {
      tailGoods.value = data.result.items
    })

    return { collectGoods, tailGoods }
  },
}
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
