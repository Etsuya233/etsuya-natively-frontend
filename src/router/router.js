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
                        component: () => import('@/views/HomeViewV2.vue'),
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
                        component: () => import('@/views/ComposeV2.vue'),
                        meta: {
                            nav: true,
                            navTransparent: false
                        }
                    },
                    {
                        path: 'composeComment',
                        name: 'ComposeComment',
                        component: () => import('@/views/ComposeComment.vue'),
                        meta: {
                            nav: true,
                            navTransparent: false
                        }
                    },
                    {
                        path: 'post/:id',
                        name: 'Post',
                        component: () => import('@/views/PostViewV3.vue'),
                        meta: {
                            nav: true,
                            navTransparent: true,
                            info: 'la'
                        }
                    },
                    {
                        path: 'comment',
                        name: 'Comment',
                        component: () => import('@/views/CommentView.vue'),
                        meta: {
                            nav: true,
                            navTransparent: true,
                        }
                    }
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
                component: () => import('@/views/BookmarkViewV2.vue'),
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
        path: '/test2',
        name: 'Test2',
        component: () => import('@/views/TestView2.vue'),
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
