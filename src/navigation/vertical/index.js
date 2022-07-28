export default [
  {
    title: 'Dashboard',
    route: 'home-admin',
    icon: 'HomeIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    admin:true,
  },
  {
    title: 'Dashboard',
    route: 'home',
    icon: 'HomeIcon',
    admin:false,
  },


  {
    header: 'SALES',
    admin:false,

  },
  {
    title: 'Upload Invoice',
    route: 'upload-invoice',
    icon: 'UploadIcon',
    admin:false,
  },
  {
    title: 'My Invoices',
    icon: 'FileTextIcon',
    route: 'invoices-list',

    admin:false,
  },

  {
    header: 'PURCHASES',
    admin:false,
  },
  {
    title: 'Upload Bill',
    route: 'upload-bill',
    icon: 'UploadIcon',
    admin:false,
  },
  {
    title: 'My Bills',
    route: 'bills-list',
    icon: 'FileTextIcon',
    admin:false,
  },
  {
    title: 'Petty Cash',
    icon: 'FileTextIcon',
    admin:false,
    children:[
      {
        title: 'Transactions',
        route:'transactions'
      },
      {
        title: 'Top up',
        route:'top-up'
      },
      {
        title: 'Settlments',
        route:'settlements-list'
      },
    ]
  },


  {
    header: 'PAYROLL',
 
    admin:false,
  },
  {
    title: 'Payroll',
    icon: 'DollarSignIcon',
    route:'payroll',
    admin:false,

  },

  {
    header: 'FORMS',
    admin:false,
  },
  {
    title: 'Budget List',
    route: 'budget-list',
    icon: 'UploadIcon',
    admin:false,
  },
  {
    title: 'Petty Cash',
    route: 'petty-cash',
    icon: 'FileTextIcon',
    admin:false,
  },
  {
    title: 'PO Form',
    route: 'PO',
    icon: 'FileTextIcon',
    admin:false,
  },
  {
    title: 'PR Form',
    route: 'PR',
    icon: 'FileTextIcon',
    admin:false,
  },
  {
    title: 'Stock Receipt',
    route: 'stock-receipt',
    icon: 'FileTextIcon',
    admin:false,
  },
  {
    title: 'Stock Release',
    route: 'stock-release',
    icon: 'FileTextIcon',
    admin:false,
  },
  {
    title: 'Stock Transfer',
    route: 'stock-transfer',
    icon: 'FileTextIcon',
    admin:false,
  },

  {
    header: 'App',
    admin:true,
  },

  {
    title: 'Users',
    icon: 'UsersIcon',
    route: 'user-admin-list',
    admin:true,
  },
  {
    title: 'Clients',
    icon: 'UsersIcon',
    route: 'clients-admin-list',
    admin:true,
  },
  {
    header: 'Data Management',
    admin:false,
  },

  {
    title: 'Employees',
    icon: 'UserIcon',
    route: 'employees-list',
    admin:false,
  },
  {
    title: 'Suppliers',
    icon: 'UserIcon',
    route: 'suppliers-list',
    admin:false,
  },
  {
    title: 'Customers',
    icon: 'UserIcon',
    route: 'customers',
    admin:false,
  },
  {
    title: 'Payees',
    icon: 'UserIcon',
    route: 'payees-list',
    admin:false,
  },
  {
    title: 'Branches',
    icon: 'UserIcon',
    route: 'branches-list',
    admin:false,
  },

  {
    title: 'Cost Center',
    icon: 'UserIcon',
    route: 'costcenter-list',
    admin:false,
  },
  {
    header: 'Business Settings',
    icon: 'UserIcon',
    admin:true,
  },

      {
        title: 'Business Types',
        route: 'business-types',
        icon: 'DribbbleIcon',
        admin:true,
      },
      {
        title: 'Categories Types',
        route: 'business-categories',
        icon: 'DribbbleIcon',
        admin:true,
      },
      {
        title: 'Designations',
        route: 'business-designations',
        icon: 'DribbbleIcon',
        admin:true,
      },
     
  {
    header: 'Settings',
    admin:true,
  },

  {
    title: 'Money Sources',
    route: 'money-sources',
    icon: 'DollarSignIcon',
    admin:true,
  },
      {
        title: 'Upload Types',
        route: 'uploadtypes-list',
        icon: 'LayersIcon',
        admin:true,
      },
      {
        title: 'Bills Types',
        route: 'billtypes-list',
        icon: 'LayersIcon',
        admin:true,
      },
      {
        title: 'Expenses Types',
        route: 'expensetype-list',
        icon: 'LayersIcon',
        admin:true,
      },
      {
        title: 'Employment Types',
        route: 'employment-types',
        icon: 'LayersIcon',
        admin:true,
      },
      {
        title: 'Revenue Types',
        route: 'revenue-types',
        icon: 'LayersIcon',
        admin:true,
      },
    

]
