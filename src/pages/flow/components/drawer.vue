<template>
  <div class="Ec-x6-icon">
    <el-drawer
      title="节点拖动"
      v-model="visible"
      :direction="direction"
      :modal="false"
      close-on-click-modal
      show-close
    >
      <section class="listBar" @click.stop="">
        <p @click="showMore = !showMore">
          <img :class="{ arrow: showMore }" src="@/assets/svg/arrow.svg" alt="" />
          系统组件
        </p>
        <div v-if="showMore" class="listBar-cot">
          <div
            v-for="(item, index) in configList"
            :key="index"
            class="drag-cot"
            draggable="true"
            @drag="drag(item)"
            @dragend="dragend(item)"
          >
            <span>
              <img src="@/assets/svg/defaultImg.svg" alt="" />
            </span>
            <p>
              {{ item.props.name }}
            </p>
          </div>
        </div>
      </section>
    </el-drawer>
  </div>
</template>

<script>
  const mouseXY = { x: null, y: null };
  import config from './config';
  import nodeConfig from './nodeConfg'

  export default {
    name: 'DrawerCom',

    data() {
      return {
        visible: true,
        direction: 'ltr',
        showMore: true,
        configList: config,
      };
    },
    mounted() {
      document.getElementById('container').addEventListener(
        'dragover',
        function (e) {
          mouseXY.x = e.clientX;
          mouseXY.y = e.clientY;
        },
        false
      );
    },
    methods: {
      drag: function () {
        // const parentRect = document
        //   .getElementById("container")
        //   .getBoundingClientRect();
        // let mouseInGrid = false;
        // if (
        //   mouseXY.x > parentRect.left &&
        //   mouseXY.x < parentRect.right &&
        //   mouseXY.y > parentRect.top &&
        //   mouseXY.y < parentRect.bottom
        // ) {
        //   mouseInGrid = true;
        // }
      },

      dragend: function (item) {
        const parentRect = document.getElementById('container').getBoundingClientRect();
        let mouseInGrid = false;
        if (
          mouseXY.x > parentRect.left &&
          mouseXY.x < parentRect.right &&
          mouseXY.y > parentRect.top &&
          mouseXY.y < parentRect.bottom
        ) {
          mouseInGrid = true;
        }
        if (mouseInGrid === true) {
          this.$emit('addNode', nodeConfig(item, mouseXY.x, mouseXY.y));
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  :deep(.el-drawer__body){
    overflow-y: auto;
    padding-top: 0;
  }
  :deep(.el-drawer__header){
    margin-bottom: 0;
  }
  :deep(.el-drawer__title){
    font-size: 18px;
  }
  .listBar {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    font-size: 14px;
    width: 100%;
    > p {
      width: 100%;
      > img {
        width: 12px;
        height: 12px;
      }
    }
  }

  .arrow {
    transform: rotate(90deg);
    transition-duration: 0.3s;
  }

  .listBar-cot {
    display: inline-block;
    padding-left: 12px;
    box-sizing: border-box;
    width: 100%;
    text-align: left;
  }

  .listBar-cot .drag-cot {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 62px;
    height: 62px;
  }

  .listBar-cot .drag-cot span {
    display: inline-block;
    width: 50px;
    height: 50px;
  }

  .listBar-cot .drag-cot span img {
    width: 100%;
    height: 100%;
  }

  .listBar-cot .drag-cot p {
    margin: -2px 0 0;
    text-align: center;
    font-size: 12px;
    color: #939393;
  }
</style>
