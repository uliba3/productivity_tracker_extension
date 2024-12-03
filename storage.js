// Function to get page information from local storage
async function getPageInfoListFromStorage() {
    const pageInfoList = await chrome.storage.local.get('pageInfoList');
    return pageInfoList.pageInfoList || [];
}

// Function to get page categories from storage
async function getPageCategoriesFromStorage() {
    const categories = await chrome.storage.local.get('pageCategories');
    return categories.pageCategories || {};
}

// Function to get whitelist from storage
async function getWhitelistFromStorage() {
    const whitelist = await chrome.storage.local.get('pageWhitelist');
    return whitelist.pageWhitelist || [];
}

async function getProductiveModeFromStorage() {
    const productiveMode = await chrome.storage.local.get('productiveMode');
    return productiveMode.productiveMode || false;
}

// Function to save page information to local storage
async function savePageInfoList(pageInfoList) {
    chrome.storage.local.set({ pageInfoList: pageInfoList });
}

// Function to save page categories to storage
async function savePageCategories(categories) {
    chrome.storage.local.set({ pageCategories: categories });
}

// Function to save whitelist to storage
async function saveWhitelist(whitelist) {
    chrome.storage.local.set({ pageWhitelist: whitelist });
}

async function saveProductiveMode(productiveMode) {
    chrome.storage.local.set({ productiveMode: productiveMode });
}

// Function to clear the page info list
async function clearPageInfoList() {
    await savePageInfoList([]);
}

// Function to clear page categories
async function clearPageCategories() {
    await savePageCategories({});
}

// Function to clear whitelist
async function clearWhitelist() {
    await saveWhitelist([]);
}

export { 
    getPageInfoListFromStorage,
    getPageCategoriesFromStorage,
    getWhitelistFromStorage,
    getProductiveModeFromStorage,
    savePageInfoList,
    savePageCategories,
    saveWhitelist,
    saveProductiveMode,
    clearPageInfoList,
    clearPageCategories,
    clearWhitelist
};
