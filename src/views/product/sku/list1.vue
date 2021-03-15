<template>

  <div>
    <h2>子级组件</h2>
    <List2 />
  </div>
</template>
<script>
import List2 from './list2'
export default {
  components:{
    List2
  }
}
</script>
<style lang="scss" scoped>
h2{
  color:green;
}
</style>