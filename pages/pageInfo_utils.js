function getPageInfoListOnDate(pageInfoList, date) {
    // Parse date string (YYYY-MM-DD) to ensure correct local date
    const [year, month, day] = date.split('-').map(Number);
    const compareDate = new Date(year, month - 1, day).toDateString();  // month is 0-based in Date constructor
    return pageInfoList.filter(entry => {
        const entryDate = new Date(entry.openTime).toDateString();
        return entryDate === compareDate;
    });
}

function getPageInfoListOnHour(pageInfoList, hour) {
    return pageInfoList.filter(entry => {
        const entryHour = new Date(entry.openTime).getHours();
        return entryHour === hour;
    });
}

function getTotalDuration(pageInfoList) {
    return pageInfoList.reduce((total, entry) => total + (entry.duration || 0), 0);
}

function getCategories(pageInfoList) {
    return Array.from(new Set(pageInfoList.map(entry => entry.category)));
}

function getHours(pageInfoList) {
    return Array.from(new Set(pageInfoList.map(entry => new Date(entry.openTime).getHours())));
}

function getDates(pageInfoList) {
    return Array.from(new Set(pageInfoList.map(entry => new Date(entry.openTime).toDateString())));
}

export { getPageInfoListOnDate, getPageInfoListOnHour, getTotalDuration, getCategories, getHours, getDates };