// Array of quote objects with text and category
const quotes = [
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Create UI elements
    createUIElements();
    createCategorySelector();
    
    // Add event listener to new quote button
    const newQuoteBtn = document.getElementById('newQuote');
    newQuoteBtn.addEventListener('click', function() {
        const categorySelect = document.getElementById('categorySelector');
        showRandomQuote(categorySelect ? categorySelect.value : null);
    });
    
    // Show initial quote
    showRandomQuote();
    
    // Add CSS styles dynamically
    addStyles();
});

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
    `;
    document.head.appendChild(style);
}
