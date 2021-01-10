export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
      },
    },
    {
      name: 'User Setting',
      url: '#2',
      icon: 'fa fa-user-circle-o',
      children: [
        {
          name: 'User',
          url: '/usersetting/user',
        },
        {
          name: 'Role',
          url: '/usersetting/role',
        },
        {
          name: 'Department',
          url: '/usersetting/depart',
        },
        {
          name: 'Group',
          url: '/usersetting/group',
        },
        {
          name: 'Branch',
          url: '/usersetting/branch',
        },
      ]
    },
    
    {
      name: 'Reports',
      url: '/report',
      icon: 'fa fa-file-o',
      children: [
        {
          name: 'Report A',
          url: '/report/reportA',
        },
        {
          name: 'Report B',
          url: '/report/reportB',
        },
        {
          name: 'Report C',
          url: '/report/reportC',
        },
        
        
        
      ]
    },
    {
      name: 'Monitoring',
      url: '#',
      icon: 'fa fa-align-justify',
      children:[]
    },
   
    {
      name: 'Workflow',
      url: '#2',
      icon: 'fa fa-key',
      children:[]
    },
    {
      name: 'Audit Trail',
      url: '#2',
      icon: 'fa fa-map-o',
      children:[]
    },
    // {
    //   name: 'Menu',
    //   url: '#2',
    //   icon: 'fa fa-key',
    // },
    // {
    //   title: true,
    //   name: 'Logs',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'User Logs',
    //   url: '/theme/typography',
    //   icon: 'icon-pencil',
    // },
    // {
    //   name: 'Application Logs',
    //   url: '/theme/typography',
    //   icon: 'icon-pencil',
    // },
  ],
};
