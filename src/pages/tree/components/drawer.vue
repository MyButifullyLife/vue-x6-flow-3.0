<template>
  <el-drawer
      v-model="visible"
      width="900px"
      :modal="false"
  >
    <section>
      <el-input v-model="name" style="width: 300px" placeholder="编辑名字"></el-input>
      <el-button type="success" @click="editPropsFn('name')">
        修改名字
      </el-button>
      <br>
      <br>
      连线label:  <el-input v-model="lineLabel" style="width: 100px" placeholder="分支名字"></el-input>
      <el-button type="success" @click="editFn('lineLabel')">
        修改连线
      </el-button>
      <br>
      <br>
      <el-button type="primary" @click="addFn">
        新增节点
      </el-button>

      <br>
      <br>
      <el-button type="danger" @click="delFn">
        删除
      </el-button>
    </section>

  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      nodeItem: '',
      name: '',
      lineLabel: '',
      height: 50
    }
  },
  methods: {
    init(node) {
      this.nodeItem = JSON.parse(JSON.stringify(node))
      this.name = this.nodeItem.data.props.name
      this.lineLabel = '新增'
      this.visible = true
    },
    editPropsFn(key) {
      this.$emit('editProps',this.nodeItem.id, key, this.name)
      this.visible = false
    },
    editFn(key) {
      this.$emit('edit',this.nodeItem.id, key, this.lineLabel)
      this.visible = false
    },
    addFn() {
      this.$emit('add', this.nodeItem, this.lineLabel, this.height)
      this.visible = false
    },
    delFn() {
      this.$emit('del', this.nodeItem)
      this.visible = false
    },
    submit() {
      this.visible = false
    }
  }
}
</script>


<style scoped>

</style>
