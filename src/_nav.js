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
      name: 'Reports',
      url: '/report',
      icon: 'fa fa-file-o',
    },
    {
      name: 'Kerno™',
      url: '#',
      icon: 'fa fa-align-justify',
    },
    {
      title: true,
      name: 'Configurations',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Credentials',
      url: '#2',
      icon: 'fa fa-user-circle-o',
      children: [
        {
          name: 'User ID',
          url: '/credential/user',
        },
        {
          name: 'Roles',
          url: '/credential/role',
        },
      ]
    },
    {
      name: 'Privileges',
      url: '#2',
      icon: 'fa fa-key',
    },
    {
      name: 'Workflow',
      url: '#2',
      icon: 'fa fa-map-o',
    },
    {
      name: 'Menu',
      url: '#2',
      icon: 'fa fa-key',
    },
    {
      title: true,
      name: 'Logs',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'User Logs',
      url: '/theme/typography',
      icon: 'icon-pencil',
    },
    {
      name: 'Application Logs',
      url: '/theme/typography',
      icon: 'icon-pencil',
    },
  ],
};
