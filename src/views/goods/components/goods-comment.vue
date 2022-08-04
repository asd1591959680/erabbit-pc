<!-- 商品评价 -->
<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            :class="{ active: currTagIndex === i }"
            v-for="(item, i) in commentInfo.tags"
            :key="item.title"
            @click="changIndex(i)"
            >{{ item.title }}（{{ item.tagCount }}）</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        @click="changSort(null)"
        :class="{
          active: reqParams.sortField == null,
        }"
        >默认</a
      >
      <a
        href="javascript:;"
        @click="changSort('createTime')"
        :class="{
          active: reqParams.sortField === 'createTime',
        }"
        >最新</a
      >
      <a
        href="javascript:;"
        @click="changSort('praiseCount')"
        :class="{
          active: reqParams.sortField === 'praiseCount',
        }"
        >最热</a
      >
    </div>

    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <!-- 星数 -->
          <div class="score">
            <!-- 实星数 -->
            <i
              v-for="i in item.score"
              :key="i + '1'"
              class="iconfont icon-wjx01"
            ></i>
            <!-- 空星数 -->
            <i
              v-for="i in 5 - item.score"
              :key="i + '2'"
              class="iconfont icon-wjx02"
            ></i>
            <!-- 归属地 -->
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <!-- 评价内容 -->
          <div class="text">
            {{ item.content }}
          </div>
          <goods-comment-image
            v-if="item.pictures.length"
            :pictures="item.pictures"
          ></goods-comment-image>
          <div class="time">
            <!-- 时间戳 -->
            <span>{{ item.createTime }}</span>
            <!-- 点赞数 -->
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <xtx-pagination
      :total="total"
      :currentPage="reqParams.page"
      @current-change="changePager"
    />
  </div>
</template>

<script>
import { inject, reactive, ref, watch } from "vue-demi";
import { findGoodsCommentInfo, findGoodsCommentList } from "@/api/product";
import goodsCommentImage from "./goods-comment-image.vue";
export default {
  components: { goodsCommentImage },
  name: "GoodsComment",

  setup() {
    const goods = inject("goods");
    const currTagIndex = ref(0);
    const commentInfo = ref({});
    const commentList = ref([]);
    const total = ref(0);
    findGoodsCommentInfo(goods.value.id).then((data) => {
      data.result.tags.unshift({
        type: "img",
        title: "有图",
        tagCount: data.result.hasPictureCount,
      });
      data.result.tags.unshift({
        type: "all",
        title: "全部评价",
        tagCount: data.result.evaluateCount,
      });
      commentInfo.value = data.result;
    });
    const changIndex = (i) => {
      currTagIndex.value = i;
      //设置有图和标签条件
      const currTag = commentInfo.value.tags[i];
      if (currTag.type === "all") {
        reqParams.hasPicture = false;
        reqParams.tag = null;
      } else if (currTag.type === "img") {
        reqParams.hasPicture = true;
        reqParams.tag = null;
      } else {
        reqParams.hasPicture = false;
        reqParams.tag = currTag.title;
      }
      reqParams.page = 1;
    };
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null,
    });
    const changSort = (type) => {
      reqParams.sortField = type;
      reqParams.page = 1;
    };
    //处理数据，昵称加*号，规格拼接字符串
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${c.name}:${c.nameValue}`, "").trim();
    };
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + "****" + nickname.substr(-1);
    };
    // 改变分页函数
    const changePager = (np) => {
      reqParams.page = np;
    };
    watch(
      reqParams,
      async () => {
        const data = await findGoodsCommentList(goods.value.id, reqParams);
        commentList.value = data.result.items;
        total.value = data.result.counts;
      },
      { immediate: true }
    );

    return {
      commentInfo,
      currTagIndex,
      reqParams,
      changIndex,
      changSort,
      commentList,
      formatSpecs,
      formatNickname,
      changePager,
      total,
    };
  },
};
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
