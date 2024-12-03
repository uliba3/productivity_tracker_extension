import { getPageInfoListFromStorage } from '../storage.js';
import { getPageInfoListOnDate, getHours, getCategories } from './pageInfo_utils.js';
import { getCategoriesDuration, generateHourlyData } from './pageInfo_aggregator.js';
import { get_summary_of_the_day } from '../gemini_nano.js';

function generatePieChart(categoriesDuration) {
    // Get display toggle element and its value, defaulting to false if element doesn't exist
    const displayToggle = document.getElementById('displayToggle');
    const showPercentage = displayToggle ? displayToggle.checked : true;
    
    const container = document.getElementById('pieChart');
    
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(container);
    if (existingChart) {
        existingChart.destroy();
    }

    // Convert to percentages if needed
    let chartData = categoriesDuration;
    if (showPercentage) {
        const total = Object.values(categoriesDuration).reduce((sum, val) => sum + val, 0);
        chartData = Object.fromEntries(
            Object.entries(categoriesDuration).map(([key, value]) => 
                [key, ((value / total) * 100).toFixed(1)]
            )
        );
    } else {
        chartData = Object.fromEntries(
            Object.entries(categoriesDuration).map(([key, value]) => 
                [key, (value / 60).toFixed(1)]
            )
        );
    }
    
    // Create new chart
    new Chart(container, {
        type: 'pie',
        data: { 
            labels: Object.keys(chartData), 
            datasets: [{ data: Object.values(chartData) }] 
        }
    });
}

function generateEmptyPieChart() {
    console.log("No data for the selected date");
    const container = document.getElementById('pieChart');

    // Clear any existing chart
    const existingChart = Chart.getChart(container);
    if (existingChart) {
        existingChart.destroy();
    }

    // Create a "No data" chart
    new Chart(container, {
        type: 'pie',
        data: {
            labels: ['No Data'],
            datasets: [{
                data: [1],
                backgroundColor: ['#f0f0f0']
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

function generateTable(timeData, times, categories) {
    // Get display toggle element and its value, defaulting to false if element doesn't exist
    const displayToggle = document.getElementById('displayToggle');
    const showPercentage = displayToggle ? displayToggle.checked : false;

    // Create table
    const table = document.getElementById('timeTable');
    table.className = 'time-table';

    // Clear existing table
    table.innerHTML = '';

    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Category</th>' + times.map(time =>
        `<th>${time.toString().padStart(2, '0')}:00-${(parseInt(time) + 1).toString().padStart(2, '0')}:00</th>`
    ).join('');
    headerRow.innerHTML += '<th>Total</th>';
    table.appendChild(headerRow);
    // Create data rows
    categories.forEach(category => {
        const row = document.createElement('tr');
        const cells = [`<td class="category-name">${category}</td>`];

        let totalCategoryDuration = 0;
        let totalDuration = 0;

        times.forEach(time => {
            const seconds = timeData[time].categories[category] || 0;
            const percentage = (seconds / timeData[time].totalDuration * 100) || 0;
            const minutes = seconds / 60;
            
            // Use the current display preference when creating cells
            const displayValue = showPercentage ? 
                `${percentage.toFixed(1)}%` : 
                `${minutes.toFixed(1)} min`;

            cells.push(`<td data-minutes="${minutes.toFixed(1)}" data-percentage="${percentage.toFixed(1)}%">
        ${displayValue}
      </td>`);
            totalCategoryDuration += seconds;
            totalDuration += timeData[time].totalDuration;
        });

        const totalCategoryPercentage = (totalCategoryDuration / totalDuration * 100);
        const totalCategoryMinutes = totalCategoryDuration / 60;

        // Use the current display preference for total column
        const totalDisplayValue = showPercentage ? 
            `${totalCategoryPercentage.toFixed(1)}%` : 
            `${totalCategoryMinutes.toFixed(1)} min`;

        cells.push(`<td data-minutes="${totalCategoryMinutes.toFixed(1)}" data-percentage="${totalCategoryPercentage.toFixed(1)}%">
      ${totalDisplayValue}
    </td>`);

        row.innerHTML = cells.join('');
        table.appendChild(row);
    });
}

function generateEmptyTable() {
    console.log("No data for the selected date");
    const table = document.getElementById('timeTable');
    table.className = 'time-table';
    table.innerHTML = '';
}

function generateBarChart(timeData, times, categories) {
    // Get display toggle element and its value
    const displayToggle = document.getElementById('displayToggle');
    const showPercentage = displayToggle ? displayToggle.checked : false;
    
    const container = document.getElementById('barChart');
    
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(container);
    if (existingChart) {
        existingChart.destroy();
    }

    // Prepare datasets (one for each category)
    const datasets = categories.map(category => {
        const data = times.map(time => {
            const seconds = timeData[time].categories[category] || 0;
            if (showPercentage) {
                return ((seconds / timeData[time].totalDuration) * 100).toFixed(1);
            } else {
                return (seconds / 60).toFixed(1);
            }
        });

        return {
            label: category,
            data: data,
            borderWidth: 1
        };
    });

    // Create labels for x-axis
    const labels = times.map(time => 
        `${time.toString().padStart(2, '0')}:00-${(parseInt(time) + 1).toString().padStart(2, '0')}:00`
    );

    // Create new chart
    new Chart(container, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: showPercentage ? 'Percentage (%)' : 'Duration (minutes)'
                    }
                }
            }
        }
    });
}

