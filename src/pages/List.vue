<template>
  <div class="content-container">
    <template v-for="(item, index) in saved_data">
      <div class="list-container" :key="item">
        {{ item.name }}
        <div class="button" @click='del(index)'>DELETE</div>
        <div class="button" @click='jump(index)'>EDIT</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      saved_data: []
    }
  },
  mounted() {
    let list = JSON.parse(localStorage.getItem('savedList'))
    if (!list) {
      this.saved_data = []
    } else {
      this.saved_data = list
    }
  },
  methods: {
    jump(index) {
      this.$router.push({name: 'Edit', params: {index: index}})
    },
    del(index) {
      let res = confirm('确定删除该EDL？')
      if (res) {
        let list = JSON.parse(localStorage.getItem('savedList'))
        list.splice(index, 1)
        this.saved_data = list
        localStorage.setItem('savedList', JSON.stringify(list))
      }
    }
  },
}
</script>

<style scoped>
  .list-container {
    width: 100%;
    height: 64px;

    line-height: 64px;

    padding-left: 16px;
    padding-right: 16px;
    margin-top: 8px;
    margin-bottom: 8px;

    box-sizing: border-box;

    float: left;

    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);

    cursor: pointer;
  }

  .button {
    float :right;

    margin-top: 9.5px;
    margin-bottom: 9.5px;
  }
</style>
