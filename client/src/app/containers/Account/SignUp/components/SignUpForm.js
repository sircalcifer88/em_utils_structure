// ................................................

const validate = (values, props) => {
    const requiredFields = ['firstName', 'lastName', 'password', 'email'];
    const errors = {};
    if(props.hasOrg) {
        requiredFields.push('organizationName');
    }
    requiredFields.forEach(item => {
        if (!values[item] || (values[item] && !values[item].toString().replace(/\s/g, '').length)) {
            errors[item] = 'This field is required.';
        }
    });
    if (values.email && !validateEmail(values.email)) {
        errors.email = 'Invalid email address.';
    }


    if(props.simplePassword) {
        if (values.password && validateSimplePassword(values.password)) {
            errors.password = 'Password should be min 6 characters long.';
        }
    } else {
        if (values.password && validatePassword(values.password)) {
            errors.password = 'Password should be min 12 characters long, a combination of one uppercase, one lower case, one special character and one digit.';
        }
    }
    return errors;
};

// ................................................

// the validation functions in some cases are too different, so 
// maybe having them in each component is a better idea, for the 
// visibility purposes too 