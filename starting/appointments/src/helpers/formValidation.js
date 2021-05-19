export const match = (regex, description) => value => !value.match(regex) ? description : undefined;

export const list = (...validators) => {
  return (value) => {
    return validators.reduce((result, validator) => {
      return result || validator(value)
    }, undefined);
  }
}

export const required = (name) => {
  return (value) => {
    return !value || value.trim() === ''
      ? `${name} is required`
      : undefined;
  }
}

export const hasError = (validationErrors, fieldName) => {
  return !!validationErrors[fieldName]
}

export const validateMany = (validators, fields) => {
  return Object.entries(fields).reduce(
    (result, [name, value]) => ({
      ...result,
      [name]: validators[name](value)
    }), {});
}

export const anyErrors = errors => Object.values(errors).some(error => error !== undefined);
