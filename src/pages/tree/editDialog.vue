<template>
  <el-dialog
      title="提示"
      :visible.sync="visible"
      width="900px"
  >
    <section>

      <el-input v-model="name" style="width: 300px" placeholder="编辑名字"></el-input>
      <el-button type="success" @click="editFn">
        编辑
      </el-button>
      <br>
      <br>
      连线label:  <el-input v-model="lineLabel" style="width: 100px" placeholder="分支名字"></el-input>
      <br>
      <br>
      高度：<el-input v-model="height" style="width: 100px" placeholder="高度"></el-input>
      <el-button type="primary" @click="addFn">
        新增节点
      </el-button>

      <br>
      <br>
      <el-button type="danger" @click="delFn">
        删除
      </el-button>
    </section>

  </el-dialog>
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
      this.name = this.nodeItem.data.data.name
      this.lineLabel = '新增'
      this.height = 50
      this.visible = true
    },
    editFn() {
      this.nodeItem.data.data.name = this.name
      this.$emit('edit', this.nodeItem)
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
