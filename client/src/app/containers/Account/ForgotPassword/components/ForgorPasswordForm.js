// ...................................

const validate = (values, props) => {
    const requiredFields = ['email'];
    const errors = {};
    requiredFields.forEach(item => {
        if (!values[item] || (values[item] && !values[item].toString().replace(/\s/g, '').length)) {
            errors[item] = 'This field is required.';
        }
    });
    if (values.email && !validateEmail(values.email)) {
        errors.email = 'Invalid email address.';
    }
    return errors;
};

// ....................................

// there are other similar validate functions, which can bve turned into 
// util functions