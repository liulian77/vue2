<!--
 * @Description: In User Settings Edit
 * @Author: jiangxiangdan
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-10 11:41:25
 * @LastEditTime: 2019-05-13 15:27:00
 -->
<template>
    <div 
            v-clickoutside="handleClose"
            class="el-dist-picker"
            >
        <div class="value-show" v-show="selectItem.length">
            <section>
                <div class="title">
                    <div>已选结果</div>
                    <div><a href="javascript:;">清空</a></div>
                </div>
                <div class="content">
                    <span>
                        <div class="wrapper">
                            <div>上海<Icon type="error" :size="15" color="#ccc"></Icon></div>
                        </div>
                    </span>
                    <span>
                        <div class="wrapper">
                            <div>陕西<Icon type="error" :size="15" color="#ccc"></Icon></div>
                        </div>
                    </span>
                </div>
            </section>
        </div>
        <div class="search-box" @click="ulShow">
            <Icon type='search'
                    :size="15"
                    color="#ebedf2"
                    class="search"
                    :style="IconSyles"></Icon>
            <input type="text" class='search-btn' :placeholder="pretext" />
        </div>
        <div class="search-ul" :class="ulClass" @scroll="searchUlScroll">
            <ul v-if="pageInfo.mainMenu">
                <li v-for="(main, index) in pageInfo.mainMenu" :key="index">
                    <div class='menu-wrap'>
                        <div class="menu-left" @click="menuClick(index, main)">
                            <Icon type="arrow-right" color="#bdbec0"
                                    class="arrow"
                                    :class="mainSelect[index] && mainSelect[index].class"
                                    :more="true" 
                                    :size="15"/>
                            {{main.name}}
                        </div>
                        <div class="right" @click="menuRight()">
                            <Icon type="checkbox" :size="15"  color="#bdbec0" />
                        </div>
                    </div>
                    <div class="loading-wrapper" v-if="mainSelect[index] && mainSelect[index].status">
                        <Loading :visible="true"></Loading>
                    </div>
                    <ul v-if="secMenu[index]">
                        <li v-for="(item, idx) in secMenu[index].data" :key="idx">
                            <div class='menu-wrap'>
                                <div class="menu-left" @click="menuClick(idx, item, index)">
                                    <Icon type="arrow-right" color="#bdbec0"
                                            class="arrow"
                                            :more="true" 
                                            :size="15"/>
                                    {{item.name}}
                                </div>
                                <div class="right" @click="menuRight()">
                                    <Icon type="checkbox" :size="15"  color="#bdbec0" />
                                </div>
                            </div>
                            <ul v-if="thirdMenu[idx]">
                                <li v-for="(third, tidx) in thirdMenu[idx].data" :key="tidx">
                                    <div class='menu-wrap'>
                                        <div class="menu-left">
                                            {{third.name}}
                                        </div>
                                        <div class="right" @click="menuRight(third, secMenu[index][idx], pageInfo.mainMenu[index])">
                                            <Icon type="checkbox" :size="15"  color="#bdbec0" />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Input from '_c/input'
import Icon from "_c/icon";
import { deepCopy } from '@/utils/assist'
import Clickoutside from '@/mixins/clickoutside';
import { api_global } from '@/api'
import {style,Emitter,domScroll} from "@/mixins";

