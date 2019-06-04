<template>
    <div :class="wrapClasses">
        <div :class="countClasses">
            共<span>{{page.count}}</span>条数据
        </div>
        <div :class="lenClasses">
            <select @change="changeLength"
                v-model="page.length">
                <option v-for="(l,i) in page.lengthMenu"
                    :selected="l==page.length">{{l}}</option>
            </select>
        </div>
        <div :class="pageClasses">
            <Icon type="arrow-left"
                :class="leftClasses"
                v-on:click="prev()" />
            <i v-for="(v,k) in pageList"
                :class="listClasses(v)"
                v-on:click="jumpToPage(v)">
                {{typeof v=='number'?v:'…'}}
            </i>
            <Icon type="arrow-left"
                :class="rightClasses"
                v-on:click="next()" />
        </div>
        <div>
            跳转到
        </div>
        <div :class="jumpClasses">
            <div :class="btnGroupClasses">
                <input type="text"
                    v-model="gotoPage">
                <input type="button"
                    :class="jumpBtnClasses"
                    v-on:click="jumpToPage()"
                    value="确定">
            </div>
        </div>
    </div>
</template>
<script>
import Icon from '_c/icon';
import "_c/table/table.less";
const prefixCls = 's-table-page';
export default {
    name: 'Page',
    components: {
        Icon
    },
    data() {
        return {
            gotoPage: 1,
            targetPage: null,
        }
    },
    props: {
        page: {
            type: Object,
            default() {
                return {};
            }
        },
    },
    computed: {
        wrapClasses() {
            return [
                `${prefixCls}-wrap`
            ]
        },
        countClasses() {
            return [
                `${prefixCls}-count`
            ]
        },
        lenClasses() {
            return [
                `${prefixCls}-len`
            ]
        },
        pageClasses() {
            return [
                `${prefixCls}-list`
            ]
        },
        leftClasses() {
            return [
                `${prefixCls}-btn-left`,
                {
                    [`${prefixCls}-btn-disabled`]: this.page.current == 1 ? true : false
                }
            ]
        },
        rightClasses() {
            return [
                `${prefixCls}-btn-right`,
                `arrow-right`,
                {
                    [`${prefixCls}-btn-disabled`]: this.page.current == this.page.pages ? true : false
                }
            ]
        },
        jumpClasses() {
            return [
                `${prefixCls}-jump`
            ]
        },
        btnGroupClasses() {
            return [
                `${prefixCls}-btn-group`
            ]
        },
        jumpBtnClasses() {
            return [
                `${prefixCls}-btn-jump`
            ]
        },
        pageList() {
            let list = [], p = this.page;
            if (p.pages <= p.showPages) {
                for (let i = 1; i <= p.pages; i++) {
                    list.push(i);
                }
            } else if (p.current < p.showPages - 1) {
                for (let i = 1; i <= p.showPages - 1; i++) {
                    list.push(i);
                }
                list.push('ellipsis');
                list.push(p.pages);
            } else if (p.pages - p.current < p.showPages - 2) {
                list.push(1);
                list.push('ellipsis');
                for (let i = p.showPages - 2; i >= 0; i--) {
                    list.push(p.pages - i);
                }
            } else {
                list.push(1);
                list.push('ellipsis');
                let s = Math.floor((p.showPages - 2) / 2);
                for (let i = 0; i < p.showPages - 2; i++) {
                    list.push(p.current - s + i);
                }
                list.push('ellipsis');
                list.push(p.pages);
            }
            return list;
        }
    },
    methods: {
        listClasses: function (num) {
            return [

                {
                    [`${prefixCls}-list-num`]: typeof num == 'number' ? true : false,
                    [`${prefixCls}-list-ellipsis`]: typeof num != 'number' ? true : false,
                    [`${prefixCls}-list-current`]: this.page.current == num ? true : false
                }
            ]
        },
        jumpToPage(num) {
            let input = false;//是否通过input框修改
            if (typeof num === 'undefined') {
                num = this.gotoPage;
                input = true;
            }
            if (num == 'ellipsis') {
                return;
            }
            if (num <= 1) {
                num = 1;
            }
            if (num > this.page.pages) {
                num = this.page.pages;
            }
            this.targetPage = num;
            if (input) {
                this.gotoPage = num;
            }
            if (this.page.current != num)
                this.$emit('on-change-page', num);
        },
        prev() {
            this.jumpToPage(this.page.current - 1);
        },
        next() {
            this.jumpToPage(this.page.current + 1);
        },
        changeLength() {
            console.log(this.page.length)
            this.$emit('on-change-page-size', this.page.length);
        }
    },
}
</script>


