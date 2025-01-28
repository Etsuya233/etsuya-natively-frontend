import { createWebHashHistory, createRouter, createWebHistory } from 'vue-router';
import {usePageStore} from "@/stores/pageStore.js";

const routes = [
    {
        path: '/',
        name: 'Base',
        component: () => import('@/views/BaseView.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/tab/home/HomeView.vue'),
                meta: {
                    component: 'HomeView',
                    nav: true,
                    navTransparent: true,
                    keepAlive: true,
                    keepAliveKey: 'home',
                    tab: 'Home'
                }
            },
            {
                path: 'type',
                name: 'PostType',
                component: () => import('@/views/tab/home/PostTypeView.vue'),
                meta: {
                    component: 'PostTypeView',
                    nav: true,
                    navTransparent: false,
                    keepAlive: false,
                    tab: 'Home',
                    keepAliveParent: true
                }
            },
            {
                path: 'composeNormal',
                name: 'ComposeNormal',
                component: () => import('@/views/tab/home/ComposeView.vue'),
                meta: {
                    component: 'ComposeView',
                    nav: true,
                    navTransparent: false,
                    keepAlive: false,
                    tab: 'Home',
                    keepAliveParent: true
                }
            },
            {
                path: 'composeComment',
                name: 'ComposeComment',
                component: () => import('@/views/tab/home/ComposeComment.vue'),
                meta: {
                    component: 'ComposeComment',
                    nav: true,
                    navTransparent: false,
                    keepAlive: false,
                    tab: 'Home',
                    keepAliveParent: true
                }
            },
            {
                path: 'post/:id',
                name: 'Post',
                component: () => import('@/views/tab/home/PostView.vue'),
                meta: {
                    component: 'PostView',
                    nav: true,
                    navTransparent: true,
                    keepAlive: false,
                    tab: 'Home'
                }
            },
            {
                path: 'search',
                name: 'Search',
                component: () => import('@/views/tab/search/SearchView.vue'),
                meta: {
                    component: 'SearchView',
                    nav: true,
                    navTransparent: false,
                    tab: 'Search',
                    keepAlive: false,
                }
            },
            {
                path: 'chat',
                name: 'ChatList',
                component: () => import('@/views/tab/chat/ChatListView.vue'),
                meta: {
                    component: 'ChatListView',
                    nav: true,
                    navTransparent: false,
                    keepAlive: true,
                    tab: 'Chat'
                }
            },
            {
                path: 'contact',
                name: 'Contact',
                component: () => import('@/views/tab/chat/ContactView.vue'),
                meta: {
                    component: 'ContactView',
                    nav: false,
                    navTransparent: false,
                    tab: 'Chat',
                    keepAlive: true
                }
            },
            {
                path: ':id',
                name: 'Chat',
                component: () => import('@/views/tab/chat/ChatView.vue'),
                meta: {
                    component: 'ChatView',
                    nav: false,
                    navTransparent: false,
                    keepAliveParent: 'ChatList',
                    keepAlive: true,
                    tab: 'Chat'
                }
            },
            {
                path: 'bookmark',
                name: 'Bookmark',
                component: () => import('@/views/tab/bookmark/BookmarkView.vue'),
                meta: {
                    component: 'BookmarkView',
                    nav: true,
                    navTransparent: false,
                    keepAlive: false,
                    tab: 'Bookmark'
                }
            },
            {
                path: 'more',
                name: 'More',
                component: () => import('@/views/tab/more/MoreView.vue'),
                meta: {
                    component: 'MoreView',
                    nav: true,
                    navTransparent: false,
                    tab: 'More'
                }
            },
            {
                path: ':id',
                name: 'User',
                component: () => import('@/views/tab/more/UserView.vue'),
                meta: {
                    component: 'UserView',
                    nav: false,
                    navTransparent: false,
                    keepAliveParent: true,
                    tab: 'More'
                }
            }
        ]
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/views/WelcomeView.vue'),
        meta: {
            component: 'WelcomeView',
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
            component: 'LoginView',
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: {
            component: 'RegisterView',
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/oauth/:owner',
        name: 'OAuth',
        component: () => import('@/views/OAuth2View.vue'),
        meta: {
            component: 'OAuth2View',
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/TestView.vue'),
        meta: {
            component: 'TestView',
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/test2',
        name: 'Test2',
        component: () => import('@/views/TestView2.vue'),
        meta: {
            component: 'TestView2',
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/logout',
        name: 'Logout',
        component: () => import('@/views/LogoutView.vue'),
        meta: {
            component: 'LogoutView',
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/:pathMatch(.*)',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue'),
        meta: {
            component: 'NotFoundView',
            nav: false,
            navTransparent: false
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const pageStore = usePageStore();

    if(!to?.meta.keepAliveParent && from && !from?.meta.keepAlive){
        const componentName = from?.meta.component;
        if(componentName){
            console.log('Remove keep alive: ', componentName);
            pageStore.removeComponent(componentName);
        }
    }

    if(to?.meta.keepAliveParent){
        const parentComponentName = from?.meta.component;
        if(parentComponentName){
            console.log('Keep alive parent: ', parentComponentName);
            pageStore.addComponent(parentComponentName);
        }
    }

    if(to?.meta.keepAlive){
        const componentName = to?.meta.component;
        if(componentName){
            console.log('Keep alive: ', componentName);
            pageStore.addComponent(componentName);
        }
    }

    next();
});

// router.afterEach((to, from) => {
//     const pageStore = usePageStore();
//     if(from && !from?.meta.keepAlive){
//         const componentName = from?.meta.component;
//         if(componentName){
//             console.log('Remove keep alive: ', componentName);
//             pageStore.removeComponent(componentName);
//         }
//     }
// })

export default router;