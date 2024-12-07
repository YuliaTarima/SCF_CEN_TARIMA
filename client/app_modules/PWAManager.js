import {verifyOrCreatePushSubscription, notifyServerToSendPush, notificationPermissionGranted} from './NotificationManager.js';

class PWAManager {
    /**
     * Initialize the PWA manager by registering the service worker.
     * @returns {Promise<void>}
     */
    static async initialize() {
        try {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('./service-worker.js');
                    console.log('PWAManager: Service worker registration ', registration);
                     const isNotificationPermissionGranted = await notificationPermissionGranted();
                    if (!registration) console.log('PWAManager: No SW registration', registration);
                    if (!!registration && !!registration.pushManager && !!isNotificationPermissionGranted) {
                        await verifyOrCreatePushSubscription(registration);
                        await notifyServerToSendPush({trigger: "onPageLoad", registration});
                    }
                } catch (error) {
                    console.error('PWAManager: Service worker registration:', error);
                    return null; // Error occurred, return null
                }
            } else {
                console.error('PWAManager: Service Workers are not supported in this browser.');
                return null; // Service workers are not supported, return null
            }
        } catch (error) {
            console.error('PWAManager: Unexpected error:', error);
            return null; // Unexpected error, return null
        }
    }
}

export default PWAManager;
