// Array of quote objects with text and category
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "In the middle of difficulty lies opportunity.", category: "Opportunity" },
    { text: "The best way to predict the future is to create it.", category: "Future" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", category: "Happiness" },
    { text: "The journey of a thousand miles begins with one step.", category: "Journey" },
    { text: "Believe you can and you're halfway there.", category: "Belief" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Doubt" }
];

// Web Storage Functions
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
}

function saveSessionData(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function loadSessionData(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Filter and Category Management Functions
function saveFilterPreference(category) {
    localStorage.setItem('lastSelectedFilter', category);
}

function loadFilterPreference() {
    return localStorage.getItem('lastSelectedFilter') || 'all';
}

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // Get current selection
    const currentSelection = categoryFilter.value;
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Get unique categories and add them to the dropdown
    const categories = getCategories();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Restore previous selection if it still exists
    if (currentSelection && categories.includes(currentSelection)) {
        categoryFilter.value = currentSelection;
    }
}

function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    
    // Save filter preference
    saveFilterPreference(selectedCategory);
    
    // Filter quotes based on selection
    let filteredQuotes = quotes;
    if (selectedCategory && selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    
    // Update the display
    displayFilteredQuotes(filteredQuotes, selectedCategory);
    
    // Update session data
    saveSessionData('lastFilteredCategory', selectedCategory);
}

function displayFilteredQuotes(filteredQuotes, category) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `
            <div class="no-quotes-message">
                <h3>No quotes found</h3>
                <p>No quotes available for category: <strong>${category}</strong></p>
                <button onclick="clearFilter()" class="btn-show-random">Clear Filter</button>
            </div>
        `;
        return;
    }
    
    // Create a container for all filtered quotes
    let quotesHTML = `
        <div class="filtered-quotes-container">
            <div class="filter-header">
                <h3>Quotes in "${category === 'all' ? 'All Categories' : category}" (${filteredQuotes.length})</h3>
                <button onclick="clearFilter()" class="btn-clear-filter">Clear Filter</button>
            </div>
            <div class="quotes-grid">
    `;
    
    // Add each quote to the display
    filteredQuotes.forEach((quote, index) => {
        quotesHTML += `
            <div class="quote-card" data-index="${index}">
                <blockquote class="quote-text">"${quote.text}"</blockquote>
                <cite class="quote-category">— ${quote.category}</cite>
                <div class="quote-actions">
                    <button onclick="showSpecificQuote(${index})" class="btn-view-quote">View Full</button>
                </div>
            </div>
        `;
    });
    
    quotesHTML += `
            </div>
        </div>
    `;
    
    quoteDisplay.innerHTML = quotesHTML;
    
    // Add animation to quote cards
    const quoteCards = quoteDisplay.querySelectorAll('.quote-card');
    quoteCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-in-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function showSpecificQuote(index) {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    
    let filteredQuotes = quotes;
    if (selectedCategory && selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    
    if (filteredQuotes[index]) {
        const quote = filteredQuotes[index];
        const quoteDisplay = document.getElementById('quoteDisplay');
        
        quoteDisplay.innerHTML = `
            <div class="quote-container">
                <blockquote class="quote-text">"${quote.text}"</blockquote>
                <cite class="quote-category">— ${quote.category}</cite>
                <div class="quote-actions">
                    <button onclick="filterQuotes()" class="btn-back-to-filter">Back to Filtered View</button>
                    <button onclick="showRandomQuote()" class="btn-show-random">Show Random Quote</button>
                </div>
            </div>
        `;
        
        // Save to session storage
        saveSessionData('lastViewedQuote', {
            quote: quote,
            category: selectedCategory,
            timestamp: new Date().toISOString()
        });
    }
}

// Get unique categories from quotes array
const getCategories = () => {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    return categories;
};

// Function to display a random quote
function showRandomQuote(category = null) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Filter quotes by category if specified
    let filteredQuotes = quotes;
    if (category && category !== 'All') {
        filteredQuotes = quotes.filter(quote => quote.category === category);
    }
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p class="no-quotes">No quotes available for this category.</p>';
        return;
    }
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    // Save last viewed quote to session storage
    saveSessionData('lastViewedQuote', {
        quote: randomQuote,
        category: category,
        timestamp: new Date().toISOString()
    });
    
    // Create quote display with animation
    quoteDisplay.innerHTML = `
        <div class="quote-container">
            <blockquote class="quote-text">"${randomQuote.text}"</blockquote>
            <cite class="quote-category">— ${randomQuote.category}</cite>
        </div>
    `;
    
    // Add fade-in animation
    const quoteContainer = quoteDisplay.querySelector('.quote-container');
    quoteContainer.style.opacity = '0';
    quoteContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        quoteContainer.style.transition = 'all 0.5s ease-in-out';
        quoteContainer.style.opacity = '1';
        quoteContainer.style.transform = 'translateY(0)';
    }, 100);
}

