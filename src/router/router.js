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
                    nav: true
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
                            nav: true
                        }
                    },
                    {
                        path: 'type',
                        name: 'PostType',
                        component: () => import('@/views/PostTypeView.vue'),
                        meta: {
                            nav: false
                        }
                    },
                    {
                        path: 'composeNormal',
                        name: 'ComposeNormal',
                        component: () => import('@/views/ComposeNormal.vue'),
                        meta: {
                            nav: false
                        }
                    },
                    {
                        path: 'composeQuestion',
                        name: 'ComposeQuestion',
                        component: () => import('@/views/ComposeQuestion.vue'),
                        meta: {
                            nav: false
                        }
                    },
                    {
                        path: 'composeArticle',
                        name: 'ComposeArticle',
                        component: () => import('@/views/ComposeArticle.vue'),
                        meta: {
                            nav: false
                        }
                    },
                    {
                        path: 'post/:id',
                        name: 'Post',
                        component: () => import('@/views/PostView.vue'),
                        meta: {
                            nav: false,
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
                    nav: true
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
                            nav: true
                        }
                    },
                    {
                        path: ':id',
                        name: 'Chat',
                        component: () => import('@/views/ChatView.vue'),
                        meta: {
                            nav: false
                        }
                    }
                ]
            },
            {
                path: 'bookmark',
                name: 'Bookmark',
                component: () => import('@/views/BookmarkView.vue'),
                meta: {
                    nav: true
                }
            },
            {
                path: 'user',
                name: 'UserBase',
                component: () => import('@/views/UserBaseView.vue'),
                children: [
                    {
                        path: '',
                        name: 'Me',
                        component: () => import('@/views/UserView.vue'),
                        meta: {
                            nav: true
                        }
                    },
                    {
                        path: ':id',
                        name: 'User',
                        component: () => import('@/views/UserView.vue'),
                        meta: {
                            nav: false
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
            nav: false
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
            nav: false
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: {
            nav: false
        }
    },
    {
        path: '/oauth/:owner',
        name: 'OAuth',
        component: () => import('@/views/OAuth2View.vue'),
        meta: {
            nav: false
        }
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/TestView.vue'),
        meta: {
            nav: false
        }
    },
    {
        path: '/:pathMatch(.*)',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue'),
        meta: {
            nav: false
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;