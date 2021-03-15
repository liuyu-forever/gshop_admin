<template>
  <div>
    <h2>父级组件</h2>
    <List1 />
  </div>
</template>
<script>
import List1 from './list1'
export default {
  components: {
    List1,
  },
}

/**
 *
 * 组件中不使用scoped,那么样式会作用在当前组件及所有的组件
 * 组件中使用了scoped,那么样式不仅作用在当前组件,也会作用在子级组件的根标签上
 * 组件中使用了scoped后,那么组件所生成的标签中会出现唯一的标识码
 * 组件中可以使用多对的style标签,如果其他的style标签中没有使用scoped,那么后代的组件中相关的标签的样式会发生变化
 * css的这种代码在Vue的组件中,如果组件都使用了css的样式,及style标签中使用了scoped,想要在父级组件中修改后代组件中的某些标签的样式,可以使用 >>>  深度选择器
 * scss中如果想要实现上面的效果
 *   ::v-deep 选择器  在less中也可以
 *   /deep/  选择器   在css中
 *   &gt;&gt;&gt; /deep/ 
 * 
 */
</script>
<style lang="scss">
// h2 {
//   color: yellow;
// }
</style>
<style lang="scss" scoped>
/* div >>> h2 {
  color: red;
} */

::v-deep h2{
  color:red;
}
</style>