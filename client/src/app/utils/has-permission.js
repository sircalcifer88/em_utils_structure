import _ from 'lodash';
import {isHighestRole} from '../containers/Layout/util/getRoles';
import {PLATFORM_OWNER} from '../containers/Layout/constants';

export function hasPermission(userRoles, permittedRoles, hasAccess) {
    return !!(~userRoles.indexOf('platformOwner'))
        || ( _.intersection(permittedRoles, userRoles).length > 0 && (typeof hasAccess === 'boolean' ? hasAccess : true) );
}

export function isInSameOrganization(user, authUser) {
    return _.intersection(authUser.organizations.map(o => o._id), user.organizationId);
}

export function isUsingFreeSubscription(user) {
    return user.organizations && user.organizations[0] && (
        user.organizations[0].slug !== 'editmentor' &&
        user.organizations[0].activePlan.planId === 1
    );
}

export function isPermittedUser(entity, user, propertyName = 'ownerId') {
    const userRoles = user ? user.roles : [];
    const isPlatformOwner = !!(~userRoles.indexOf('platformOwner'));
    return isPlatformOwner || (entity[propertyName]._id || entity[propertyName]) === user._id ||
        Array.isArray(entity.sharedWithUsers) && !!~entity.sharedWithUsers.indexOf(user._id)
    ;
}