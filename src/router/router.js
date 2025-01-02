import { createWebHashHistory, createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Base',
        component: () => import('@/views/BaseView.vue'),
        children: [
            {
                path: '',
                name: 'HomeRedirect',
                redirect: '/home',
                meta: {
                    nav: true,
                    navTransparent: false
                }
            },
            {
                path: 'home',
                name: 'HomeBase',
                component: () => import('@/views/HomeBaseView.vue'),
                children: [
                    {
                        path: '',
                        name: 'Home',
                        component: () => import('@/views/HomeView.vue'),
                        meta: {
                            nav: true,
                            navTransparent: true
                        }
                    },
                    {
                        path: 'type',
                        name: 'PostType',
                        component: () => import('@/views/PostTypeView.vue'),
                        meta: {
                            nav: true,
                            navTransparent: false
                        }
                    },
                    {
                        path: 'composeNormal',
                        name: 'ComposeNormal',
                        component: () => import('@/views/ComposeNormal.vue'),
                        meta: {
                            nav: true,
                            navTransparent: false
                        }
                    },
                    {
                        path: 'composeQuestion',
                        name: 'ComposeQuestion',
                        component: () => import('@/views/ComposeQuestion.vue'),
                        meta: {
                            nav: true,
                            navTransparent: false
                        }
                    },
                    {
                        path: 'composeArticle',
                        name: 'ComposeArticle',
                        component: () => import('@/views/ComposeArticle.vue'),
                        meta: {
                            nav: true,
                            navTransparent: false
                        }
                    },
                    {
                        path: 'post/:id',
                        name: 'Post',
                        component: () => import('@/views/PostView.vue'),
                        meta: {
                            nav: true,
                            navTransparent: true,
                            info: 'la'
                        }
                    },
                ]
            },
            {
                path: 'search',
                name: 'Search',
                component: () => import('@/views/SearchView.vue'),
                meta: {
                    nav: true,
                    navTransparent: false
                }
            },
            {
                path: 'chat',
                name: 'ChatBase',
                component: () => import('@/views/ChatBaseView.vue'),
                children: [
                    {
                        path: '',
                        name: 'ChatList',
                        component: () => import('@/views/ChatListView.vue'),
                        meta: {
                            nav: true,
                            navTransparent: false
                        }
                    },
                    {
                        path: 'contact',
                        name: 'Contact',
                        component: () => import('@/views/ContactView.vue'),
                        meta: {
                            nav: false,
                            navTransparent: false
                        }
                    },
                    {
                        path: ':id',
                        name: 'Chat',
                        // component: () => import('@/views/TestView2.vue'),
                        component: () => import('@/views/ChatView.vue'),
                        meta: {
                            nav: false,
                            navTransparent: false
                        }
                    }
                ]
            },
            {
                path: 'bookmark',
                name: 'Bookmark',
                component: () => import('@/views/BookmarkView.vue'),
                meta: {
                    nav: true,
                    navTransparent: false
                }
            },
            {
                path: 'user',
                name: 'UserBase',
                component: () => import('@/views/UserBaseView.vue'),
                children: [
                    {
                        path: '',
                        name: 'More',
                        component: () => import('@/views/MoreView.vue'),
                        meta: {
                            nav: true,
                            navTransparent: false
                        }
                    },
                    {
                        path: ':id',
                        name: 'User',
                        component: () => import('@/views/UserView.vue'),
                        meta: {
                            nav: false,
                            navTransparent: false
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/views/WelcomeView.vue'),
        meta: {
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: {
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/oauth/:owner',
        name: 'OAuth',
        component: () => import('@/views/OAuth2View.vue'),
        meta: {
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/TestView.vue'),
        meta: {
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/logout',
        name: 'Logout',
        component: () => import('@/views/LogoutView.vue'),
        meta: {
            nav: false,
            navTransparent: false
        }
    },
    {
        path: '/:pathMatch(.*)',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue'),
        meta: {
            nav: false,
            navTransparent: false
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
