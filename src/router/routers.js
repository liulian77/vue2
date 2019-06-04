const Main = () => import(/* webpackChunkName: "main" */ '@/components/main');

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () =>
            //import ('@/view/login/login.vue')
            import(/* webpackChunkName: "login" */ '@/view/login/login.vue')
    },{
        path: '/register',
        name: 'register',
        meta: {
            title: 'Login - 注册',
            hideInMenu: true
        },
        component: () =>
            //import ('@/view/login/login.vue')
            import(/* webpackChunkName: "login" */ '@/view/register/register.vue')
    },
    {
        path: '/',
        name: '_home',
        redirect: '/index',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [
            {
                path: '/agentIndex',
                name: 'agentIndex',
                meta: {
                    hideInMenu: true,
                    title: '概述',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "user" */ '@/view/page/agentIndex')
            },
            {
                path: '/index',
                name: 'index',
                meta: {
                    hideInMenu: true,
                    title: '概述',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "user" */ '@/view/page/Index')
            },
            {
                path: '/userInfo',
                name: 'userInfo',
                meta: {
                    hideInMenu: true,
                    title: '账户设置',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "user" */ '@/view/page/userInfo')
            },
            {
                path: '/userPass',
                name: 'userPass',
                meta: {
                    hideInMenu: true,
                    title: '修改密码',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "user" */ '@/view/page/userPass')
            },
            {
                path: '/baseInfo',
                name: 'baseInfo',
                meta: {
                    hideInMenu: true,
                    title: '基本信息',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "user" */ '@/view/page/baseInfo')
            },
            {
                path: '/appInfo',
                name: 'appInfo',
                meta: {
                    hideInMenu: true,
                    title: 'App信息',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "user" */ '@/view/page/appInfo')
            },
            {
                path: '/financialInfo',
                name: 'financialInfo',
                meta: {
                    hideInMenu: true,
                    title: '用户余额',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "user" */ '@/view/page/financialInfo')
            },
            {
                path: '/statistics',
                name: 'statistics',
                meta: {
                    hideInMenu: true,
                    title: '统计',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "user" */ '@/view/page/statistics')
            },
            {
                path: '/notification',
                name: 'notification',
                meta: {
                    hideInMenu: true,
                    title: '通知设置',
                    icon: 'md-ui'
                },
                component: () =>
                    import(/* webpackChunkName: "notification" */ '@/view/page/notification')
            },
            {
                path: '/ui',
                name: 'ui',
                meta: {
                    hideInMenu: true,
                    title: 'UI规范',
                    icon: 'md-ui'
                },
                component: () =>
                    //import ('@/view/page/ui')
                    import(/* webpackChunkName: "ui" */ '@/view/page/ui')
            }
        ]
    }
]
