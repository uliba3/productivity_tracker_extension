import { getWhitelistFromStorage, saveWhitelist } from './storage.js';

const productive_categories = new Set([
    'Working',
    'Studying',
    'Finance',
    'News',
    'Wellness'
]);

const unproductive_categories = new Set([
    'Shopping',
    'Gaming',
    'Browsing',
    'Social Media',
    'Entertainment',
    'Travel'
]);

function isProductive(category) {
    return productive_categories.has(category);
}

async function isWhitelisted(title) {
    const whitelist = await getWhitelistFromStorage();
    console.log("whitelist",whitelist);
    return whitelist.includes(title);
}

async function addToWhitelist() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const title = tabs[0]?.title || 'Unknown';
    if (title === 'Unknown') {
        return;
    }
    const whitelist = await getWhitelistFromStorage();
    whitelist.push(title);
    saveWhitelist(whitelist);
}

export { isWhitelisted, isProductive, addToWhitelist };