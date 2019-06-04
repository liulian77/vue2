<template>
    <Breadcrumb>
        <BreadcrumbItem v-for="item in breadCrumbList"
            :to="item.fullPath"
            :key="`bread-crumb-${item.name}`">
            {{ item.meta.title }}
        </BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
import { Breadcrumb,BreadcrumbItem} from 'iview';
const components={
    Breadcrumb,
    BreadcrumbItem
};
export default {
    props: {
        'breadCrumbList': {
            type: Array,
            default: () => []
        }
    },
    components
}
</script>
