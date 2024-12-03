import { saveProductiveMode } from '../storage.js';

export function setupEventListeners() {
  document.getElementById('summaryButton').addEventListener('click', async () => {
    console.log('Summary button clicked');
    chrome.tabs.create({
      url: chrome.runtime.getURL('pages/time_summary.html')
    });
  });

  document.getElementById('displayToggle').addEventListener('change', async (e) => {
    await saveProductiveMode(e.target.checked);
    console.log('Productive mode updated:', e.target.checked);
  });
} 