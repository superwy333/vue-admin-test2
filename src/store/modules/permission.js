import { asyncRoutes, constantRoutes, mapCompoent } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function filterAsyncRoutesFromUserMenuList(userMenuList) {
  //console.log('userMenuList', JSON.parse(JSON.stringify(userMenuList)))
  //console.log(typeof userMenuList)
  let res = JSON.parse(JSON.stringify(userMenuList))
  res.forEach(userMenu => {
    //console.log(userMenu.component)
    userMenu.component = () => import('@/layout')
    //console.log(userMenu.component)
    if (userMenu.children) {
      userMenu.children.forEach(child => {
        let compoentStr = mapCompoent[child.component]
        child.component = compoentStr
      })
    }
  })
  //console.log('res',res)
  return res

}

function mapComponent(component) {
  return () => import('@' + component)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  //console.log('routes', routes)
  //console.log(typeof routes)
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit, rootState }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('no here')) {
        accessedRoutes = asyncRoutes || []
      } else {
        //accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        /**
         * 组装动态路由
         */
        const testRouter = [
          {
            path: '/tab',
            component: () => import('@/layout'),
            children: [
              {
                path: 'index',
                component: () => import('@/views/tab/index'),
                name: 'Tab',
                meta: { title: 'Tab', icon: 'tab' }
              }
            ]
          },

          {
            path: '/error',
            component: () => import('@/layout'),
            alwaysShow: true,
            // redirect: 'noRedirect',
            name: 'ErrorPages',
            meta: {
              title: 'Error Pages',
              icon: '404',
              roles: ['admin']
            },
            children: [
              {
                path: '401',
                hidden: false,
                component: () => import('@/views/error-page/401'),
                name: 'Page401',
                meta: { title: '401', noCache: true }
              },
              {
                path: '404',
                hidden: false,
                component: () => import('@/views/error-page/404'),
                name: 'Page404',
                meta: { title: '404', noCache: true, roles: ['admin111'] }
              }
            ]
          }, {
            path: '/excel',
            component: () => import('@/layout'),
            redirect: '/excel/export-excel',
            name: 'Excel',
            meta: {
              title: 'Excel',
              icon: 'excel'
            },
            children: [
              {
                path: 'export-excel',
                component: () => import('@/views/excel/export-excel'),
                name: 'ExportExcel',
                meta: { title: 'Export Excel' }
              },
              {
                path: 'export-selected-excel',
                component: () => import('@/views/excel/select-excel'),
                name: 'SelectExcel',
                meta: { title: 'Export Selected' }
              },
              {
                path: 'export-merge-header',
                component: () => import('@/views/excel/merge-header'),
                name: 'MergeHeader',
                meta: { title: 'Merge Header' }
              },
              {
                path: 'upload-excel',
                component: () => import('@/views/excel/upload-excel'),
                name: 'UploadExcel',
                meta: { title: 'Upload Excel' }
              }
            ]
          }
        ]
        let userMenuList = rootState.user.userMenuList // 从vuex中获取用户的menuList
        accessedRoutes = filterAsyncRoutesFromUserMenuList(userMenuList)
        //accessedRoutes = testRouter

      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
