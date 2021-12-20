// ....................................................

const validate = (values, props) => {
    const requiredFields = ['password', 'email'];
    const errors = {};
    requiredFields.forEach(item => {
        if (validateIsEmpty(values[item])) {
            errors[item] = 'This field is required.';
        }
    });
    return errors;
};

// ....................................................