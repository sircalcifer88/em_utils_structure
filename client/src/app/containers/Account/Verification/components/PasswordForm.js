// ..........................................................

const validate = (values, props) => {
    const requiredFields = ['password'];
    const errors = {};
    requiredFields.forEach(item => {
        if (!values[item] || (values[item] && !values[item].toString().replace(/\s/g, '').length)) {
            errors[item] = 'This field is required.';
        }
    });
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

// ..........................................................

// maybe its better to just gather all the validation functions in a 
// seperate service, and import them in the designated files 

