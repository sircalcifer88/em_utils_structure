// .............................................................

const validate = (values) => {
    /**
     * Validate form changes
     *
     * @param  {Object} values - Current form values.
     * @return {Component} Returns catched errors object.
     */
    const errors = {};
    const requiredFields = ['folderName'];
    requiredFields.forEach(item => {
        if(!values[item] || (values[item] && !values[item].replace(/\s/g, '').length)) {
            errors[item] = 'This field is required.';
        }
    });
    const searchIndex = values.folderName ? values.folderName.search(/[\\/:*?"'<>|]/g) : -1;
    if(values.folderName && searchIndex > -1) {
        errors.folderName = 'A folder name can\'t contain any of the following characters: \\ / : * ? " < > |';
    }
    return errors;
};

// ....................................................................
