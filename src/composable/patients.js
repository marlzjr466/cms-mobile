const headers = [
  {
    column: 'ID',
    key: 'id',
    width: 50
  },
  {
    column: 'Date',
    key: 'created_at',
    format: 'MMM DD, YYYY',
    width: 150
  },
  {
    column: 'Full Name',
    key: ['first_name', 'last_name'],
    avatar: true,
    avatarKey: 'gender'
  },
  {
    column: 'Gender',
    key: 'gender',
    capitalize: true,
    width: 130
  },
  {
    column: 'Birth Date',
    key: 'birth_date',
    format: 'MMM DD, YYYY',
    width: 150
  },
  {
    column: 'Last Visit',
    key: 'records.created_at',
    format: 'MMM DD, YYYY | hh:mm A',
    width: 170
  }
]

export { headers }