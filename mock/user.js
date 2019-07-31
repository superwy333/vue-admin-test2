const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const menuList = [
  {
    path: '/test',
    hidden: false,
    component: '/layout',
    alwaysShow: true,
    meta: { title: 'test', icon: 'tab' }

  },
  {
    path: '/tab',
    hidden: false,
    alwaysShow: true,
    component: '/layout',
    children: [
      {
        path: 'index',
        component: 'tab',
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: '/layout',
    alwaysShow: true,
    // redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        hidden: false,
        component: '401',
        name: '401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        hidden: false,
        component: '404',
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  }, {
    path: '/excel',
    component: '/layout',
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: '/views/excel/export-excel',
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: '/views/excel/select-excel',
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: '/views/excel/merge-header',
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      }
    ]
  }
]

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // get user menu
  {
    url: '/user/menu\.*',
    type: 'get',
    response: config => {
      // const { token } = config.query
      const info = menuList

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: '获取菜单失败'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  }
]