// Function to create and display form for adding new quotes
function createAddQuoteForm() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Create form HTML
    const formHTML = `
        <div class="add-quote-form">
            <h3>Add New Quote</h3>
            <form id="quoteForm">
                <div class="form-group">
                    <label for="quoteText">Quote Text:</label>
                    <textarea id="quoteText" name="quoteText" required placeholder="Enter your quote here..."></textarea>
                </div>
                <div class="form-group">
                    <label for="quoteCategory">Category:</label>
                    <select id="quoteCategory" name="quoteCategory" required>
                        <option value="">Select a category</option>
                        ${getCategories().map(category => `<option value="${category}">${category}</option>`).join('')}
                        <option value="new">Add New Category</option>
                    </select>
                </div>
                <div class="form-group" id="newCategoryGroup" style="display: none;">
                    <label for="newCategory">New Category:</label>
                    <input type="text" id="newCategory" name="newCategory" placeholder="Enter new category name">
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn-submit">Add Quote</button>
                    <button type="button" class="btn-cancel" onclick="showRandomQuote()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    quoteDisplay.innerHTML = formHTML;
    
    // Add event listeners
    const form = document.getElementById('quoteForm');
    const categorySelect = document.getElementById('quoteCategory');
    const newCategoryGroup = document.getElementById('newCategoryGroup');
    
    // Show/hide new category input based on selection
    categorySelect.addEventListener('change', function() {
        if (this.value === 'new') {
            newCategoryGroup.style.display = 'block';
            document.getElementById('newCategory').required = true;
        } else {
            newCategoryGroup.style.display = 'none';
            document.getElementById('newCategory').required = false;
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const quoteText = document.getElementById('quoteText').value.trim();
        const category = categorySelect.value;
        let finalCategory = category;
        
        if (category === 'new') {
            finalCategory = document.getElementById('newCategory').value.trim();
            if (!finalCategory) {
                alert('Please enter a new category name.');
                return;
            }
        }
        
        if (quoteText && finalCategory) {
            // Add new quote to array
            quotes.push({
                text: quoteText,
                category: finalCategory
            });
            
            // Save to local storage
            saveQuotes();
            
            // Show success message
            quoteDisplay.innerHTML = `
                <div class="success-message">
                    <h3>Quote Added Successfully!</h3>
                    <p>"${quoteText}"</p>
                    <p class="category">Category: ${finalCategory}</p>
                    <button onclick="showRandomQuote()" class="btn-show-quote">Show Random Quote</button>
                </div>
            `;
            
            // Update category selector and quote counter
            updateCategorySelector();
            updateQuoteCounter();
            updateStorageInfo();
            populateCategories();
            
            // Add animation to the success message
            const successMessage = quoteDisplay.querySelector('.success-message');
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                successMessage.style.transition = 'all 0.5s ease-in-out';
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'scale(1)';
            }, 100);
        }
    });
}

// Function to update category selector with new categories
function updateCategorySelector() {
    const categorySelect = document.getElementById('categorySelector');
    if (categorySelect) {
        const currentValue = categorySelect.value;
        categorySelect.innerHTML = `
            <option value="All">All Categories</option>
            ${getCategories().map(category => `<option value="${category}">${category}</option>`).join('')}
        `;
        categorySelect.value = currentValue;
    }
}

// Function to create category selector
function createCategorySelector() {
    const container = document.createElement('div');
    container.className = 'category-selector';
    container.innerHTML = `
        <label for="categorySelector">Select Category:</label>
        <select id="categorySelector">
            <option value="All">All Categories</option>
            ${getCategories().map(category => `<option value="${category}">${category}</option>`).join('')}
        </select>
    `;
    
    // Insert before the quote display
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.parentNode.insertBefore(container, quoteDisplay);
    
    // Add event listener
    const categorySelect = document.getElementById('categorySelector');
    categorySelect.addEventListener('change', function() {
        showRandomQuote(this.value);
    });
}

// Function to create additional UI elements
function createUIElements() {
    const body = document.body;
    
    // Create add quote button
    const addQuoteBtn = document.createElement('button');
    addQuoteBtn.id = 'addQuote';
    addQuoteBtn.textContent = 'Add New Quote';
    addQuoteBtn.className = 'btn-add-quote';
    addQuoteBtn.onclick = createAddQuoteForm;
    
    // Create quote counter
    const quoteCounter = document.createElement('div');
    quoteCounter.id = 'quoteCounter';
    quoteCounter.className = 'quote-counter';
    quoteCounter.innerHTML = `<p>Total Quotes: <span id="quoteCount">${quotes.length}</span></p>`;
    
    // Insert elements after the new quote button
    const newQuoteBtn = document.getElementById('newQuote');
    newQuoteBtn.parentNode.insertBefore(addQuoteBtn, newQuoteBtn.nextSibling);
    newQuoteBtn.parentNode.insertBefore(quoteCounter, addQuoteBtn.nextSibling);
    
    // Add some spacing
    const spacer = document.createElement('div');
    spacer.className = 'spacer';
    spacer.style.height = '20px';
    newQuoteBtn.parentNode.insertBefore(spacer, quoteCounter.nextSibling);
}

// Function to update quote counter
function updateQuoteCounter() {
    const quoteCount = document.getElementById('quoteCount');
    if (quoteCount) {
        quoteCount.textContent = quotes.length;
    }
}

// Function to add quote using the simple form interface
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
    
    // Validate inputs
    if (!quoteText) {
        alert('Please enter a quote text.');
        return;
    }
    
    if (!quoteCategory) {
        alert('Please enter a category.');
        return;
    }
    
    // Add new quote to array
    quotes.push({
        text: quoteText,
        category: quoteCategory
    });
    
    // Save to local storage
    saveQuotes();
    
    // Clear the form
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    
    // Show success message
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <div class="success-message">
            <h3>Quote Added Successfully!</h3>
            <p>"${quoteText}"</p>
            <p class="category">Category: ${quoteCategory}</p>
            <button onclick="showRandomQuote()" class="btn-show-quote">Show Random Quote</button>
        </div>
    `;
    
    // Update category selector and quote counter
    updateCategorySelector();
    updateQuoteCounter();
    updateStorageInfo();
    populateCategories();
    
    // Add animation to the success message
    const successMessage = quoteDisplay.querySelector('.success-message');
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        successMessage.style.transition = 'all 0.5s ease-in-out';
        successMessage.style.opacity = '1';
        successMessage.style.transform = 'scale(1)';
    }, 100);
}