export default {
    name: 'ElDistPicker',
    mixins: [style,Emitter,domScroll],
    props: {
        value:[String, Number,Array,Object],
        pretext:{
            type: [String, Number],
            default: '搜索省，市，行政区，商圈或具体地点'
        },
        height: {
            //type: Number,
            default: 36
        },
        defaultItems: {
            type: [Array, Object],
            default: null
        },
        type: { // 标识朋友圈还是公众号 0：朋友圈 1：公众号
            type: Number,
            default: 0
        },
        scrollLoad: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pageInfo: {
                type: 0,
                page: 1,
                row: 10,
                totalPage: 0,
                mainMenu: null,
                getRegionUrl: '/ad/wx/region/getRegion.json',
            },
            isShow: false,
            secMenu: {},
            mainSelect: {},
            thirdMenu: {},
            handleIn: false,
            selectItem: [],
            hoverIndex: -1
        }
    },
    computed: {
        placeHolder() {
            return '搜索省，市，行政区，商圈或具体地点'
        },
        IconSyles() {
            let styles = {
                'line-height': (this.height-(10*2+1*2))+'px'
            };
            return styles;
        },
        items() {
            if (this.defaultItems) {
                let { data } = this.defaultItems;
                return data;
            }
            return [];
        },
        ulClass() {
            let upClass= [this.isShow?'':'none'];
            return upClass;
        }

    },
    components: {
       Input,
       Icon
    },
    watch: {
        defaultItems(val) {
            this.pageInfo.page = val.page;
            this.pageInfo.mainMenu = deepCopy(val.data);
            this.pageInfo.row = val.row;
            this.pageInfo.totalPage = Math.ceil(val.count / val.row);
        },
        type(val) {
            this.pageInfo.type = val;
        }
    },
    directives: {
        Clickoutside,
        scrollLoad: {
            bind: (el, binding) => {
                let val = binding.value;
                el.addEventListener('scroll', async ()=> {
                    if(el.scrollTop + el.offsetHeight >= el.scrollHeight) {
                        if (val.page < val.totalPage) {
                            val.page = val.page + 1;
                            let data = {
                                type: val.type,
                                page: val.page
                            };
                            let options = {
                                url: val.getRegionUrl,
                                data
                            };
                            let res = await api_global.getMessage(options);
                            let _data = val.mainMenu;
                            _data.concat(res.data);
                            val.mainMenu = _data;
                        }
                    }
                })
            }
        }
    },
    methods: {
        async searchUlScroll(el) {
            let target = el.target;
            if(target.scrollTop + target.offsetHeight >= target.scrollHeight) {
                if (this.pageInfo.page < this.pageInfo.totalPage) {
                    this.pageInfo.page = this.pageInfo.page + 1;
                    let data = {
                        type: this.pageInfo.type,
                        page: this.pageInfo.page
                    };
                    let options = {
                        url: this.pageInfo.getRegionUrl,
                        data
                    };
                    let res = await api_global.getMessage(options);
                    let _data = this.pageInfo.mainMenu;
                    this.$set(this.pageInfo, 'mainMenu', _data.concat(res.data));
                    // this.pageInfo.mainMenu = _data;
                }
            }
        },
        ulShow() {
            this.isShow = true;
        },
        handleClose() {
            this.isShow=false;
        },
        handleMouseEnter(index) {
            this.hoverIndex = index;
        },
        handleMouseLeave() {
            this.hoverIndex = -1;
        },
        menuRight(self, parent, superParent) {
            if (parent && superParent) { //三级

            } else if (parent) { //二级

            } else { // 主菜单

            }
        },
        async menuClick(index, menu, flag) {
            if (flag === undefined) {
                this.$set(this.mainSelect, index, {status: true, class: 'active'});
            } else {
                let _data = this.secMenu[flag];
                if (_data) {
                    _data.status = true;
                    _data.class = 'active';
                } else {
                    _data = {status: true, class: 'active'}
                }
                this.$set(this.secMenu, flag, _data);
            }
            let options = {
                url: this.pageInfo.getRegionUrl,
                data: {
                    parent_id: menu.id,
                    type: this.type
                }
            }
            let res = await api_global.getMessage(options);
            if (!flag) {
                if (res.count > res.row) {
                    options.data.row = res.count;
                    res = await api_global.getMessage(options);
                }
            }
            if (!flag) {
                if (res.data.length) {
                    this.$set(this.mainSelect, index, {status: false, class: 'active'});
                } else {
                    this.$set(this.mainSelect, index, {status: false, class: ''});
                }
                this.$set(this.secMenu, index, res);
            } else {
                let _data = this.secMenu[flag];
                _data.status = false;
                if (res.data.length) {
                    _data.class = 'active';
                    this.$set(this.secMenu, flag, _data);
                } else {
                    _data.class = '';
                    this.$set(this.secMenu, flag, _data);
                }
                this.$set(this.thirdMenu, index, res);
            }
        }
    },
    model: {
        event: 'modelUpdate'
    }
}
</script>

