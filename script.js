// RAG-based Course Catalog System
// Initialize the RAG components
let dataProcessor;
let ragChatbot;
let isInitialized = false;

// Legacy course data structure (kept for fallback)
const acfiCourses = {
    "ACFI 801": {
        title: "Corporate Finance",
        credits: 3,
        description: "This course provides the foundation of corporate finance. Topics include investment criteria, capital structure, valuation, mergers and acquisitions, real options, and payout policy.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["investment criteria", "capital structure", "valuation", "mergers and acquisitions", "real options", "payout policy"]
    },
    "ACFI 802": {
        title: "Investments",
        credits: 3,
        description: "This course provides an overview of several important topics in investments: securities and markets, asset pricing theory, stock analysis and valuation, fixed income securities, stock options, and applied portfolio management.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["securities and markets", "asset pricing theory", "stock analysis", "valuation", "fixed income securities", "stock options", "portfolio management"]
    },
    "ACFI 803": {
        title: "International Financial Management",
        credits: 3,
        description: "This course explores the financial management of firms operating in a global environment. Topics typically include foreign exchange markets, the financing of international trade, multinational tax management, derivatives used to mitigate international exposure, and the financial impact of foreign currency usage.",
        mutualExclusion: "No credit for students who have taken ADMN 846.",
        gradeMode: "Letter Grading",
        topics: ["foreign exchange markets", "international trade financing", "multinational tax management", "derivatives", "foreign currency"]
    },
    "ACFI 804": {
        title: "Derivative Securities and Markets",
        credits: 3,
        description: "This course explores the basic types of derivative instruments (forwards, futures, options, swaps) and their use in the context of financial risk management by investors, firms and financial institutions. Topics include the mechanics of derivatives markets, practical and theoretical aspects of hedging and speculating using derivatives, and methodologies for pricing derivatives.",
        prerequisites: "ACFI 801 with a minimum grade of B- and ACFI 802 with a minimum grade of B-.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["forwards", "futures", "options", "swaps", "risk management", "hedging", "derivatives pricing"]
    },
    "ACFI 805": {
        title: "Financial Institutions",
        credits: 3,
        description: "This course explores the financial institutions that create credit and liquidity for businesses and other borrowers, the financial instruments that facilitate credit and liquidity creation, and the markets in which those instruments are sold or traded. Special emphasis is paid to commercial banks.",
        prerequisites: "ACFI 801 with a minimum grade of B- and ACFI 802 with a minimum grade of B-.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["financial institutions", "credit creation", "liquidity", "commercial banks", "financial instruments"]
    },
    "ACFI 806": {
        title: "Financial Modeling and Analytics",
        credits: 3,
        description: "The main objective of the course is to bridge the gap between theory and practice by using software applications and real-world data to solve a variety of financial problems. The course is very 'hands-on' and is expected to help students develop skills that are useful in a variety of jobs in finance, accounting, insurance, and real estate.",
        prerequisites: "ACFI 801 (may be taken concurrently) with a minimum grade of B- and ACFI 802 (may be taken concurrently) with a minimum grade of B-.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["financial modeling", "analytics", "software applications", "real-world data", "hands-on learning"]
    },
    "ACFI 807": {
        title: "Equity Analysis and Firm Valuation",
        credits: 3,
        description: "This course is intended to provide practical tools for analyzing and valuing a company's equity. Primarily an applications course, it covers several valuation models such as market multiples and free cash flow models, and focuses on the implementation of finance theories to valuation problems.",
        gradeMode: "Letter Grading",
        topics: ["equity analysis", "firm valuation", "valuation models", "market multiples", "free cash flow models"]
    },
    "ACFI 820": {
        title: "Tax Planning & Research",
        credits: 3,
        description: "This course covers the history and development of taxation, the role taxes play in financial and managerial decisions, and how taxes motivate people and institutions. The major tax issues inherent in business and financial transactions and their consequences are also explored.",
        gradeMode: "Letter Grading",
        topics: ["tax planning", "tax research", "taxation history", "business taxation", "financial decisions"]
    },
    "ACFI 825": {
        title: "Ethics and Non-Profit Accounting",
        credits: 3,
        description: "This course aims to: (1) increase students understanding of, and sensitivity to, ethical issues in accounting and (2) provide a foundation for the conceptual and practical issues surrounding accounting for not-for-profit entities.",
        equivalent: "ACFI 897",
        gradeMode: "Letter Grading",
        topics: ["ethics in accounting", "non-profit accounting", "ethical reasoning", "corporate governance", "not-for-profit reporting"]
    },
    "ACFI 830": {
        title: "Advanced Auditing",
        credits: 3,
        description: "This course is designed to establish an advanced competence in auditing theory and practice. Specifically, students will gain an in-depth understanding of current academic auditing research and the philosophy of strategic-systems auditing through readings, presentations, case studies, and a service learning project with a local non-profit organization.",
        gradeMode: "Letter Grading",
        topics: ["auditing theory", "auditing practice", "strategic-systems auditing", "auditing research", "case studies"]
    },
    "ACFI 835": {
        title: "Governmental Accounting",
        credits: 3,
        description: "The objective of this course is to provide a foundation for the conceptual and practical issues surrounding accounting for governmental entities. Topics include: planning, budgeting, accounting, and internal and external financial reporting for government organizations.",
        equivalent: "ACFI 895",
        gradeMode: "Letter Grading",
        topics: ["governmental accounting", "budgeting", "government reporting", "public sector accounting"]
    },
    "ACFI 840": {
        title: "Forensic Acctg & Fraud Exam",
        credits: 3,
        description: "This course builds on audit coursework, but is not limited to an audit perspective. It covers the major schemes used to defraud organizations and individuals. Students develop skills in the areas of fraud protection, detection, analysis, and some skills relating to investigations.",
        gradeMode: "Letter Grading",
        topics: ["forensic accounting", "fraud examination", "fraud detection", "fraud protection", "investigations"]
    },
    "ACFI 844": {
        title: "Topics in Advanced Accounting",
        credits: 3,
        description: "Theory and practice of accounting for corporate acquisitions and mergers and the preparation and presentation of consolidated financial statements. Other topics include multinational consolidations, interim reporting and partnership accounting.",
        gradeMode: "Letter Grading",
        topics: ["corporate acquisitions", "mergers", "consolidated financial statements", "multinational consolidations", "partnership accounting"]
    },
    "ACFI 845": {
        title: "International Accounting",
        credits: 3,
        description: "The first goal of this course is to provide an overview of how accounting is practiced differently around the world. The second goal is to understand accounting issues uniquely confronted by companies involved in international business, such as the accounting for foreign currency transactions, the translation of foreign currency financial statements for the purpose of preparing consolidated financial statements, and other issues that are of particular importance to multinational corporations.",
        prerequisites: "ACC 621 with a minimum grade of D-.",
        gradeMode: "Letter Grading",
        topics: ["international accounting", "IFRS", "US GAAP", "foreign currency transactions", "multinational corporations"]
    },
    "ACFI 850": {
        title: "Accounting Theory and Research",
        credits: 3,
        description: "The objective of this course is to study the role of accounting information both in a decision-making and in a performance-evaluation context. This objective will be achieved by studying various accounting theories and the role that research has played in developing and testing those theories.",
        gradeMode: "Letter Grading",
        topics: ["accounting theory", "accounting research", "decision-making", "performance evaluation", "research methodology"]
    },
    "ACFI 860": {
        title: "Advanced Business Law",
        credits: 3,
        description: "Focuses on legal issues such as the formation, management, and operation of corporations, and partnerships, and rights and liabilities of shareholders and partners; as well as an analysis of securities regulations. Also covers the due process and equal protection provisions of the Constitution as they relate to business activities.",
        gradeMode: "Letter Grading",
        topics: ["business law", "corporate law", "partnerships", "securities regulations", "constitutional law"]
    },
    "ACFI 870": {
        title: "Programming in Finance with Quantitative Applications",
        credits: 3,
        description: "This course provides students with tools necessary to manipulate, analyze, and interpret financial data. Programming languages covered may include C++, Python, R, SAS, and Stata. Quantitative applications involving data from Bloomberg, CRSP, and Compustat are incorporated into the material.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["programming", "C++", "Python", "R", "SAS", "Stata", "Bloomberg", "CRSP", "Compustat", "financial data"]
    },
    "ACFI 871": {
        title: "Financial Theory",
        credits: 3,
        description: "This course provides a rigorous overview of modern financial analysis. Topics include valuation, risk analysis, corporate investment decisions, and security analysis and investment management.",
        prerequisites: "ACFI 801 with a minimum grade of B- and ACFI 802 with a minimum grade of B- and ACFI 870 (may be taken concurrently) with a minimum grade of B-.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["financial theory", "valuation", "risk analysis", "corporate investment", "security analysis", "investment management"]
    },
    "ACFI 872": {
        title: "Corporate Financial Reporting",
        credits: 3,
        description: "This course covers the preparation and analysis of financial statements. It focuses on the measuring and reporting of corporate performance for investment decisions, stock valuation, bankers' loan risk assessment, and evaluations of employee performance.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["financial reporting", "financial statements", "corporate performance", "investment decisions", "stock valuation"]
    },
    "ACFI 873": {
        title: "Cases in Finance",
        credits: 3,
        description: "This course is an application of financial knowledge to case studies. A number of Harvard business cases will be analyzed and discussed in detail, including buy vs. rent decisions, corporate governance, weighted average cost of capital calculations and merger and acquisition strategies.",
        prerequisites: "ACFI 801 (may be taken concurrently) with a minimum grade of B- and ACFI 802 (may be taken concurrently) with a minimum grade of B-.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["case studies", "Harvard business cases", "corporate governance", "cost of capital", "merger and acquisition"]
    },
    "ACFI 874": {
        title: "Finance Experience",
        credits: 3,
        description: "This course enhances student knowledge regarding real-life applications of finance concepts, and includes activities such as: Bloomberg Terminal trainings, executive guest speaker talks, and career opportunities in the field. Presentation skills and networking abilities are emphasized.",
        prerequisites: "ACFI 801 (may be taken concurrently) with a minimum grade of B- and ACFI 802 (may be taken concurrently) with a minimum grade of B-.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["finance experience", "Bloomberg Terminal", "guest speakers", "career opportunities", "presentation skills", "networking"]
    },
    "ACFI 890": {
        title: "Accounting Information Systems",
        credits: 3,
        description: "Accounting information systems and the use of computers for decision making with emphasis on sources and types of information and the use of analytical tools in solving accounting management problems.",
        gradeMode: "Letter Grading",
        topics: ["accounting information systems", "computer systems", "decision making", "analytical tools", "management problems"]
    },
    "ACFI 892": {
        title: "Independent Study",
        credits: "1-6",
        description: "Projects, research, and reading programs in areas required for concentration within a specialized master's program in accounting or finance. Approval of the student's plan of study by adviser or by proposed instructor required.",
        repeatRule: "May be repeated for a maximum of 6 credits.",
        gradeMode: "Letter Grading",
        topics: ["independent study", "research projects", "specialized programs", "advisor approval"]
    },
    "ACFI 896": {
        title: "Topics",
        credits: 3,
        description: "Special topics.",
        repeatRule: "May be repeated for a maximum of 12 credits.",
        gradeMode: "Letter Grading",
        topics: ["special topics", "various subjects"]
    }
};

