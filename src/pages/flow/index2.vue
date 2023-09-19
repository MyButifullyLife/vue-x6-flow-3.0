<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <section class="section-cot" style="width: 100%; height: 100%">
      <div id="container" @click.stop="hideFn">
        <MenuBar v-if="showContextMenu" ref="menuBar" @callBack="contextMenuFn" />
        <header>
          <el-icon class="icon"><Setting @click="showDrawerFn()" /></el-icon>
          <el-icon class="icon"><Plus @click="zoomFn(0.2)" /></el-icon>
          <el-icon class="icon"><Minus @click="zoomFn(-0.2)" /></el-icon>
          <el-icon class="icon"><Position @click="centerFn" /></el-icon>
          <el-icon class="icon"><UploadFilled @click="saveFn()" /></el-icon>
          <el-icon class="icon"><Loading @click="loadFn()" /></el-icon>
        </header>
        <div id="draw-cot" />
        <Drawer ref="drawer" @addNode="addNode" />
      </div>
    </section>
    <DialogMysql ref="dialogMysql"></DialogMysql>
  </div>
</template>

<script>
  import '@antv/x6-vue-shape';
  import MenuBar from './components/menuBar.vue';
  import Drawer from './components/drawer.vue';
  import DialogMysql from './components/dialog/mysql.vue';
  import { initGraph } from './components/graph.js';

  export default {
    name: 'App',
    components: { MenuBar, Drawer, DialogMysql },
    data() {
      return {
        graph: '',
        timer: '',
        isLock: false,
        showContextMenu: false,
      };
    },
    mounted() {
      this.graph = initGraph();
      // 按钮绑定
      this.keyBindFn();

    },
    methods: {
      getNodeById(id) {
        return this.graph.getCellById(id);
      },
      hideFn() {
        this.showContextMenu = false;
      },

      zoomFn(num) {
        this.graph.zoom(num);
      },
      centerFn() {
        const num = 1 - this.graph.zoom();
        num > 1 ? this.graph.zoom(num * -1) : this.graph.zoom(num);
        this.graph.centerContent();
      },
      keyBindFn() {
        // copy cut paste
        this.graph.bindKey(['meta+c', 'ctrl+c'], () => {
          const cells = this.graph.getSelectedCells();
          if (cells.length) {
            this.graph.copy(cells);
          }
          return false;
        });
        this.graph.bindKey(['meta+x', 'ctrl+x'], () => {
          const cells = this.graph.getSelectedCells();
          if (cells.length) {
            this.graph.cut(cells);
          }
          return false;
        });
        this.graph.bindKey(['meta+v', 'ctrl+v'], () => {
          if (!this.graph.isClipboardEmpty()) {
            const cells = this.graph.paste({ offset: 32 });
            this.graph.cleanSelection();
            this.graph.select(cells);
          }
          return false;
        });

        // undo redo
        this.graph.bindKey(['meta+z', 'ctrl+z'], () => {
          if (this.graph.history.canUndo()) {
            this.graph.history.undo();
          }
          return false;
        });
        // delete
        this.graph.bindKey(['delete'], () => {
          const select = this.graph.getSelectedCells();
          select?.forEach((item) => {
            if (/edge/.test(item.shape)) {
              this.graph.removeEdge(item.id);
            } else {
              this.graph.removeNode(item.id);
            }
          });
          return false;
        });
      },
      saveFn() {
        localStorage.setItem('x6Json', JSON.stringify(this.graph.toJSON({ diff: true })));
      },
      loadFn() {
        this.timer && clearTimeout(this.timer);
        const x6Json = JSON.parse(localStorage.getItem('x6Json'));
      },
      contextMenuFn(type, node) {
        switch (type) {
          case 'remove':
            if (node.type == 'edge') {
              this.graph.removeEdge(node.item.id);
            } else if (node.type == 'node') {
              this.graph.removeNode(node.item.id);
            }
            break;
          case 'source':
            this.$refs.dialogMysql.visible = true;
            this.$refs.dialogMysql.init(node);
            break;
        }

        this.showContextMenu = false;
      },

      showDrawerFn() {
        this.$refs.drawer.visible = !this.$refs.drawer.visible;
      },
      addNode(option) {
        const p = this.graph.pageToLocal(option.x, option.y);
        this.graph.addNode(Object.assign({}, option, p));
      },
    },
  };
</script>

<style lang="less" scoped>
  header {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    padding: 10px;
    .icon {
      font-size: 16px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
</style>
