<template>
  <div class="hello">
    <img class="logo" src="@/assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Please choose an operation from left</h2>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to EDL Visualize'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {
  display: block;

  margin-left: auto;
  margin-right: auto;
}
h1, h2 {
  width: 100%;
  font-weight: normal;

  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
