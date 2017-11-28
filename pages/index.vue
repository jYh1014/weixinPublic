<template lang="pug">
  .container
    .house(ref="house")
      .items(v-for='(item,index) in houses' :key='index' @click='showHsouse(item)')
        .desc
          .words {{item.words}}
          .cname {{item.cname}}
          .name {{item.name}}
    .character
      .title 主要人物
      .section
        .items(v-for='(item,index) in characters' :key='index' @click='showCharacter(item)')
          img(:src='item.profile')
          .desc
            .cname {{item.cname}}
            .name {{item.name}}
            .playedBy {{item.playedBy}}
    .city
      .title 维斯特洛
      .intro 坐落于世界的最西端
      .items(v-for='(item,index) in cities' :key='index')
        .title {{item.title}}
        .body {{item.body}}
 
</template>
<<script>
import {mapState} from 'vuex'
  export default {
    head() {
      return {
        title: '冰火脸谱'
      }
    },
    computed: {
      ...mapState(['houses','characters','cities'])
    },
    methods: {
      showHouse(item){
        this.$router.push({
          path: '/house',
          query: {id: item.id}
        })
      },
      showCharacter(item){
        this.$router.push({
          path: '/character',
          query: {id: item.id}
        })
      }
    },
    beforeCreate(){
      this.$store.dispatch('fetchHouses')
      this.$store.dispatch('fetchCharacters')
      this.$store.dispatch('fetchCities')
    }
  }
</script>>
<style scoped>
.title
{
  margin: 50px 0;
}
</style>
