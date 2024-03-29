export enum Actions {
  ADD_CUSTOMER_REQUEST = 'ADD_CUSTOMER_REQUEST',
  ADD_CUSTOMER_SUBMITTING = 'ADD_CUSTOMER_SUBMITTING',
  ADD_CUSTOMER_SUCCESSFUL = 'ADD_CUSTOMER_SUCCESSFUL',
  ADD_CUSTOMER_FAILED = 'ADD_CUSTOMER_FAILED',
  ADD_CUSTOMER_VALIDATION_FAILED = 'ADD_CUSTOMER_VALIDATION_FAILED',

  SET_CUSTOMER_FOR_APPOINTMENT = 'SET_CUSTOMER_FOR_APPOINTMENT',

  QUERY_CUSTOMER_REQUEST = 'QUERY_CUSTOMER_REQUEST',
  QUERY_CUSTOMER_SUBMITTING = 'QUERY_CUSTOMER_SUBMITTING',
  QUERY_CUSTOMER_FAILED = 'QUERY_CUSTOMER_FAILED',
  QUERY_CUSTOMER_SUCCESSFUL = 'QUERY_CUSTOMER_SUCCESSFUL',
  SEARCH_CUSTOMERS_SUCCESSFUL = 'SEARCH_CUSTOMERS_SUCCESSFUL',
}

export enum CustomerStatuses {
  SUBMITTING = 'SUBMITTING',
  FAILED = 'FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  SUCCESSFUL = 'SUCCESSFUL',
}
