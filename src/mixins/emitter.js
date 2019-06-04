import { broadcast, dispatch } from '@/utils/assist'

export default {
    methods: {
        dispatch(componentName, eventName, params) {
            dispatch.call(this, componentName, eventName, params)
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params)
        }
    }
}
