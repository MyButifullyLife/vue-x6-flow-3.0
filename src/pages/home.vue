<template>
  <div class="home">
    <el-button @click="treeRouter">树状图</el-button>
    <el-button @click="flowRouter">流程图</el-button>
    <el-button @click="dagRouter">dag图</el-button>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  const router = useRouter()
  const treeRouter =()=>{
      router.push('/tree')
  }
  const flowRouter =()=>{
      router.push('/flow')
  }
  const dagRouter =()=>{
      router.push('/dag')
  }
</script>

<style lang="less">
  .home {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 60px;
  }
</style>
