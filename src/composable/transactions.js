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
    column: 'Patient',
    key: ['records.patients.first_name', 'records.patients.last_name'],
    avatar: true,
    avatarKey: 'records.patients.gender'
  },
  {
    column: 'Prescription',
    key: 'records.medication',
    no_truncate: true
  },
  {
    column: 'Amount',
    key: 'amount',
    width: 150,
    currency: true
  },
  {
    column: 'Status',
    key: 'status',
    width: 120,
    capitalize: true
  }
]

export { headers }