// Function to export quotes to JSON file
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotes_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Quotes exported successfully!', 'success');
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            
            // Validate the imported data
            if (!Array.isArray(importedQuotes)) {
                throw new Error('Invalid JSON format: Expected an array of quotes');
            }
            
            // Validate each quote object
            for (let i = 0; i < importedQuotes.length; i++) {
                const quote = importedQuotes[i];
                if (!quote.text || !quote.category) {
                    throw new Error(`Invalid quote at index ${i}: Missing text or category`);
                }
            }
            
            // Add imported quotes to existing array
            quotes.push(...importedQuotes);
            
            // Save to local storage
            saveQuotes();
            
            // Update UI
            updateCategorySelector();
            updateQuoteCounter();
            updateStorageInfo();
            populateCategories();
            
            // Show success message
            showNotification(`Successfully imported ${importedQuotes.length} quotes!`, 'success');
            
            // Clear the file input
            event.target.value = '';
            
        } catch (error) {
            showNotification(`Import failed: ${error.message}`, 'error');
            event.target.value = '';
        }
    };
    
    fileReader.onerror = function() {
        showNotification('Error reading file', 'error');
        event.target.value = '';
    };
    
    fileReader.readAsText(file);
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Function to show the last viewed quote from session storage
function showLastViewedQuote() {
    const lastViewedQuote = loadSessionData('lastViewedQuote');
    if (lastViewedQuote && lastViewedQuote.quote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `
            <div class="quote-container">
                <blockquote class="quote-text">"${lastViewedQuote.quote.text}"</blockquote>
                <cite class="quote-category">— ${lastViewedQuote.quote.category}</cite>
                <div class="last-viewed-info">
                    <small>Last viewed: ${new Date(lastViewedQuote.timestamp).toLocaleString()}</small>
                </div>
            </div>
        `;
    } else {
        showRandomQuote();
    }
}

