import { get_category_prompt_api } from './gemini_nano.js';
import { getPageInfoListFromStorage, savePageInfoList, getPageCategoriesFromStorage, savePageCategories } from './storage.js';

// Function to get page title and URL
async function getPageInfo() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return {
        id: tabs[0]?.id || 'Unknown',
        title: tabs[0]?.title || 'Unknown',
        url: tabs[0]?.url || 'Unknown',
        openTime: new Date().toLocaleString(), // MM/DD/YYYY HH:MM:SS PM/AM
        openTimeNumber: Date.now()
    };
}

async function isValidPageInfo(pageInfo) {
    const pageInfoList = await getPageInfoListFromStorage();
    const lastEntry = pageInfoList[pageInfoList.length - 1];
    if (lastEntry && lastEntry.title === pageInfo.title && lastEntry.url === pageInfo.url) {
        return false;
    }
    return true;
}

// Function to add current page info to the list and save it to local storage
async function addCurrentPageInfoToList(session) {
    const pageInfo = await getPageInfo();
    console.log(pageInfo);
    if (!await isValidPageInfo(pageInfo)) {
        return;
    }

    const pageInfoList = await getPageInfoListFromStorage();
    const lastEntry = pageInfoList[pageInfoList.length - 1];
    if (lastEntry && !lastEntry.duration) {
        lastEntry.closeTime = new Date().toLocaleString();
        lastEntry.closeTimeNumber = Date.now();
        lastEntry.duration = (lastEntry.closeTimeNumber - lastEntry.openTimeNumber) / 1000;
    }
    
    console.log(pageInfo.url);
    if (pageInfo.url.includes('chrome://') || pageInfo.url.includes('chrome-extension://') || pageInfo.url.includes('Unknown')) {
        return;
    }

    const pageCategories = await getPageCategoriesFromStorage();
    if (pageCategories[pageInfo.title]) {
        pageInfo.category = pageCategories[pageInfo.title];
    } else {
        pageInfo.category = await get_category_prompt_api(pageInfo.title, pageInfo.url, session);
        pageCategories[pageInfo.title] = pageInfo.category;
        await savePageCategories(pageCategories);
    }

    console.log(pageCategories);
    pageInfoList.push(pageInfo);
    await savePageInfoList(pageInfoList);
    console.log(pageInfo);
    console.log(pageInfoList);
}

async function endCurrentPageInfo() {
    const pageInfoList = await getPageInfoListFromStorage();
    const lastEntry = pageInfoList[pageInfoList.length - 1];
    if (lastEntry && !lastEntry.duration) {
        lastEntry.closeTime = new Date().toLocaleString();
        lastEntry.closeTimeNumber = Date.now();
        lastEntry.duration = (lastEntry.closeTimeNumber - lastEntry.openTimeNumber) / 1000;
        await savePageInfoList(pageInfoList);
    }
}

async function endPageInfoIfActive(tabId) {
    const pageInfoList = await getPageInfoListFromStorage();
    const lastEntry = pageInfoList[pageInfoList.length - 1];
    if (lastEntry && lastEntry.id === tabId && !lastEntry.duration) {
        lastEntry.closeTime = new Date().toLocaleString();
        lastEntry.closeTimeNumber = Date.now();
        lastEntry.duration = (lastEntry.closeTimeNumber - lastEntry.openTimeNumber) / 1000;
        await savePageInfoList(pageInfoList);
    }
}

async function removeLastPageInfo() {
    const pageInfoList = await getPageInfoListFromStorage();
    const lastEntry = pageInfoList[pageInfoList.length - 1];
    if (lastEntry && !lastEntry.duration) {
        pageInfoList.pop();
        await savePageInfoList(pageInfoList);
    }
}

export {
    addCurrentPageInfoToList,
    endCurrentPageInfo,
    endPageInfoIfActive,
    removeLastPageInfo
};
