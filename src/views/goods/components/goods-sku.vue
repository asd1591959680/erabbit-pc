<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected }"
            @click="clickSpecs(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            alt=""
          />
          <span
            :class="{ selected: val.selected }"
            @click="clickSpecs(item, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
    <dl>
      <dt>尺寸</dt>
      <dd>
        <span class="disabled">10英寸</span>
        <span class="selected">20英寸</span>
        <span>30英寸</span>
      </dd>
    </dl>
    <dl>
      <dt>版本</dt>
      <dd>
        <span>美版</span>
        <span>港版</span>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from "@/vender/power-set";

const spliter = "★";
const getPathMap = (skus) => {
  const pathMap = {};
  skus.forEach((sku) => {
    if (sku.inventory) {
      const specs = sku.specs.map((spec) => spec.valueName);

      const powerSet = getPowerSet(specs);

      powerSet.forEach((set) => {
        const key = set.join(spliter);
        if (pathMap[key]) {
          pathMap[key].push(sku.id);
        } else {
          pathMap[key] = [sku.id];
        }
      });
    }
  });
  return pathMap;
};

//得到当前选中规格集合
const getSelectedArr = (specs) => {
  const selectedArr = [];
  specs.forEach((spec) => {
    const selectedVal = spec.values.find((val) => val.selected);
    selectedArr.push(selectedVal ? selectedVal.name : undefined);
  });
  return selectedArr;
};
//更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((spec, i) => {
    const selectedArr = getSelectedArr(specs);
    spec.values.forEach((val) => {
      //已选中按钮不用判断
      if (val.name === selectedArr[i]) return false;
      //未选中的替换对应值
      selectedArr[i] = val.name;
      //过滤无效值得到key
      const key = selectedArr.filter((v) => v).join(spliter);
      //设置禁用状态
      val.disabled = !pathMap[key];
    });
  });
};

//初始化选中状态
const initSelectedStatus = (goods, skuId) => {
  const sku = goods.skus.find((sku) => sku.id === skuId);
  if (sku) {
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName;
      spec.values.forEach((val) => {
        val.selected = val.name === value;
      });
    });
  }
};
export default {
  name: "GoodsSku",
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: [], skus: [] }),
    },
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const pathMap = getPathMap(props.goods.skus);
    //组件初始化更新禁用状态
    updateDisabledStatus(props.goods.specs, pathMap);
    initSelectedStatus(props.goods, props.skuId);
    const clickSpecs = (item, val) => {
      if (val.disabled) return false;
      if (val.selected) {
        val.selected = false;
      } else {
        item.values.forEach((bv) => {
          bv.selected = false;
        });
        val.selected = true;
      }
      //点击更新禁用状态
      updateDisabledStatus(props.goods.specs, pathMap);

      const selectedArr = getSelectedArr(props.goods.specs).filter((v) => v);
      if (selectedArr.length === props.goods.specs.length) {
        const skuId = pathMap[selectedArr.join(spliter)];
        const sku = props.goods.skus.find((sku) => sku.id === skuId[0]);
        emit("change", {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 ... 这样的字符串
          specsText: sku.specs
            .reduce((p, c) => `${p} ${c.name}：${c.valueName}`, "")
            .trim(),
        });
      } else {
        emit("change", {});
      }
    };

    return { clickSpecs };
  },
};
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
