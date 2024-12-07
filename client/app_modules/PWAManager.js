import {handlePushSubscription, notifyServerToSendPush, notificationPermissionGranted} from './NotificationManager.js';

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
                    window.isServiceWorkerRegistered = true;
                    window.serviceWorkerRegistration = registration;
                    const isNotificationPermissionGranted = notificationPermissionGranted();
                    if (registration && isNotificationPermissionGranted) {
                        await handlePushSubscription(registration);
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
