<template lang='pug'>
   .cell
    span {{title}}
    span(v-if='content') {{content}}
        
</template>
<script>
import {mapState} from 'vuex'
export default {
  props: {
      title: String,
      content: String
  }
}
</script>

<style lang='sass' >
@import '~static/sass/color'
@import '~static/sass/mixin'

.cell
  width: 100%
  font-size: 0

  > *
    vertical-align: middle
    display: inline-block

  span
    width: 50%
    text-align: left
    +font-dpr(15px)

  .material-icon
    width: 50%
    text-align: right
    +font-dpr(33px)
    color: $grey-800
</style>
