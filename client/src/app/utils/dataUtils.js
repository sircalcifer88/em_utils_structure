const { getData } = require('../containers/Profile/util/storageDataHelpers');


export const isEmOrgActive = (user) => {
    const currentOrganizationId = getData('currentOrganizationId');
    const emOrg = user.organizations.find((item) => item.slug === 'editmentor');
    if(emOrg && emOrg._id === currentOrganizationId) {
        return true;
    }
    return false;
};