<template>
    <label :class="wrapClasses">
        <span :class="checkboxClasses">
            <span :class="innerClasses"
                :style="styles"></span>
            <input v-if="group"
                type="checkbox"
                :class="inputClasses"
                :disabled="disabled"
                :value="label"
                v-model="model"
                :name="name"
                @change="change"
                @focus="onFocus"
                @blur="onBlur"
                @click="onClick"
            >
            <input v-else
                type="checkbox"
                :class="inputClasses"
                :disabled="disabled"
                :checked="currentValue"
                :name="name"
                @change="change"
                @focus="onFocus"
                @blur="onBlur">
        </span>
        <slot><span v-if="showSlot">{{label}}</span></slot>
    </label>
</template>
<script>
import { findComponentUpward, oneOf } from '@/utils/assist';
import Emitter from '@/mixins/emitterOrigin';

const prefixCls = 'ivu-checkbox';

export default {
    name: 'Checkbox',
    mixins: [Emitter],
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number, Boolean],
            default: false
        },
        trueValue: {
            type: [String, Number, Boolean],
            default: true
        },
        falseValue: {
            type: [String, Number, Boolean],
            default: false
        },
        label: {
            type: [String, Number, Boolean]
        },
        indeterminate: {
            type: Boolean,
            default: false
        },
        size: {
            validator(value) {
                return oneOf(value, ['small', 'large', 'default']);
            },
            default() {
                return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
            }
        },
        name: {
            type: String
        },
        color: {
            type: String,

        }
    },
    data() {
        return {
            model: [],
            currentValue: this.value,
            group: false,
            showSlot: true,
            parent: findComponentUpward(this, 'CheckboxGroup'),
            focusInner: false
        };
    },
    computed: {
        wrapClasses() {
            return [
                `${prefixCls}-wrapper`,
                {
                    [`${prefixCls}-group-item`]: this.group,
                    [`${prefixCls}-wrapper-checked`]: this.currentValue,
                    [`${prefixCls}-wrapper-disabled`]: this.disabled,
                    [`${prefixCls}-${this.size}`]: !!this.size
                }
            ];
        },
        checkboxClasses() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-checked`]: this.currentValue,
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-indeterminate`]: this.indeterminate
                }
            ];
        },
        innerClasses() {
            return [
                `${prefixCls}-inner`,
                {
                    [`${prefixCls}-focus`]: this.focusInner
                }
            ];
        },
        inputClasses() {
            return `${prefixCls}-input`;
        },
        styles() {
            let styles = {};
            if (typeof this.color === 'string') {
                styles.borderColor = this.color;
                if (this.currentValue) {
                    styles.backgroundColor = this.color;
                } else {
                    styles.backgroundColor = "#fff";
                }
            }
            return styles;
        }

    },
    mounted() {
        this.parent = findComponentUpward(this, 'CheckboxGroup');
        if (this.parent) {
            this.group = true;
        }

        if (this.group) {
            this.parent.updateModel(true);
        } else {
            this.updateModel();
            this.showSlot = this.$slots.default !== undefined;
        }
    },
    methods: {
        change(event) {
            if (this.disabled) {
                return false;
            }

            const checked = event.target.checked;
            this.currentValue = checked;

            const value = checked ? this.trueValue : this.falseValue;
            this.$emit('input', value);

            if (this.group) {
                this.parent.change(this.model);
            } else {
                this.$emit('on-change', value);
                this.dispatch('FormItem', 'on-form-change', value);
            }
        },
        updateModel() {
            this.currentValue = this.value === this.trueValue;
        },
        onBlur() {
            this.focusInner = false;
        },
        onFocus() {
            this.focusInner = true;
        },
        onClick(value){
            const checked = event.target.checked;
            if(!checked){
                return false;
            }
            this.$emit('on-click', value);
        }
    },
    watch: {
        value(val) {
            if (val === this.trueValue || val === this.falseValue) {
                this.updateModel();
            } else {
                throw 'Value should be trueValue or falseValue.';
            }
        }
    }
};
</script>
<style scoped lang="less">
    .ivu-checkbox-group-item{
        margin-right: 22px;
        .ivu-checkbox{
            margin-right: 9px;
            outline: 0;
        }
        .ivu-checkbox-inner{
            outline: 0;
        }
        .ivu-checkbox-focus{
            box-shadow: none;
        }
    }
</style>
