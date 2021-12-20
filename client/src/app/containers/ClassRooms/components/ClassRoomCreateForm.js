// .....................................................

const validate = (values) => {
    const errors = {};
    const requiredFields = ['name'];
    requiredFields.forEach(item => {
        if (!values[item] || (values[item] && !values[item].replace(/\s/g, '').length)) {
            errors[item] = 'This field is required.';
        }
    });
    return errors;
};

// ......................................................