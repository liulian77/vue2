export default {
    props:{
        //高度的控制
        height:{
            type:[String, Number],
            default:36
        },
        //宽度的控制
        width:{
            type:[String, Number],
            default:270
        },
    },
    computed: {
        wrapStyles(){
            let style={};
            ['height','width'].forEach(item=>{
                style[item]=this.typeOf(this[item])==='number'?this[item]+'px':this[item];
            });
            (this.typeOf(this.height)==='number')&&(style['light-height']=this.height+'px');
            return style;
        },
        widthStyles(){
            let style={};
            ['width'].forEach(item=>{
                style[item]=this.typeOf(this[item])==='number'?this[item]+'px':this[item];
            });
            return style;
        },
    },
    methods:{
        //判断value的值是不是object
        typeOf(val) {
            return Object.prototype.toString.call(val).toLowerCase().slice(8,-1);
        },
    }
};
