import {
    CHANGE_NOTIFICATION_TEXT,
    SHOW_NOTIFICATION,
    HIDE_NOTIFICATION
} from '../../actions/actionTypes';

export let showNotification = (showNotification = false, action) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            console.log('SHOW_NOTIFICATION');
            return true;

        case HIDE_NOTIFICATION:
            return false;

        default:
            return showNotification;
    }
};

export let notificationText = (notificationText = '', action) => {
    switch (action.type) {
        case CHANGE_NOTIFICATION_TEXT:
            console.log('CHANGE_NOTIFICATION_TEXT: ', action.payload);
            return action.payload.notification;

        default:
            return notificationText;
    }
};
