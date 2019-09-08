import Vue from 'vue';
import store from '@/store';
import Router from 'vue-router';
import PageHome from '@/pages/PageHome';
import PageThreadShow from '@/pages/PageThreadShow';
import PageNotFound from '@/pages/PageNotFound';
import PageForum from '@/pages/PageForum';
import PageProfile from '@/pages/PageProfile';
import PageCategory from '@/pages/PageCategory';
import PageThreadCreate from '@/pages/PageThreadCreate';
import PageThreadEdit from '@/pages/PageThreadEdit';
import PageRegister from '@/pages/PageRegister';
import PageSignIn from '@/pages/PageSignIn';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'PageHome',
      component: PageHome
    },
    {
      path: '/register',
      name: 'PageRegister',
      component: PageRegister,
      meta: { requiresGuest: true }
    },
    {
      path: '/signin',
      name: 'PageSignIn',
      component: PageSignIn,
      meta: { requiresGuest: true }
    },
    {
      path: '/logout',
      name: 'PageSignOut',
      meta: { requiresAuth: true },
      beforeEnter(to, from, next) {
        store.dispatch('signOut')
          .then(() => next('/'))
      }
    },
    {
      path: '/category/:id',
      name: 'PageCategory',
      component: PageCategory,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'PageForum',
      component: PageForum,
      props: true
    },
    {
      path: '/thread/create/:forumId',
      name: 'PageThreadCreate',
      component: PageThreadCreate,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/thread/:id',
      name: 'PageThreadShow',
      component: PageThreadShow,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'PageThreadEdit',
      component: PageThreadEdit,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/me',
      name: 'PageProfile',
      component: PageProfile,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/me/edit',
      name: 'PageProfileEdit',
      component: PageProfile,
      props: { edit: true },
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      name: 'NotFound',
      component: PageNotFound,
    },
  ],
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  console.log(`Navigating to ${to.name} from ${from.name}`);
  store.dispatch('auth/initAuthentication')
    .then(user => {
      if (to.matched.some(route => route.meta.requiresAuth)) {
        if (user) {
          next();
        } else {
          next({ name: 'PageSignIn', query: { redirectTo: to.path } });
        }
      }
      else if (to.matched.some(route => route.meta.requiresGuest)) {
        if (!user) {
          next();
        } else {
          next("/");
        }
      } else {
        next()
      }
    })
})

export default router