async function displayPieChart(selectedDate) {
    console.log("selectedDate", selectedDate);
    const pageInfoList = await getPageInfoListFromStorage();
    console.log("pageInfoList", pageInfoList);
    const dateEntries = getPageInfoListOnDate(pageInfoList, selectedDate);
    console.log("dateEntries", dateEntries);
    const categoriesDuration = getCategoriesDuration(dateEntries);
    console.log("categoriesDuration", categoriesDuration);
    if (Object.keys(categoriesDuration).length > 0) {
        generatePieChart(categoriesDuration);
    } else {
        generateEmptyPieChart();
    }
}

async function displaySummaryTable(selectedDate) {
    const pageInfoList = await getPageInfoListFromStorage();
    const dateEntries = getPageInfoListOnDate(pageInfoList, selectedDate);
    const hours = getHours(dateEntries);
    const categories = getCategories(dateEntries);
    const hourlyData = generateHourlyData(dateEntries, hours);
    console.log("hourlyData", hourlyData);
    if (Object.keys(hourlyData).length > 0) {
        generateTable(hourlyData, hours, categories);
    } else {
        generateEmptyTable();
    }
}

async function displayBarChart(selectedDate) {
    const pageInfoList = await getPageInfoListFromStorage();
    const dateEntries = getPageInfoListOnDate(pageInfoList, selectedDate);
    const hours = getHours(dateEntries);
    const categories = getCategories(dateEntries);
    const hourlyData = generateHourlyData(dateEntries, hours);
    console.log("hourlyData", hourlyData);

    generateBarChart(hourlyData, hours, categories);
}

async function displaySummary(selectedDate) {
    const pageInfoList = await getPageInfoListFromStorage();
    const dateEntries = getPageInfoListOnDate(pageInfoList, selectedDate);
    const categoriesDuration = getCategoriesDuration(dateEntries);
    console.log("categoriesDuration", categoriesDuration);
    if (Object.keys(categoriesDuration).length > 0) {
        const session = await ai.languageModel.create();
        const summary = await get_summary_of_the_day(session, categoriesDuration);
        session.destroy();
        const summaryElement = document.getElementById('summaryTextArea');
        summaryElement.value = summary;
    }
}

async function displayVisuals(selectedDate) {
    await displayBarChart(selectedDate);
    await displaySummaryTable(selectedDate);
    await displayPieChart(selectedDate);
    await displaySummary(selectedDate);
}

export { displayPieChart, displayVisuals };