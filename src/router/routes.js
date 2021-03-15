/* Layout */
import Layout from '@/layout'
// 常量路由
export const constantRoutes = [
  // 登录的路由对象
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 404 的路由对象
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // Layout 路由对象
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

// 异步路由
export const asyncRoutes = [
  /* 权限管理 */
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
  // 商品管理路由
  {
    name: 'Product', // 为了后期的路由权限
    path: '/product',
    redirect: 'product/category/list',
    component: Layout,
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    children: [
      // 分类管理
      {
        name: 'Category',
        path: 'category/list',
        component: () => import('@/views/product/category/list'),
        meta: { title: '分类管理' }
      },
      // 品牌管理
      {
        name: 'Trademark',
        path: 'trademark/list',
        component: () => import('@/views/product/trademark/list'),
        meta: { title: '品牌管理' }
      },
      // 平台属性管理
      {
        name: 'Attr',
        path: 'attr/list',
        component: () => import('@/views/product/attr/list'),
        meta: { title: '平台属性管理' }
      },
      // SPU管理
      {
        name: 'Spu',
        path: 'spu/list',
        component: () => import('@/views/product/spu/list'),
        meta: { title: 'SPU管理' }
      },
      // SKU管理
      {
        name: 'Sku',
        path: 'sku/list',
        component: () => import('@/views/product/sku/list'),
        meta: { title: 'SKU管理' }
      },

    ]
  },

  // Test的路由
  {
    name: 'Test', // 为了后期的路由权限
    path: '/test',
    redirect: 'test/test1/list',
    component: Layout,
    meta: { title: '测试', icon: 'el-icon-edit' },
    children: [
      // 分类管理
      {
        name: 'Test1',
        path: 'test1/list',
        component: () => import('@/views/test/test1/list'),
        meta: { title: '测试1' }
      },
      // 品牌管理
      {
        name: 'Test2',
        path: 'test2/list',
        component: () => import('@/views/test/test2/list'),
        meta: { title: '测试2' }
      },
    ]
  }

]
// 任意路由
export const anyRoutes = { path: '*', redirect: '/404', hidden: true }

