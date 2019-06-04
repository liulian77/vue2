<template>
    <div :title="column.name">
        <CellRender v-if="column.render"
            :column="column"
            :rowIndex="rowIndex"
            :cellIndex="cellIndex"
            :row="row"
            :cell="cell"
            :render="column.render"></CellRender>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>
<script>
import CellRender from './cell-render';
import Icon from "_c/icon";
export default {
    name: 'Cell',
    components: {
        CellRender,
        Icon
    },
    props: {
        column: {
            type: Object,
            default() {
                return {};
            }
        },
        row: {
            type: Object,
            default() {
                return {};
            }
        },
        rowIndex: {
            type: Number | String,
        },
        cellIndex: {
            type: Number | String,
        },
        cell: {
            validator: function (value) {
                return true;
            }
        }
    }
}
</script>

