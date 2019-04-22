<template>
  <div id="app">
    <div class="drawer-container">
      <div class="drawer-item" @click="navigate('new')">
        New EDL
      </div>
      <div class="drawer-item" @click="navigate('import')">
        Import EDL
      </div>
      <div class="drawer-item" @click="navigate('list')">
        Saved EDL List
      </div>
    </div>
    <div class="inner-container">
      <div class="header">
        <div class="content-container">
          EDL Visualize
        </div>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    navigate(name) {
      let path = '/' + name
      this.$router.push(path);
    }
  }
}
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  .invisible {
    display: none;
  }

  .drawer-container {
    width: 300px;

    position: absolute;
    bottom: 0;
    left: 0;
    top: 0;

    z-index: 9;

    background-color: #F5F5F5;
    box-shadow: 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.2);

    padding-top: 125px;

    overflow: hidden;
    float: left;
  }

  .drawer-item {
    width: 100%;
    height: 75px;

    line-height: 75px;

    overflow: hidden;

    text-align: center;

    cursor: pointer;

    transition: all 0.5s;
  }

  .drawer-item:hover,
  .drawer-item.active {
    background-color: #009688;
  }

  .inner-container {
    width: calc(100% - 300px);
    height: auto;

    margin-top: 120px;

    overflow: hidden;
    float: right;

    position: relative;
  }

  .content-container {
    width: 90%;

    margin-left: auto;
    margin-right: auto;

    overflow: hidden;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .header {
    width: calc(100% - 300px);
    height: 75px;

    line-height: 75px;
    text-align: left;
    font-size: 1.5em;
    font-weight: bold;

    background-color: #F5F5F5;

    position: fixed;
    right: 0;
    top: 0;

    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }

  .button {
    width: 125px;
    height: 45px;

    line-height: 45px;
    text-align: center;

    margin-right: 32px;
    margin-bottom: 16px;

    background-color: #F5F5F5;

    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
    box-sizing: border-box;

    float: left;

    cursor: pointer;

    transition: all 0.5s;
  }

  .button:hover {
    background-color: #009688;
  }
</style>
