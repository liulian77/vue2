<template>
    <div class="container">
<!--        <area-select v-model="type"></area-select>-->
        <mix-option></mix-option>
    </div>
</template>

<script>
    import {areaSelect,mixOption} from '_c'
    const components={
        'area-select':areaSelect,
        'mix-option':mixOption,
    };
    export default {
        name: "index",
        data(){
          return {
              type:2
          }
        },
        components
    }
</script>

<style scoped>
.container{
    background-color: #fff;
    padding: 50px;
    height: 100%;
}
</style>
