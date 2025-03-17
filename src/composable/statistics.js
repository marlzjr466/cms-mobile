const statisticsList = [
  {
    label: 'Patients',
    colors: ['#73ba77', '#98f79e'],
    value: 500,
    key: 'patientCount',
    icon: {
      type: 'feather',
      name: 'users'
    }
  },
  // {
  //   label: 'In Queue',
  //   colors: ['#73ba77', '#98f79e'],
  //   value: 24,
  //   icon: {
  //     type: 'antdesign',
  //     name: 'barschart'
  //   }
  // },
  {
    label: 'Transactions',
    colors: ['#8b79cd', '#c7baf9'],
    value: 218,
    key: 'txnCount',
    icon: {
      type: 'antdesign',
      name: 'creditcard'
    }
  },
  {
    label: 'Sales',
    colors: ['#d4737d', '#fcb3ba'],
    value: 1234,
    key: 'sales',
    icon: {
      type: 'materialicons',
      name: 'attach-money'
    }
  }
]

export { statisticsList }