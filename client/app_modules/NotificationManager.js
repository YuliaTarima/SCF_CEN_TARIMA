const SERVER_URL = window.env.SERVER_URL || 'http://localhost:6069';
const VAPID_KEY_PUBLIC = window.env.VAPID_KEY_PUBLIC;

export async function notifyServerToSendPush({trigger, registration}) {
    console.log('notifyServerToSendPush({trigger})', trigger);
    console.log('notifyServerToSendPush({registration})', registration);
    let subscription = await getSubscriptionIfExistsClient(registration);

    if (!subscription || !subscription.endpoint) {
        console.log('NotificationManager/notifyServerToSendPush subscription', subscription);
        // throw new Error('notifyServerToSendPush: Invalid subscription: Missing endpoint.');
        subscription = await createPushSubscriptionClient(registration);
    }
    // Send the subscription and message to the server to trigger a push notification
    const response = await fetch(`${SERVER_URL}/sendNotification`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({trigger, subscription}),
    });

    if (!response.ok) {
        throw new Error('notifyServerToSendPush: Server error sending push notification');
    }
    console.log('notifyServerToSendPush: server response', await response.json());
}

export async function notificationPermissionGranted() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('NotificationManager: permission:', permission);
        return permission === 'granted';
    }
    return false;
}

export async function verifyOrCreatePushSubscription(registration) {
    if (!registration || !registration.pushManager) return null;
    let subscription = await getSubscriptionIfExistsClient(registration);
    console.log('verifyOrCreatePushSubscription subscription: ', !!subscription, subscription)
    if (!!subscription) return subscription;
    const newClientSubscription = await createPushSubscriptionClient(registration);
    const newServerSubscription = await createPushSubscriptionServer(registration);
    console.log('verifyOrCreatePushSubscription: newClientSubscription ', !!newClientSubscription, newClientSubscription);
    console.log('verifyOrCreatePushSubscription: newServerSubscription ', !!newServerSubscription, newServerSubscription);
    return !!newClientSubscription ? newClientSubscription : null;
}

async function createPushSubscriptionClient(registration) {
    if (!registration || !registration.pushManager) return null;
    const subscriptionArgs = {
        userVisibleOnly: true,
        // applicationServerKey: VAPID_KEY_PUBLIC,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY_PUBLIC)
    }
    console.log('createPushSubscriptionClient: await registration.pushManager.subscribe', await registration.pushManager.subscribe(subscriptionArgs));
    const subscription = await registration.pushManager.subscribe(subscriptionArgs);
    console.log('createPushSubscriptionClient: subscription created:', subscription);
    return (!!subscription) ? subscription : null;
}

async function createPushSubscriptionServer(subscription) {

    const response = await fetch(`${SERVER_URL}/subscribe`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({subscription}),
    });
    if (!response.ok) {
        throw new Error('createPushSubscriptionServer: Failed to send subscription to server');
    }
    console.log('createPushSubscriptionServer: response.body', response.body);
}

async function getSubscriptionIfExistsClient(registration) {
    if (!registration || !registration.pushManager) return null;
    const subscription = await registration.pushManager.getSubscription();
    console.log('getSubscriptionIfExistsClient: subscription:', subscription);
    return subscription ? subscription : null;
}

function urlBase64ToUint8Array(base64Url) {
    const padding = '='.repeat((4 - base64Url.length % 4) % 4); // Add padding to make it valid base64 string
    const base64 = (base64Url + padding).replace(/\-/g, '+').replace(/_/g, '/'); // Convert from base64url to base64
    const rawData = atob(base64); // Decode base64 string
    const outputArray = new Uint8Array(rawData.length); // Create an array to store the decoded data

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i); // Fill the array with the decoded data
    }
    return outputArray;
}


