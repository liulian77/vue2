export default {
    name: 'TableExpand',
    functional: true,
    props: {
        render: Function,
        column: {
            type: Object,
            default: null
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
            validator: function () {
                return true;
            }
        }
    },
    render: (h, ctx) => {
        const params = {
            rowIndex: ctx.props.rowIndex,
            row: ctx.props.row,
            cellIndex: ctx.props.cellIndex,
            cell: ctx.props.cell,
        };
        if (ctx.props.column) params.column = ctx.props.column;
        return ctx.props.render(h, params);
    }
};