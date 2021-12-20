// .................................................

const validate = (values) => {
    const errors = {};
    const requiredFields = ['email','fullName', 'subject', 'message'];
    requiredFields.forEach(item => {
        if (!values[item] || (values[item] && !values[item].replace(/\s/g, '').length)) {
            errors[item] = 'This field is required.';
        }
    });
    if (values.email && !validateEmail(values.email)) {
        errors.email = 'Invalid email address.';
    }
    return errors;
};

// .................................................