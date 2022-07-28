import Vue from 'vue'
import VueRouter from 'vue-router'
import { canNavigate } from '@/libs/acl/routeProtection'
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'
import useJwt from '@/auth/jwt/useJwt'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/verify/already-success',
      name: 'verify',
      component: () => import('@/views/verify.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },

    },
    {
      path: '/not-verified',
      name: 'not-verified',
      component: () => import('@/views/re-verify.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },

    },
    {
      path: '/under-review',
      name: 'under-review',
      component: () => import('@/views/underReview.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },

    },
    {
      path: '/forget',
      name: 'forget-password',
      component: () => import('@/views/forgetPassword.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },

    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/resetPassword.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },

    },
    {
      path: '/verify/success',
      name: 'verify',
      component: () => import('@/views/verify.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },

    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('@/views/welcome.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },

    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        admin:false,
      }
    },
    
    {
      path: '/NotAuthorized',
      name: 'NotAuthorized',
      component: () => import('@/views/NotAuthorized.vue'),
      meta: {
        layout: 'full',
        pageTitle: 'You are Not Authorized',
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        pageTitle: 'Second Page',
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/adminLogin',
      name: 'adminLogin',
      component: () => import('@/views/adminLogin.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/Login.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/upload-bill',
      name: 'upload-bill',
      component: () => import('@/views/bills/upload.vue'),
      meta: {
        pageTitle: 'Upload New Bill',
        breadcrumb: [
          {
            text: 'Upload Bill',
            active: false,
          },
          {
            text: 'New',
            active: true,
          },
        ],
      },
    },
    {
      path: '/upload-invoice',
      name: 'upload-invoice',
      component: () => import('@/views/invoices/upload.vue'),
      meta: {
        pageTitle: 'Upload New invoice',
        breadcrumb: [
          {
            text: 'Upload invoice',
            active: false,
          },
          {
            text: 'New',
            active: true,
          },
        ],
      },
    },
    {
      path: '/upload-settlement',
      name: 'upload-settlement',
      component: () => import('@/views/petty-cash/settlement/upload.vue'),
      meta: {
        pageTitle: 'Upload New settlement',
        breadcrumb: [
          {
            text: 'Upload settlement',
            active: false,
          },
          {
            text: 'New',
            active: true,
          },
        ],
      },
    },

   
    {
      path: '/profile/',
      name: 'user-profile',
      component: () => import('@/views/profile/user-edit.vue'),
      meta: {
        pageTitle: 'My Profile',
        breadcrumb: [
          {
            text: 'My Profile',
            active: false,
          },
          {
            text: 'edit',
            active: true,
          },
        ],
      },
    },
    
    {
      path: '/employees/list',
      name: 'employees-list',
      component: () => import('@/views/employees/employees-list/EmpList.vue'),
      meta: {
        pageTitle: 'Employees List',
        breadcrumb: [
          {
            text: 'Employees',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/suppliers/list',
      name: 'suppliers-list',
      component: () => import('@/views/suppliers/suppliers-list/SupList.vue'),
      meta: {
        pageTitle: 'Suppliers List',
        breadcrumb: [
          {
            text: 'Suppliers',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/payees/list',
      name: 'payees-list',
      component: () => import('@/views/pyees/pyees-list/PyeeList.vue'),
      meta: {
        pageTitle: 'Payees List',
        breadcrumb: [
          {
            text: 'Payees',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
 
    {
      path: '/admin/bills/view/:id',
      name: 'bill-admin-view',
      component: () => import('@/views/admin/bills/view.vue'),
      meta: {
        pageTitle: 'View Bill',
        breadcrumb: [
          {
            text: 'Bill',
            active: false,
          },
          {
            text: 'View',
            active: true,
          },
        ],
      },
    },
    
    {
      path: '/bills/list',
      name: 'bills-list',
      component: () => import('@/views/bills/List.vue'),
      meta: {
        pageTitle: 'My Bills',
        breadcrumb: [
          {
            text: 'My Bills',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    
    {
      path: '/bills/view/:id',
      name: 'bill-view',
      component: () => import('@/views/bills/view.vue'),
      meta: {
        pageTitle: 'View Bill',
        breadcrumb: [
          {
            text: 'Bills',
            to:'/bills/list',
            active: false,
          },
          {
            text: 'View',
            active: true,
          },
        ],
      },
    },
    {
      path: '/bills/edit/:id',
      name: 'bill-edit',
      component: () => import('@/views/bills/edit.vue'),
      meta: {
        pageTitle: 'Edit Bill',
        breadcrumb: [
          {
            text: 'Bills',
            active: false,
            to:'/bills/list',
          },
          {
            text: 'Edit',
            active: true,
          },
        ],
      },
    },
    {
      path: '/invoices/list',
      name: 'invoices-list',
      component: () => import('@/views/invoices/List.vue'),
      meta: {
        pageTitle: 'My Invoices',
        breadcrumb: [
          {
            text: 'My invoices',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    
    {
      path: '/invoices/view/:id',
      name: 'invoices-view',
      component: () => import('@/views/invoices/view.vue'),
      meta: {
        pageTitle: 'View invoice',
        breadcrumb: [
          {
            text: 'invoices',
            to:'/invoices/list',
            active: false,
          },
          {
            text: 'View',
            active: true,
          },
        ],
      },
    },
    {
      path: '/invoices/edit/:id',
      name: 'invoices-edit',
      component: () => import('@/views/invoices/edit.vue'),
      meta: {
        pageTitle: 'Edit invoice',
        breadcrumb: [
          {
            text: 'invoices',
            to:'/invoices/list',
            active: false,
          },
          {
            text: 'Edit',
            active: true,
          },
        ],
      },
    },

    {
      path: '/settlements/list',
      name: 'settlements-list',
      component: () => import('@/views/petty-cash/settlement/List.vue'),
      meta: {
        pageTitle: 'My Settlements',
        breadcrumb: [
          {
            text: 'My settlements',
            active: true,
          },
  
        ],
      },
    },
    
    {
      path: '/settlement/view/:id',
      name: 'settlement-view',
      component: () => import('@/views/petty-cash/settlement/view.vue'),
      meta: {
        pageTitle: 'View settlement',
        breadcrumb: [
          {
            text: 'settlements',
            to:'/settlements/list',
            active: false,
          },
          {
            text: 'View',
            active: true,
          },
        ],
      },
    },
    {
      path: '/settlement/edit/:id',
      name: 'settlement-edit',
      component: () => import('@/views/petty-cash/settlement/edit.vue'),
      meta: {
        pageTitle: 'Edit settlement',
        breadcrumb: [
          {
            text: 'settlements',
            to:'/settlements/list',
            active: false,
          },
          {
            text: 'Edit',
            active: true,
          },
        ],
      },
    },

    {
      path: '/payroll/list',
      name: 'payroll',
      component: () => import('@/views/payroll/list/List.vue'),
      meta: {
        pageTitle: 'Payroll',
        breadcrumb: [
          {
            text: 'Payroll',
         
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/petty-cash/top-up/list',
      name: 'top-up',
      component: () => import('@/views/petty-cash/top-up/List.vue'),
      meta: {
        pageTitle: 'TopUp',
        breadcrumb: [
          {
            text: 'TopUp',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/petty-cash/transactions',
      name: 'transactions',
      component: () => import('@/views/petty-cash/transactions.vue'),
      meta: {
        pageTitle: 'Petty Cash Transactions',
        breadcrumb: [
          {
            text: 'Transactions',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/payroll/edit/:id',
      name: 'payroll-edit',
      component: () => import('@/views/payroll/list/Edit.vue'),
      meta: {
        pageTitle: 'Edit Payroll',
        breadcrumb: [
          {
            text: 'Payroll',
            to:'/payroll/list',
            active: false,
          },
          {
            text: 'edit',
            active: true,
          },
        ],
      },
    },
    
    {
      path: '/customers/list',
      name: 'customers',
      component: () => import('@/views/customers/List.vue'),
      meta: {
        pageTitle: 'Customers',
        breadcrumb: [
          {
            text: 'Customers',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
   
    {
      path: '/costcenter/list',
      name: 'costcenter-list',
      component: () => import('@/views/costcenter/list/List.vue'),
      meta: {
        pageTitle: 'Cost Centers',
        breadcrumb: [
          {
            text: 'Types',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/branches/list',
      name: 'branches-list',
      component: () => import('@/views/branches/list/List.vue'),
      meta: {
        pageTitle: 'Branches',
        breadcrumb: [
          {
            text: 'Branches',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },

    {
      path: '/form/budget-form',
      name: 'budget-list',
      component: () => import('@/views/form/budget-form/EmpList.vue'),
      meta: {
        pageTitle: 'Budget From',
        breadcrumb: [
          {
            text: 'Budget',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },
    
    {
      path: '/form/petty-cash',
      name: 'petty-cash',
      component: () => import('@/views/form/petty-cash/EmpList.vue'),
      meta: {
        pageTitle: 'Petty Cash',
        breadcrumb: [
          {
            text: 'Petty',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },

    {
      path: '/form/po',
      name: 'PO',
      component: () => import('@/views/form/po/EmpList.vue'),
      meta: {
        pageTitle: 'PO Form',
        breadcrumb: [
          {
            text: 'PO',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },

    {
      path: '/form/pr',
      name: 'PR',
      component: () => import('@/views/form/pr/EmpList.vue'),
      meta: {
        pageTitle: 'PR Form',
        breadcrumb: [
          {
            text: 'PR',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },

    {
      path: '/form/stock-receipt',
      name: 'stock-receipt',
      component: () => import('@/views/form/stock-receipt-form/EmpList.vue'),
      meta: {
        pageTitle: 'Stock Receipt Form',
        breadcrumb: [
          {
            text: 'Stock Receipt',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },

    {
      path: '/form/stock-release',
      name: 'stock-release',
      component: () => import('@/views/form/stock-release-form/EmpList.vue'),
      meta: {
        pageTitle: 'Stock Release Form',
        breadcrumb: [
          {
            text: 'Stock Release',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },

    {
      path: '/form/stock-transfer',
      name: 'stock-transfer',
      component: () => import('@/views/form/stock-transfer-form/EmpList.vue'),
      meta: {
        pageTitle: 'Stock Transfer Form',
        breadcrumb: [
          {
            text: 'Stock Transfer',
            active: false,
          },
          {
            text: 'List',
            active: true,
          },
        ],
      },
    },

    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})
router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

if(to.path != '/adminLogin') {


  if (!isLoggedIn && !to.meta.redirectIfLoggedIn) return next({ name: 'login' })

  const userData = getUserData()
  if(userData != null){

    if (isLoggedIn && !to.meta.redirectIfLoggedIn && !userData.email_verified_at) return next({ name: 'not-verified' })
  
    if (isLoggedIn && !to.meta.redirectIfLoggedIn){
      if(userData.status == 0 && userData.role != "admin" && isLoggedIn){
        return next({ name: 'welcome' })
      }
      if(userData.status ==3 && userData.role != "admin" && isLoggedIn){
        return next({ name: 'under-review' })
      }
    } 
 
  }
  

 
  // Redirect if logged in
  


  if (to.meta.redirectIfLoggedIn && isLoggedIn && userData.email_verified_at && userData.status != 0 && userData.status != 3 && userData.role != "admin" ) {
    next('/')
  }
}
  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
