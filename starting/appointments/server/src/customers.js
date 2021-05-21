import { name, phone } from 'faker';

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

function generateFakeCustomer(id) {
  return {
    id,
    firstName: name.firstName(),
    lastName: name.lastName(),
    phoneNumber: phone.phoneNumberFormat(1)
  }
}

export function generateFakeCustomers() {
  const customers = [];
  for(let i = 0; i < 1500; ++i) {
    customers.push(generateFakeCustomer(i));
  }
  return customers;
}

export class Customers {
  constructor(initialCustomers = []) {
    this.customers = {};
    this.nextId = 0;
    this.add = this.add.bind(this);
    this.all = this.all.bind(this);
    this.isValid = this.isValid.bind(this);

    initialCustomers.forEach(this.add);
  }

  add(customer) {
    const customerWithId = Object.assign({}, customer, { id: this.nextId++ });
    this.customers[customerWithId.id] = customerWithId;
    return customerWithId;
  }

  all() {
    return Object.assign({}, this.customers);
  }

  isValid(customer) {
    return Object.keys(this.errors(customer)).length === 0;
  }

  errors(customer) {
    let errors = {};
    errors = Object.assign(errors, this.requiredValidation(customer, 'firstName', 'First name'));
    errors = Object.assign(errors, this.requiredValidation(customer, 'lastName', 'Last name'));
    errors = Object.assign(errors, this.requiredValidation(customer, 'phoneNumber', 'Phone number'));
    errors = Object.assign(errors, this.uniqueValidation('phoneNumber', customer.phoneNumber, 'Phone number'));
    return errors;
  }

  requiredValidation(customer, field, fieldDescription) {
    if (!customer[field] || customer[field].trim() === '') {
      return { [field]: fieldDescription + ' is required' };
    }
    return {};
  }

  uniqueValidation(field, fieldValue, fieldDescription) {
    if (Object.entries(this.customers).map(([_, c])=> c[field]).includes(fieldValue)) {
      return { [field]: fieldDescription + ' already exists in the system' };
    }
    return {};
  }

  customerMatched(customer, searchParams) {
    const customerMatchedByParam = searchParams.map(searchParam => {
      const startsWith = new RegExp(`^${searchParam}`, 'i');
      return startsWith.test(customer.firstName)
        || startsWith.test(customer.lastName)
        || startsWith.test(customer.phoneNumber);
    })
    return customerMatchedByParam.some(matched => matched === true);
  }

  search({ searchTerms, limit, orderBy, orderDirection, after }) {
    limit = limit || 10;
    orderBy = orderBy || 'firstName';
    searchTerms = searchTerms || [''];

    let foundCustomers = Object.values(this.customers)
      .filter(customer => this.customerMatched(customer, searchTerms))
      .unique();

    if (!foundCustomers.length) {
      return [];
    }

    const sorted = foundCustomers
      .map(({id}) => this.customers[id])
      .sort((l, r) => orderDirection === 'desc'
        ? r[orderBy].localeCompare(l[orderBy])
        : l[orderBy].localeCompare(r[orderBy]));

    const afterPosition = after ? sorted.findIndex(c => c.id === after) + 1 : 0;

    return sorted.slice(afterPosition, afterPosition + limit);
  }
}
