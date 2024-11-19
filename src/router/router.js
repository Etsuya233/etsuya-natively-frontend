import {createWebHashHistory, createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Base',
        component: () => import('@/views/BaseView.vue'),
        children: [
            {
                path: '',
                name: 'HomeRedirect',
                redirect: '/home'
            },
            {
                path: 'home',
                name: 'HomeBase',
                component: () => import('@/views/HomeBaseView.vue'),
                children: [
                    {
                        path: '',
                        name: 'Home',
                        component: () => import('@/views/HomeView.vue')
                    },
                    {
                        path: 'compose',
                        name: 'Compose',
                        component: () => import('@/views/ComposeView.vue')
                    },
                    {
                        path: 'post/:id',
                        name: 'Post',
                        component: () => import('@/views/PostView.vue')
                    },
                ]
            },
            {
                path: 'search',
                name: 'Search',
                component: () => import('@/views/SearchView.vue')
            },
            {
                path: 'chat',
                name: 'Chat',
                component: () => import('@/views/ChatView.vue')
            },
            {
                path: 'bookmark',
                name: 'Bookmark',
                component: () => import('@/views/BookmarkView.vue')
            },
            {
                path: 'user',
                name: 'UserBase',
                component: () => import('@/views/UserBaseView.vue'),
                children: [
                    {
                        path: '',
                        name: 'Me',
                        component: () => import('@/views/UserView.vue')
                    },
                    {
                        path: ':id',
                        name: 'User',
                        component: () => import('@/views/UserView.vue')
                    }
                ]
            }
        ]
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/views/WelcomeView.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue')
    },
    {
        path: '/oauth/:owner',
        name: 'OAuth',
        component: () => import('@/views/OAuth2View.vue')
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/TestView.vue')
    },
    {
        path: '/:pathMatch(.*)',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;