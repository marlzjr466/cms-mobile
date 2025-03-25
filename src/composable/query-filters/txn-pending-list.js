export default {
  filters: [
    {
      field: 'deleted_at',
      value: 'null'
    },
    {
      field: 'status',
      value: 'pending'
    }
  ],
  columns: ['id', 'record_id', 'consultation_price', 'status'],
  aggregate: [
    {
      table: 'records',
      filters: [
        {
          field: 'id',
          key: 'record_id'
        }
      ],
      is_first: true,
      columns: ['medication', 'patient_id', 'doctor_id'],
      aggregate: [
        {
          table: 'patients',
          filters: [
            {
              field: 'id',
              key: 'patient_id'
            }
          ],
          is_first: true,
          columns: ['first_name', 'last_name', 'gender', 'birth_date'],
        },
        {
          table: 'doctors',
          filters: [
            {
              field: 'id',
              key: 'doctor_id'
            }
          ],
          is_first: true,
          columns: ['first_name', 'last_name'],
        }
      ]
    }
  ],
  is_count: true
}