// Function to add CSS styles
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        h1 {
            text-align: center;
            color: white;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            margin: 0;
            font-style: italic;
        }
        
        main {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
        }
        
        .controls {
            text-align: center;
            margin-top: 20px;
        }
        
        footer {
            text-align: center;
            margin-top: 30px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }
        
        .category-selector {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .category-selector label {
            color: white;
            margin-right: 10px;
            font-weight: bold;
        }
        
        .category-selector select {
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            background: white;
            font-size: 14px;
        }
        
        #quoteDisplay {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin: 20px 0;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quote-container {
            text-align: center;
            max-width: 600px;
        }
        
        .quote-text {
            font-size: 24px;
            font-style: italic;
            margin: 0 0 20px 0;
            color: #2c3e50;
            line-height: 1.6;
        }
        
        .quote-category {
            font-size: 16px;
            color: #7f8c8d;
            font-weight: bold;
        }
        
        button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        .btn-add-quote {
            background: linear-gradient(45deg, #11998e, #38ef7d);
        }
        
        .quote-counter {
            text-align: center;
            color: white;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .add-quote-form {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .add-quote-form h3 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .form-group textarea {
            height: 100px;
            resize: vertical;
        }
        
        .form-buttons {
            text-align: center;
            margin-top: 20px;
        }
        
        .btn-submit {
            background: linear-gradient(45deg, #11998e, #38ef7d);
        }
        
        .btn-cancel {
            background: linear-gradient(45deg, #ff416c, #ff4b2b);
        }
        
        .success-message {
            text-align: center;
            color: #2c3e50;
        }
        
        .success-message h3 {
            color: #27ae60;
            margin-bottom: 15px;
        }
        
        .success-message .category {
            color: #7f8c8d;
            font-style: italic;
        }
        
        .btn-show-quote {
            background: linear-gradient(45deg, #667eea, #764ba2);
            margin-top: 15px;
        }
        
        .no-quotes {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .add-quote-section {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            backdrop-filter: blur(5px);
        }
        
        .add-quote-section h3 {
            text-align: center;
            color: white;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .simple-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .simple-form input {
            padding: 12px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            background: white;
            color: #333;
        }
        
        .simple-form input:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5);
        }
        
        .simple-form button {
            background: linear-gradient(45deg, #11998e, #38ef7d);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .simple-form button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 600px) {
            .simple-form {
                max-width: 100%;
            }
            
            .simple-form input,
            .simple-form button {
                width: 100%;
            }
        }
        
        .import-export-section {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            backdrop-filter: blur(5px);
        }
        
        .import-export-section h3 {
            text-align: center;
            color: white;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .import-export-controls {
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .export-control,
        .import-control {
            text-align: center;
        }
        
        .btn-export {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .btn-export:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .file-input-label {
            display: block;
            color: white;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        #importFile {
            background: white;
            padding: 8px;
            border-radius: 5px;
            border: none;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
        }
        
        .session-info {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            backdrop-filter: blur(5px);
            text-align: center;
        }
        
        .btn-last-quote {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }
        
        .btn-last-quote:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .storage-info {
            color: white;
            font-size: 14px;
        }
        
        .storage-info p {
            margin: 5px 0;
        }
        
        .last-viewed-info {
            margin-top: 10px;
            color: #7f8c8d;
            font-size: 12px;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        }
        
        .notification-success {
            background: linear-gradient(45deg, #27ae60, #2ecc71);
        }
        
        .notification-error {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
        }
        
        .notification-info {
            background: linear-gradient(45deg, #3498db, #2980b9);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .filter-section {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(5px);
            text-align: center;
        }
        
        .filter-section label {
            color: white;
            font-weight: bold;
            margin-right: 10px;
            font-size: 16px;
        }
        
        #categoryFilter {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            background: white;
            font-size: 14px;
            min-width: 200px;
            cursor: pointer;
        }
        
        #categoryFilter:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5);
        }
        
        .filtered-quotes-container {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .filter-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .filter-header h3 {
            color: #2c3e50;
            margin: 0;
            font-size: 20px;
        }
        
        .btn-clear-filter {
            background: linear-gradient(45deg, #95a5a6, #7f8c8d);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .btn-clear-filter:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .quotes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .quote-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            border-left: 4px solid #667eea;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .quote-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }
        
        .quote-card .quote-text {
            font-size: 16px;
            font-style: italic;
            margin: 0 0 15px 0;
            color: #2c3e50;
            line-height: 1.5;
        }
        
        .quote-card .quote-category {
            font-size: 14px;
            color: #7f8c8d;
            font-weight: bold;
            display: block;
            margin-bottom: 15px;
        }
        
        .quote-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        .btn-view-quote,
        .btn-back-to-filter,
        .btn-show-random {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .btn-view-quote:hover,
        .btn-back-to-filter:hover,
        .btn-show-random:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .btn-back-to-filter {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        }
        
        .btn-show-random {
            background: linear-gradient(45deg, #11998e, #38ef7d);
        }
        
        .no-quotes-message {
            text-align: center;
            color: #7f8c8d;
            padding: 40px 20px;
        }
        
        .no-quotes-message h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .no-quotes-message p {
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            .quotes-grid {
                grid-template-columns: 1fr;
            }
            
            .filter-section {
                padding: 15px;
            }
            
            #categoryFilter {
                min-width: 150px;
            }
        }
        
        .sync-button {
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin: 10px 0;
        }
        
        .sync-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .sync-button:disabled {
            background: #95a5a6;
            cursor: not-allowed;
            transform: none;
        }
        
        .conflict-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .conflict-dialog {
            background: white;
            border-radius: 10px;
            padding: 20px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .conflict-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .conflict-header h3 {
            margin: 0;
            color: #2c3e50;
        }
        
        .btn-close {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
        }
        
        .conflict-content {
            color: #2c3e50;
        }
        
        .conflict-list {
            margin-top: 15px;
        }
        
        .conflict-item {
            background: #f8f9fa;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid #e74c3c;
        }
        
        .conflict-item h4 {
            margin: 0 0 10px 0;
            color: #e74c3c;
        }
        
        .conflict-versions {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .local-version {
            background: #fff3cd;
            padding: 8px;
            border-radius: 3px;
            border-left: 3px solid #ffc107;
        }
        
        .server-version {
            background: #d1ecf1;
            padding: 8px;
            border-radius: 3px;
            border-left: 3px solid #17a2b8;
        }
    `;
    document.head.appendChild(style);
}

// Add sync button styles
function addSyncStyles() {
    const syncStyle = document.createElement('style');
    syncStyle.textContent = `
        .sync-button {
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin: 10px 0;
        }
        
        .sync-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(syncStyle);
}

// Function to update storage info display
function updateStorageInfo() {
    const localStorageInfo = document.getElementById('localStorageInfo');
    const sessionStorageInfo = document.getElementById('sessionStorageInfo');
    
    if (localStorageInfo) {
        const quoteCount = quotes.length;
        const currentFilter = loadFilterPreference();
        localStorageInfo.textContent = `${quoteCount} quotes stored | Filter: ${currentFilter}`;
    }
    
    if (sessionStorageInfo) {
        const lastViewedQuote = loadSessionData('lastViewedQuote');
        if (lastViewedQuote) {
            sessionStorageInfo.textContent = `Last quote: ${lastViewedQuote.quote.category}`;
        } else {
            sessionStorageInfo.textContent = 'No recent activity';
        }
    }
}

function clearFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = 'all';
    }
    saveFilterPreference('all');
    showRandomQuote();
}

// Server Sync and Conflict Resolution Functions
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverPosts = await response.json();
        
        // Map server data to our quote format
        const serverQuotes = serverPosts.slice(0, 10).map((post, index) => ({
            text: post.title,
            category: `Server-${index + 1}`,
            id: `server-${post.id}`,
            source: 'server'
        }));
        
        return serverQuotes;
    } catch (error) {
        console.error('Error fetching from server:', error);
        showNotification('Failed to fetch data from server', 'error');
        return [];
    }
}

async function postQuotesToServer(localQuotes) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title: 'Quote Sync',
                body: JSON.stringify(localQuotes),
                userId: 1
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Mock server response:', result);
        return true;
    } catch (error) {
        console.error('Error posting to server:', error);
        showNotification('Failed to sync with server', 'error');
        return false;
    }
}

async function syncWithServer() {
    try {
        showNotification('Syncing with server...', 'info');
        
        // Fetch quotes from server
        const serverQuotes = await fetchQuotesFromServer();
        
        if (serverQuotes.length === 0) {
            showNotification('No server data available', 'info');
            return;
        }
        
        // Get current local quotes
        const localQuotes = [...quotes];
        const originalCount = localQuotes.length;
        
        // Create a map of existing quotes by text for quick lookup
        const existingQuotesMap = new Map();
        localQuotes.forEach(quote => {
            existingQuotesMap.set(quote.text, quote);
        });
        
        // Merge server quotes with local quotes
        let mergedQuotes = [...localQuotes];
        let conflicts = [];
        let newQuotes = [];
        
        serverQuotes.forEach(serverQuote => {
            const existingQuote = existingQuotesMap.get(serverQuote.text);
            
            if (existingQuote) {
                // Conflict detected - server takes precedence
                if (existingQuote.source !== 'server') {
                    conflicts.push({
                        local: existingQuote,
                        server: serverQuote
                    });
                }
                // Replace with server version
                const index = mergedQuotes.findIndex(q => q.text === serverQuote.text);
                if (index !== -1) {
                    mergedQuotes[index] = serverQuote;
                }
            } else {
                // New quote from server
                mergedQuotes.push(serverQuote);
                newQuotes.push(serverQuote);
            }
        });
        
        // Update quotes array
        quotes = mergedQuotes;
        
        // Save to local storage
        saveQuotes();
        
        // Update UI
        updateCategorySelector();
        updateQuoteCounter();
        populateCategories();
        updateStorageInfo();
        
        // Show appropriate notifications
        if (newQuotes.length > 0) {
            showNotification(`Added ${newQuotes.length} new quotes from server`, 'success');
        }
        
        if (conflicts.length > 0) {
            showNotification(`Resolved ${conflicts.length} conflicts (server data took precedence)`, 'info');
            saveSessionData('lastConflicts', conflicts);
        }
        
        // Show general sync success message
        showNotification('Quotes synced with server!', 'success');
        
        // Update display based on current filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter && categoryFilter.value !== 'all') {
            filterQuotes();
        } else {
            showRandomQuote();
        }
        
        console.log(`Sync completed: ${newQuotes.length} new quotes, ${conflicts.length} conflicts resolved`);
        
    } catch (error) {
        console.error('Sync error:', error);
        showNotification('Sync failed: ' + error.message, 'error');
    }
}

function showConflictResolutionDialog(conflicts) {
    const dialogHTML = `
        <div class="conflict-dialog">
            <div class="conflict-header">
                <h3>Conflict Resolution</h3>
                <button onclick="closeConflictDialog()" class="btn-close">×</button>
            </div>
            <div class="conflict-content">
                <p>${conflicts.length} conflicts were detected. Server data was used by default.</p>
                <div class="conflict-list">
                    ${conflicts.map((conflict, index) => `
                        <div class="conflict-item">
                            <h4>Conflict ${index + 1}</h4>
                            <div class="conflict-versions">
                                <div class="local-version">
                                    <strong>Local:</strong> "${conflict.local.text}" (${conflict.local.category})
                                </div>
                                <div class="server-version">
                                    <strong>Server:</strong> "${conflict.server.text}" (${conflict.server.category})
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'conflict-overlay';
    overlay.innerHTML = dialogHTML;
    document.body.appendChild(overlay);
}

function closeConflictDialog() {
    const overlay = document.querySelector('.conflict-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function startPeriodicSync() {
    // Sync every 2 minutes (120000ms)
    setInterval(async () => {
        await syncWithServer();
    }, 120000);
    
    console.log('Periodic sync started (every 2 minutes)');
}

// Function to sync quotes (wrapper for syncWithServer)
function syncQuotes() {
    return syncWithServer();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load quotes from local storage
    loadQuotes();
    
    // Create UI elements
    createUIElements();
    createCategorySelector();
    
    // Set up filtering system
    populateCategories();
    
    // Restore last selected filter
    const lastFilter = loadFilterPreference();
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && lastFilter) {
        categoryFilter.value = lastFilter;
    }
    
    // Add event listener to new quote button
    const newQuoteBtn = document.getElementById('newQuote');
    newQuoteBtn.addEventListener('click', function() {
        const categorySelect = document.getElementById('categorySelector');
        showRandomQuote(categorySelect ? categorySelect.value : null);
    });
    
    // Add event listener to sync button
    const syncBtn = document.querySelector('button[onclick="syncWithServer()"]');
    if (syncBtn) {
        syncBtn.addEventListener('click', syncWithServer);
    }
    
    // Show initial content based on filter
    if (lastFilter && lastFilter !== 'all') {
        filterQuotes();
    } else {
        // Show initial quote (try to show last viewed quote from session)
        const lastViewedQuote = loadSessionData('lastViewedQuote');
        if (lastViewedQuote && lastViewedQuote.quote) {
            showLastViewedQuote();
        } else {
            showRandomQuote();
        }
    }
    
    // Update storage info
    updateStorageInfo();
    
    // Start periodic sync
    startPeriodicSync();
    
    // Add CSS styles dynamically
    addStyles();
    addSyncStyles();
});
