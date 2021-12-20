// ........................................................

const validate = (values) => {
    const errors = {};
    const requiredFields = ['name'];
    requiredFields.forEach(item => {
        if (!values[item] || (values[item] && !values[item].replace(/\s/g, '').length)) {
            errors[item] = 'This field is required.';
        }
    });
    if(values.price && values.price < 0) {
        errors.price = 'Invalid input for price.';
    }
    return errors;
};

// .........................................................


