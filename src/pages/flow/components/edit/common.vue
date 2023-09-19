<template>
  <div class="Ec-x6-icon">
    <el-drawer
      :title="node ? node.data.props.name : ''"
      v-model="visible"
      :direction="direction"
      :modal="false"
      :modal-append-to-body="false"
      close-on-click-modal
      show-close
    >
      <section class="listBar" @click.stop="" v-if="node">
        <el-form :model="form" label-width="120px">
          <el-form-item label="节点ID">
            {{ node.id }}
          </el-form-item>
          <el-form-item label="Activity name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="Activity zone">
            <el-select v-model="form.region" placeholder="please select your zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
      </section>
      <footer>
        <el-button @click="saveFn">保存</el-button>
      </footer>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    props: {
      graph: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
    data() {
      return {
        visible: false,
        direction: 'rtl',
        form: {
          name: '',
          region: '',
        },
        node: '',
      };
    },
    mounted() {},
    methods: {
      saveFn() {
        const node  = this.graph.getCellById(this.node.id);
        node.setData({...node.data,...{props: this.form}})
        this.visible = false;
      },
      init(node) {
        this.node = node;
        this.visible = true;
        for (const key in this.form) {
          this.form[key] = this.node.data.props[key];
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  :deep(.el-drawer__body) {
    overflow-y: auto;
    padding-top: 0;
  }
  :deep(.el-drawer__header) {
    margin-bottom: 0;
  }
  :deep(.el-drawer__title) {
    font-size: 18px;
  }
</style>
