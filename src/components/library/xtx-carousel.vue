<!-- 轮播图 -->
<template>
  <div class="xtx-carousel" @mouseenter="stop()" @mouseleave="start()">
    <ul class="carousel-body">
      <!-- fade 显示的图片，让符合index的序号图片显示 -->
      <li
        class="carousel-item"
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ fade: index === i }"
      >
        <router-link v-if="item.hrefUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="" />
        </router-link>
        <div v-else class="slider">
          <!-- router-link默认是a标签 -->
          <router-link
            v-for="goods in item"
            :key="goods.id"
            :to="`/product/${goods.id}`"
          >
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </router-link>
        </div>
      </li>
    </ul>
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ active: index === i }"
        @click="index = i"
      ></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from "vue-demi";
export default {
  name: "XtxCarousel",
  props: {
    sliders: {
      type: Array,
      default: () => [],
    },
    duration: {
      type: Number,
      default: 3000,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    //默认显示图片索引
    const index = ref(0);
    //自动播放
    let timer = null;
    const autoPlayFn = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        index.value++;
        if (index.value >= props.sliders.length) {
          index.value = 0;
        }
      }, props.duration);
    };
    // 需要监听sliders数据变化，判断如果有数据且autoPlay是true
    watch(
      () => props.sliders,
      (newVal) => {
        if (newVal.length && props.autoPlay) {
          autoPlayFn();
        }
      },
      { immediate: true }
    );
    const stop = () => {
      if (timer) clearInterval(timer);
    };
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn();
      }
    };
    // 指示器切换，上一张，下一张
    const toggle = (step) => {
      const newIndex = index.value + step;
      //轮播图序号大于长度
      if (newIndex > props.sliders.length - 1) {
        index.value = 0;
        return;
      }
      //轮播图序号小于0
      if (newIndex < 0) {
        index.value = props.sliders.length - 1;
        return;
      }
      index.value = newIndex;
    };
    onUnmounted(() => {
      clearInterval(timer);
    });
    return { index, stop, start, toggle };
  },
};
</script>
<style lang="less" scoped>
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
      .slider {
        display: flex;
        justify-content: space-around;
        padding: 0 40px;
        > a {
          width: 240px;
          text-align: center;
          img {
            padding: 20px;
            width: 230px !important;
            height: 230px !important;
          }
          .name {
            font-size: 16px;
            color: #666;
            padding: 0 40px;
          }
          .price {
            font-size: 16px;
            color: @priceColor;
            margin-top: 15px;
          }
        }
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
