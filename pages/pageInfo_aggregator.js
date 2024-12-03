import { getPageInfoListOnDate, getPageInfoListOnHour, getTotalDuration, getDates } from './pageInfo_utils.js';

function getCategoriesDuration(pageInfoList) {
    const categories = {};
    pageInfoList.forEach(entry => {
        const category = entry.category || 'Unknown';
        if (!categories[category]) {
            categories[category] = 0;
        }
        categories[category] += entry.duration || 0;
    });
    return categories;
}

function generateDailyData(pageInfoList) {
    const dates = getDates(pageInfoList);
    
    const dailyData = {};
    dates.forEach(date => {
        const dateEntries = getPageInfoListOnDate(pageInfoList, date);
        const totalDuration = getTotalDuration(dateEntries);
        dailyData[date] = {
            totalDuration: totalDuration,
            categories: getCategoriesDuration(dateEntries)
        };
    });
    return dailyData;
}

function generateHourlyData(pageInfoList, hours) {
    const hourlyData = {};

    hours.forEach(hour => {
        const hourEntries = getPageInfoListOnHour(pageInfoList, hour);
        const totalDuration = getTotalDuration(hourEntries);
        hourlyData[hour] = {
            totalDuration: totalDuration,
            categories: getCategoriesDuration(hourEntries)
        };
    });
    return hourlyData;
}

export { generateDailyData, generateHourlyData, getCategoriesDuration };