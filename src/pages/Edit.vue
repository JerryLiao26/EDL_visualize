<template>
  <edl-editor v-bind:index='index'></edl-editor>
</template>

<script>
import editor from '@/components/Editor'
export default {
  data() {
    return {
      index: -1,
    }
  },
  components: {
    'edl-editor': editor
  },
  created() {
    if (typeof(this.$route.params.index) !== "undefined") {
      this.index = parseInt(this.$route.params.index)
    }
  },
  watch: {
    '$route' (newVal) {
      if (typeof(newVal.params.index) !== "undefined") {
        this.index = parseInt(newVal.params.index)
      }
    },
  }
}
</script>

<style scoped>

</style>
