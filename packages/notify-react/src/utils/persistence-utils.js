import { canUseDOM } from 'exenv';

const localStorage = canUseDOM ? require('@aftonbladet/local-storage') : {};

export const persistClosedNotifications = ({ id }) => {
    if (id) {
        if (canUseDOM) {
            const excluded = localStorage.readValue('notify-exclude') || [];

            if (!excluded.includes(id)) excluded.push(id);

            localStorage.persistValue('notify-exclude', excluded);
        }
    }
};

export const getPersistedClosedNotifications = () => {
    if (canUseDOM) {
        return localStorage.readValue('notify-exclude', 1000 * 60 * 60 * 24) || [];
    }

    return [];
};
