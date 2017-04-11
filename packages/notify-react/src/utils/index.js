export { paramify } from './url-utils';
export { persistClosedNotifications, getPersistedClosedNotifications } from './persistence-utils';

export const resolve = (param) => {
    if (typeof param === 'function') return param();

    return param;
};