// Chat functionality
let chatMessages = document.getElementById('chatMessages');
let userInput = document.getElementById('userInput');

// Initialize RAG chatbot
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize RAG system
    await initializeRAGSystem();
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
});

async function initializeRAGSystem() {
    try {
        // Initialize data processor and RAG chatbot silently
        dataProcessor = new CourseDataProcessor();
        ragChatbot = new RAGChatbot(dataProcessor);
        
        // Initialize the system
        const success = await ragChatbot.initialize();
        
        if (success) {
            isInitialized = true;
        }
    } catch (error) {
        console.error('RAG initialization error:', error);
        // Silently fall back to legacy system
    }
}

function askQuestion(question) {
    userInput.value = question;
    sendMessage();
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and respond
    try {
        const response = await processMessage(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        console.error('Message processing error:', error);
        hideTypingIndicator();
        addMessage('I apologize, but I encountered an error processing your request. Please try again.', 'bot');
    }
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator-message';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator-message');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function processMessage(message) {
    // Use RAG system if initialized
    if (isInitialized && ragChatbot) {
        try {
            return await ragChatbot.processQuery(message);
        } catch (error) {
            console.error('RAG processing error:', error);
            // Fall back to legacy system
            return processMessageLegacy(message);
        }
    } else {
        // Use legacy system as fallback
        return processMessageLegacy(message);
    }
}

function processMessageLegacy(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific course queries
    for (const courseCode in acfiCourses) {
        if (lowerMessage.includes(courseCode.toLowerCase()) || 
            lowerMessage.includes(acfiCourses[courseCode].title.toLowerCase())) {
            return formatCourseResponse(courseCode, acfiCourses[courseCode]);
        }
    }
    
    // Handle general queries
    if (lowerMessage.includes('list') && (lowerMessage.includes('course') || lowerMessage.includes('all'))) {
        return listAllCourses();
    }
    
    if (lowerMessage.includes('prerequisite') || lowerMessage.includes('prereq')) {
        return getPrerequisiteInfo();
    }
    
    if (lowerMessage.includes('finance') && !lowerMessage.includes('accounting')) {
        return getFinanceCourses();
    }
    
    if (lowerMessage.includes('accounting') && !lowerMessage.includes('finance')) {
        return getAccountingCourses();
    }
    
    if (lowerMessage.includes('credit') || lowerMessage.includes('hour')) {
        return getCreditInfo();
    }
    
    if (lowerMessage.includes('derivative') || lowerMessage.includes('option') || lowerMessage.includes('future')) {
        return searchByTopic('derivative');
    }
    
    if (lowerMessage.includes('international') || lowerMessage.includes('global')) {
        return searchByTopic('international');
    }
    
    if (lowerMessage.includes('audit') || lowerMessage.includes('fraud')) {
        return searchByTopic('audit');
    }
    
    if (lowerMessage.includes('modeling') || lowerMessage.includes('programming')) {
        return searchByTopic('modeling');
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return getHelpInfo();
    }
    
    // Default response for unrecognized queries
    return getDefaultResponse(lowerMessage);
}

function formatCourseResponse(courseCode, course) {
    let response = `
        <div class="course-card">
            <div class="course-title">${courseCode} - ${course.title}</div>
            <div class="course-credits">Credits: ${course.credits}</div>
            <div class="course-description">${course.description}</div>
            <div class="course-details">
    `;
    
    if (course.prerequisites) {
        response += `<p><strong>Prerequisites:</strong> ${course.prerequisites}</p>`;
    }
    
    if (course.repeatRule) {
        response += `<p><strong>Repeat Rule:</strong> ${course.repeatRule}</p>`;
    }
    
    if (course.mutualExclusion) {
        response += `<p><strong>Mutual Exclusion:</strong> ${course.mutualExclusion}</p>`;
    }
    
    if (course.equivalent) {
        response += `<p><strong>Equivalent:</strong> ${course.equivalent}</p>`;
    }
    
    response += `<p><strong>Grade Mode:</strong> ${course.gradeMode}</p>`;
    
    if (course.topics && course.topics.length > 0) {
        response += `<p><strong>Key Topics:</strong> ${course.topics.join(', ')}</p>`;
    }
    
    response += `</div></div>`;
    
    return response;
}

function listAllCourses() {
    let response = "<h3>All ACFI Courses:</h3><ul>";
    for (const courseCode in acfiCourses) {
        const course = acfiCourses[courseCode];
        response += `<li><strong>${courseCode}</strong> - ${course.title} (${course.credits} credits)</li>`;
    }
    response += "</ul>";
    return response;
}

function getPrerequisiteInfo() {
    let response = "<h3>Courses with Prerequisites:</h3>";
    let hasPrereqs = false;
    
    for (const courseCode in acfiCourses) {
        const course = acfiCourses[courseCode];
        if (course.prerequisites) {
            hasPrereqs = true;
            response += `
                <div class="course-card">
                    <div class="course-title">${courseCode} - ${course.title}</div>
                    <div class="course-details">
                        <p><strong>Prerequisites:</strong> ${course.prerequisites}</p>
                    </div>
                </div>
            `;
        }
    }
    
    if (!hasPrereqs) {
        response += "<p>Most ACFI courses don't have specific prerequisites listed, though some advanced courses require completion of foundational courses like ACFI 801 and 802.</p>";
    }
    
    return response;
}

function getFinanceCourses() {
    const financeKeywords = ['finance', 'investment', 'corporate', 'derivative', 'portfolio', 'valuation', 'capital'];
    let response = "<h3>Finance-Related Courses:</h3>";
    
    for (const courseCode in acfiCourses) {
        const course = acfiCourses[courseCode];
        const isFinance = financeKeywords.some(keyword => 
            course.title.toLowerCase().includes(keyword) || 
            course.description.toLowerCase().includes(keyword)
        );
        
        if (isFinance) {
            response += `
                <div class="course-card">
                    <div class="course-title">${courseCode} - ${course.title}</div>
                    <div class="course-credits">Credits: ${course.credits}</div>
                    <div class="course-description">${course.description}</div>
                </div>
            `;
        }
    }
    
    return response;
}

function getAccountingCourses() {
    const accountingKeywords = ['accounting', 'audit', 'financial reporting', 'tax', 'governmental', 'non-profit', 'fraud'];
    let response = "<h3>Accounting-Related Courses:</h3>";
    
    for (const courseCode in acfiCourses) {
        const course = acfiCourses[courseCode];
        const isAccounting = accountingKeywords.some(keyword => 
            course.title.toLowerCase().includes(keyword) || 
            course.description.toLowerCase().includes(keyword)
        );
        
        if (isAccounting) {
            response += `
                <div class="course-card">
                    <div class="course-title">${courseCode} - ${course.title}</div>
                    <div class="course-credits">Credits: ${course.credits}</div>
                    <div class="course-description">${course.description}</div>
                </div>
            `;
        }
    }
    
    return response;
}

function getCreditInfo() {
    let response = "<h3>Credit Hour Information:</h3>";
    let creditCounts = {};
    
    for (const courseCode in acfiCourses) {
        const credits = acfiCourses[courseCode].credits;
        creditCounts[credits] = (creditCounts[credits] || 0) + 1;
    }
    
    response += "<ul>";
    for (const credits in creditCounts) {
        response += `<li><strong>${credits} credits:</strong> ${creditCounts[credits]} courses</li>`;
    }
    response += "</ul>";
    
    response += "<p>Most ACFI courses are 3 credits. ACFI 892 (Independent Study) offers variable credits from 1-6.</p>";
    
    return response;
}

function searchByTopic(topic) {
    let response = `<h3>Courses related to "${topic}":</h3>`;
    let foundCourses = false;
    
    for (const courseCode in acfiCourses) {
        const course = acfiCourses[courseCode];
        const searchText = (course.title + ' ' + course.description + ' ' + (course.topics ? course.topics.join(' ') : '')).toLowerCase();
        
        if (searchText.includes(topic.toLowerCase())) {
            foundCourses = true;
            response += `
                <div class="course-card">
                    <div class="course-title">${courseCode} - ${course.title}</div>
                    <div class="course-credits">Credits: ${course.credits}</div>
                    <div class="course-description">${course.description}</div>
                </div>
            `;
        }
    }
    
    if (!foundCourses) {
        response += `<p>No courses found specifically related to "${topic}". Try asking about specific course codes or browse all courses.</p>`;
    }
    
    return response;
}

function getHelpInfo() {
    return `
        <h3>How I can help you:</h3>
        <ul>
            <li><strong>Course Information:</strong> Ask about specific courses like "Tell me about ACFI 801" or "What is Corporate Finance?"</li>
            <li><strong>Prerequisites:</strong> Ask "What are the prerequisite courses?" or "What courses require ACFI 801?"</li>
            <li><strong>Course Lists:</strong> Ask "List all courses" or "Show me finance courses"</li>
            <li><strong>Topics:</strong> Search by topic like "derivative securities" or "international accounting"</li>
            <li><strong>Credits:</strong> Ask about credit hours and course requirements</li>
        </ul>
        <p>Try asking specific questions about ACFI courses, and I'll provide detailed information!</p>
    `;
}

function getDefaultResponse(message) {
    const suggestions = [
        "Try asking about a specific course like 'ACFI 801' or 'Corporate Finance'",
        "Ask 'List all courses' to see all available ACFI courses",
        "Ask about prerequisites or course requirements",
        "Search by topic like 'international', 'derivatives', or 'accounting'"
    ];
    
    return `
        <p>I'm not sure about that specific question. Here are some things you can try:</p>
        <ul>
            ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
        </ul>
        <p>Feel free to ask me anything about ACFI courses at UNH!</p>
    `;
}

// Removed RAG system utility functions to keep interface clean
