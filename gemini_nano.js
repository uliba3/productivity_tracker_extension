async function prompt_api(prompt, session) {
    // Wait for session to be initialized if it hasn't been already
    console.log("Prompting the model...", prompt);
    const result = await session.prompt(prompt);
    console.log(result);
    return result;
}
function make_first_letter_of_word_capital(string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function get_category_prompt_api(title, url, session) {
    const validCategories = [
        'Working', 'Studying', 'News', 'Wellness', 'Finance', 
        'Shopping', 'Gaming', 'Browsing', 'Social Media', 
        'Entertainment', 'Travel', 'Other'
    ];
    
    let category;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        const prompt = `
Given the title and URL of a website, categorize it into one of the following categories based on its main purpose or content: working, studying, news, wellness, finance, shopping, gaming, browsing, social media, entertainment, travel, or other.
ONLY RETURN THE CATEGORY, NO OTHER TEXT.

========Examples=========
Input:
Title: Cat - Google Search
URL: https://www.google.com/search?q=cat

Output:
browsing

Input:
Title: Git - Google Search
URL: https://www.google.com/search?q=git

Output:
Studying

========Actual Input===========
Title: ${title}
URL: ${url}

`;
        const result = await prompt_api(prompt, session);
        // Clean up result by removing spaces and newlines
        const cleanResult = result.replace(/[\n\s]+/g, ' ').trim();
        const words = cleanResult.split(' ');

        // Get the first two words if they exist
        const outputCategory = words[1] ? words[0] + ' ' + words[1] : words[0]; 
        category = make_first_letter_of_word_capital(outputCategory);

        // Check if the category is valid
        if (validCategories.includes(category)) {
            console.log(category);
            return category;
        }
        attempts++;
        console.log(`Invalid category received: ${category}. Retrying... (${attempts}/${maxAttempts})`);
    }

    throw new Error('Max attempts reached. Unable to get a valid category.');
}


async function get_summary_of_the_day(session, dailyData) {
    console.log("Getting summary of the day...");
    const formattedData = Object.entries(dailyData).map(([category, seconds]) => {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMins = minutes % 60;
        return `${category}: ${hours}h ${remainingMins}m`;
    }).join('\n');

    const prompt = `
Analyze the following daily activity data and provide a brief, insightful summary of the user's day. Focus on productivity, time management, and potential areas for improvement.
Talk to me as if you are a friendly buddy who is trying to help me improve my productivity.
Keep the summary concise (2-3 sentences).

Daily Activity Data:
${formattedData}

Only provide the summary text, no additional formatting or labels.
`;
    const result = await prompt_api(prompt, session);
    console.log("Summary of the day: ");
    console.log(result);
    return result;
}

export { get_category_prompt_api, get_summary_of_the_day };