<style lang='less'>
    .el-dist-picker {
        position: relative;
        width: 360px;
        display: flex;
        border-radius: 2px;
        align-items: center;
        flex-direction: column;
        background-color: #fff;
        .value-show {
            width: 100%;
            padding: 8px 12px;
            box-sizing: border-box;
            margin-bottom: 8px;
            box-shadow: inset 0 0 0 1px #e3e4e6;
            border-radius: 3px;
            section {
                display: block;
                .title {
                    display: -ms-flexbox;
                    display: flex;
                    -ms-flex-pack: justify;
                    justify-content: space-between;
                    font-size: 13px;
                    color: #65676e;
                    margin-bottom: 4px;
                    a {
                        color: #1473CC;
                        text-decoration: none;
                    }
                }
                .content {
                    padding-left: 8px;
                    overflow-y: scroll;
                    max-height: 85px;
                    &::-webkit-scrollbar {
                        width: 10px;
                        height: 6px;
                    }
                    &::-webkit-scrollbar-track {
                        background: #fff
                    }
                    &::-webkit-scrollbar-thumb {
                        background-color: #c0c1c2;
                        border: 2px solid #fff;
                        border-radius: 15px;
                    }
                    .wrapper {
                        display: inline-block;
                        vertical-align: top;
                        box-sizing: border-box;
                        height: 28px;
                        font-size: 13px;
                        line-height: 28px;
                        color: #24262e;
                        white-space: nowrap;
                        border-radius: 3px;
                        cursor: default;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        font-size: 14px;
                        background-color: #fff;
                        box-shadow: none;
                        padding: 0px 4px;
                        margin-bottom: 0px;
                        margin-right: 0px;
                        i {
                            margin-left: 4px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .search-box {
            width: 100%;
            height: 36px;
            background-color: #ffffff;
            border-radius: 2px;
            border: solid 1px #dfe2e6;
            padding: 10px  12px;
            display: flex;
            input[type='text']{
                flex: 1;
                padding-left: 10px;
                -webkit-appearance: none;
                background-image: none;
                background-color: #ffffff;
                box-sizing: border-box;
                font-size: 14px;
                color: #354052;
                display: inline-block;
                outline: none;
                transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                cursor: pointer;
                border-radius: 2px;
                border: none;
                caret-color:#2198f0;
            }
        }
        .none {
            display: none;
        }
        .search-ul{
            width: 100%;
            max-height: 280px;
            overflow-x: hidden;
            overflow-y: auto;
            background-color: #ffffff;
            box-shadow: 0px 6px 18px 0px rgba(37, 46, 61, 0.08);
            border-radius: 2px;
            border: solid 1px #dfe2e6;
            position: absolute;
            left: 0;
            bottom: -10px;
            transform: translateY(100%);
            z-index: 10;
            ul {
                padding-left: 20px;
                li {
                    &:hover {
                        .arrow {
                            color: #87888c !important;
                        }
                    }
                    .menu-wrap {
                        display: flex;
                        justify-content: space-between;
                        overflow: hidden;
                        .menu-left {
                            cursor: pointer;
                        }
                        .right {
                            margin-right: 10px;
                            font-size: 0;
                            cursor: pointer;
                        }
                    }
                    .loading-wrapper {
                        text-align: center;
                    }
                    
                }
            }
        }
    }
   
    div {
        box-sizing: border-box;
    }
</style>
