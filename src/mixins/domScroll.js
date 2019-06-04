/**
 * @desc 上拉滚动加载
 */


import { throttle } from 'lodash'
export default {
    props: {
        scrollLoad:{
            type: Boolean,
            default:false
        },
    },
    methods: {
        menuScroll:throttle(function (event) {
            if(!this.scrollLoad){
                return false;
            }
            let target=event.target,
                prevHeight=sessionStorage.scrollHeight?sessionStorage.scrollHeight:0,   //上次滚动的高度
                bottomHeight=target.scrollHeight-target.offsetHeight-target.scrollTop+2; //距离底部的高度
            sessionStorage.scrollHeight=target.scrollTop;
            if(target.scrollTop>prevHeight&&bottomHeight<20){
                this.$emit('downLoad');
            }
        },500),
    },
    created() {
        sessionStorage.scrollHeight=0;
    },
    beforeDestroy(){
        sessionStorage.removeItem('scrollHeight');
    }
};
