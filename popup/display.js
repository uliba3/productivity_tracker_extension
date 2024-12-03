import { getPageInfoListFromStorage, getProductiveModeFromStorage } from '../storage.js';

export async function displayProductivity() {
  const productiveMode = await getProductiveModeFromStorage();
  console.log("productiveMode", productiveMode);
  const displayToggle = document.getElementById('displayToggle');
  displayToggle.checked = productiveMode;
}

export async function displayPageInfo() {
  console.log('Displaying page info');
  const pageInfoList = await getPageInfoListFromStorage();
} 