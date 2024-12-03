# Productivity Tracker Chrome Extension

A Chrome extension that helps users track and analyze their web browsing habits with a focus on productivity. The extension categorizes websites, tracks time spent, and provides insights into browsing patterns.

## Project Description

This Chrome extension addresses the growing need for digital wellness and productivity awareness in our increasingly online world. By providing real-time insights into browsing habits, users can make informed decisions about their internet usage and improve their digital productivity.

### Problem Statement
Many users struggle with:
- Understanding how they spend their time online
- Maintaining focus during work hours
- Identifying patterns in their browsing behavior
- Managing digital distractions effectively

### Technical Implementation
The extension uses Google Gemini nano's prompt API to categorize websites and generate summaries of the day.

The extension utilizes several Chrome APIs to deliver its functionality:
- `chrome.tabs` API for real-time tab monitoring and URL tracking
- `chrome.storage` API for persistent data storage
- `chrome.alarms` API for scheduling periodic analytics updates
- `chrome.notifications` API for productivity alerts
- `chrome.runtime` API for background process management

All data is stored locally to ensure user privacy.

## Features

- **Real-time Activity Tracking**: Automatically tracks the time spent on different websites
- **Smart Categorization**: Uses AI to categorize websites into different categories like Working, Studying, Entertainment, etc.
- **Productivity Mode**: Sends notifications when visiting unproductive websites
- **Whitelist Support**: Ability to whitelist websites to prevent productivity notifications
- **Visual Analytics**: 
  - Pie charts showing time distribution across categories
  - Bar charts displaying hourly activity breakdown
  - Detailed time summaries with AI-generated insights
- **Date-based Analysis**: View and analyze browsing patterns for specific dates

## Categories

The extension categorizes websites into the following groups:

### Productive Categories
- Working
- Studying
- Finance
- News
- Wellness

### Unproductive Categories
- Shopping
- Gaming
- Browsing
- Social Media
- Entertainment
- Travel

## Installation

1. Clone this repository:

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

## Usage

1. **View Current Stats**: Click the extension icon to see a popup with your current day's activity summary

2. **Detailed Analysis**: Click the "Summary" button in the popup to open a detailed dashboard
   - Switch between percentage and minute views
   - View table and chart of hourly breakdowns
   - Read AI-generated productivity insights

3. **Productivity Mode**: Toggle "productive mode" to receive notifications when visiting unproductive websites
   - Add sites to whitelist directly from notifications

## Technical Details

The extension is built using:
- Vanilla JavaScript (ES6+)
- Chrome Extension APIs
- Chart.js for visualizations
- AI-powered categorization and insights

Key components:
- `background.js`: Main extension process
- `popup/`: Extension popup interface
- `pages/`: Detailed analysis pages
- `storage.js`: Chrome storage management
- `productivity.js`: Productivity tracking logic

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chart.js for visualization capabilities
- Chrome Extension APIs
- AI language model for website categorization and insights