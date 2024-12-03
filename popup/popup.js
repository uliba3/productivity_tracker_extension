import { displayPageInfo, displayProductivity } from './display.js';
import { setupEventListeners } from './eventHandlers.js';
import { displayPieChart } from '../pages/visualization.js';
import { getTodayDate } from './utils.js';

console.log('popup.js loaded');

// Call the display function when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMContentLoaded');
  setupEventListeners();
  await displayPageInfo();
  await displayPieChart(getTodayDate());
  await displayProductivity();
  console.log('Page info displayed');
});

// Add a fallback in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('Document already loaded, calling displayPageInfo directly');
  await displayPageInfo();
  await displayPieChart(getTodayDate());
}