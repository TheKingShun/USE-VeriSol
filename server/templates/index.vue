<template>
  <div id="app">
    <p>{{message}}</p>
  </div>
</template>


<script>
    import Vue from "vue"
    var app = new Vue({
        el:"#app",
        data:{
            message:"hello world"
        }
    })

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
