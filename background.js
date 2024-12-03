import { addCurrentPageInfoToList, endCurrentPageInfo, endPageInfoIfActive, removeLastPageInfo } from './pageInfo_service.js';
import { getPageCategoriesFromStorage, getProductiveModeFromStorage } from './storage.js';
import { addToWhitelist, isWhitelisted, isProductive } from './productivity.js';

let session = null;

async function initSession() {
    try {
        console.log('Initializing session...');
        session = await ai.languageModel.create();
        console.log('Session initialized successfully');
    } catch (error) {
        console.error('Error initializing session:', error);
    }
}

// Initialize session when background script loads
if (!session) {
    initSession();
}

// Create alarm when background script loads
chrome.alarms.create('checkProductivity', {
    periodInMinutes: 0.5  // Runs every minute
});

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkProductivity') {
        return (async () => {
            try {
                console.log('Periodic task running...');
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!tabs || tabs.length === 0) return;
                
                const title = tabs[0]?.title || 'Unknown';
                const categories = await getPageCategoriesFromStorage();
                const category = categories[title] || 'Unknown';
                if (!isProductive(category) && !await isWhitelisted(title) && await getProductiveModeFromStorage()) {
                    // Add error handling for sending message
                    try {
                        await chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'showWarning'
                        });
                    } catch (error) {
                        console.log('Could not send message to tab:', error);
                        // Tab might not have content script loaded - this is expected for certain pages
                    }
                }
            } catch (error) {
                console.error('Error in periodic task:', error.message);
            }
        })();
    }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    return (async () => {
        try {
            if (changeInfo.status === 'complete' && tab.url) {
                console.log('Tab updated');
                if (!session) {
                    await initSession();
                }
                const session_clone = await session.clone();
                await addCurrentPageInfoToList(session_clone);
                session_clone.destroy();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    })();
});

chrome.tabs.onActivated.addListener((tabId) => {
    return (async () => {
        try {
            console.log('Tab activated');
            if (!session) {
                await initSession();
            }
            const session_clone = await session.clone();
            await addCurrentPageInfoToList(session_clone);
            session_clone.destroy();
        } catch (error) {
            console.error('Error:', error.message);
        }
    })();
});

chrome.windows.onRemoved.addListener((windowId) => {
    return (async () => {
        console.log('Window removed');
        await endCurrentPageInfo();
    })();
});

chrome.tabs.onRemoved.addListener((tabId) => {
    return (async () => {
        console.log('Tab removed');
        await endPageInfoIfActive(tabId);
    })();
});

chrome.windows.onCreated.addListener((window) => {
    return (async () => {
        console.log('Window created');
        await removeLastPageInfo();
    })();
});

// Add this message listener
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'addToWhitelist') {
        await addToWhitelist();
        return true;
    }
});
