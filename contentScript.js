async function showWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'productivity-warning';
    warningDiv.innerHTML = `
        <div class="warning-content">
            <span class="warning-icon">⚠️</span>
            <p>This page might affect your productivity!</p>
            <div class="warning-buttons">
                <button class="whitelist-btn">Add to Whitelist</button>
                <button class="close-warning">×</button>
            </div>
        </div>
    `;

    document.body.appendChild(warningDiv);

    // Handle whitelist button click
    warningDiv.querySelector('.whitelist-btn').addEventListener('click', async () => {
        await chrome.runtime.sendMessage({ action: 'addToWhitelist' });
        warningDiv.remove();
    });

    // Handle close button click
    warningDiv.querySelector('.close-warning').addEventListener('click', () => {
        warningDiv.remove();
    });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'showWarning') {
        await showWarning();
    }
});