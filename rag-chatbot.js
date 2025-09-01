/**
 * RAG-based Chatbot for UNH Course Catalog
 * Uses retrieval-augmented generation for intelligent responses
 */

class RAGChatbot {
    constructor(dataProcessor) {
        this.dataProcessor = dataProcessor;
        this.conversationHistory = [];
        this.responseTemplates = this.initializeResponseTemplates();
        this.initialized = false;
    }

    /**
     * Initialize the chatbot with data
     */
    async initialize() {
        try {
            console.log('Initializing RAG Chatbot...');
            await this.dataProcessor.fetchCourseData();
            this.initialized = true;
            console.log('RAG Chatbot initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize RAG Chatbot:', error);
            return false;
        }
    }

    /**
     * Process user query using RAG approach
     */
    async processQuery(query) {
        if (!this.initialized) {
            await this.initialize();
        }

        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            content: query,
            timestamp: new Date()
        });

        try {
            // Step 1: Retrieve relevant information
            const retrievedInfo = await this.retrieveRelevantInfo(query);
            
            // Step 2: Generate response based on retrieved information
            const response = this.generateResponse(query, retrievedInfo);
            
            // Add response to conversation history
            this.conversationHistory.push({
                type: 'assistant',
                content: response,
                timestamp: new Date(),
                sources: retrievedInfo.map(info => info.courseCode).filter((code, index, self) => self.indexOf(code) === index)
            });

            return response;
        } catch (error) {
            console.error('Error processing query:', error);
            return this.getErrorResponse();
        }
    }

    /**
     * Retrieve relevant information using semantic search
     */
    async retrieveRelevantInfo(query) {
        // Perform semantic search
        const searchResults = this.dataProcessor.semanticSearch(query, 8);
        
        // Filter and rank results
        const relevantInfo = searchResults
            .filter(result => result.similarity > 0.1) // Minimum similarity threshold
            .map(result => ({
                courseCode: result.courseCode,
                course: result.course,
                relevantText: result.text,
                similarity: result.similarity,
                metadata: result.metadata
            }));

        return relevantInfo;
    }

    /**
     * Generate response based on retrieved information
     */
    generateResponse(query, retrievedInfo) {
        const queryLower = query.toLowerCase();
        
        // Determine query intent
        const intent = this.classifyIntent(queryLower);
        
        // Generate response based on intent and retrieved information
        switch (intent.type) {
            case 'specific_course':
                return this.generateCourseSpecificResponse(intent.courseCode, retrievedInfo);
            
            case 'list_courses':
                return this.generateCourseListResponse(intent.category, retrievedInfo);
            
            case 'prerequisites':
                return this.generatePrerequisitesResponse(retrievedInfo);
            
            case 'comparison':
                return this.generateComparisonResponse(intent.courses, retrievedInfo);
            
            case 'topic_search':
                return this.generateTopicResponse(intent.topic, retrievedInfo);
            
            case 'general_info':
                return this.generateGeneralInfoResponse(retrievedInfo);
            
            default:
                return this.generateSemanticResponse(query, retrievedInfo);
        }
    }

    /**
     * Classify user intent from query
     */
    classifyIntent(query) {
        // Course code pattern
        const courseCodeMatch = query.match(/acfi\s*(\d{3})/i);
        if (courseCodeMatch) {
            return {
                type: 'specific_course',
                courseCode: `ACFI ${courseCodeMatch[1]}`
            };
        }

        // List requests
        if (query.includes('list') && (query.includes('course') || query.includes('all'))) {
            const category = query.includes('finance') ? 'finance' : 
                           query.includes('accounting') ? 'accounting' : 'all';
            return { type: 'list_courses', category };
        }

        // Prerequisites
        if (query.includes('prerequisite') || query.includes('prereq')) {
            return { type: 'prerequisites' };
        }

        // Comparison
        const multipleCourses = (query.match(/acfi\s*\d{3}/gi) || []).length > 1;
        if (multipleCourses || query.includes('compare') || query.includes('difference')) {
            return { type: 'comparison', courses: query.match(/acfi\s*\d{3}/gi) || [] };
        }

        // Topic search
        const topics = ['derivative', 'audit', 'international', 'tax', 'finance', 'accounting', 'ethics', 'fraud'];
        const matchedTopic = topics.find(topic => query.includes(topic));
        if (matchedTopic) {
            return { type: 'topic_search', topic: matchedTopic };
        }

        // General info requests
        if (query.includes('credit') || query.includes('hour') || query.includes('grade') || query.includes('repeat')) {
            return { type: 'general_info' };
        }

        return { type: 'semantic_search' };
    }

    /**
     * Generate course-specific response
     */
    generateCourseSpecificResponse(courseCode, retrievedInfo) {
        const courseInfo = retrievedInfo.find(info => info.courseCode === courseCode);
        
        if (!courseInfo) {
            return `I couldn't find information about ${courseCode}. Please check the course code and try again.`;
        }

        const course = courseInfo.course;
        return this.formatCourseResponse(course, retrievedInfo);
    }

    /**
     * Generate course list response
     */
    generateCourseListResponse(category, retrievedInfo) {
        let courses;
        let title;
        
        if (category === 'finance') {
            courses = this.dataProcessor.getCoursesByCategory('finance');
            title = 'Finance-Related Courses';
        } else if (category === 'accounting') {
            courses = this.dataProcessor.getCoursesByCategory('accounting');
            title = 'Accounting-Related Courses';
        } else {
            courses = this.dataProcessor.getAllCourses();
            title = 'All ACFI Courses';
        }

        let response = `<h3>${title}:</h3>`;
        
        if (courses.length === 0) {
            response += '<p>No courses found for this category.</p>';
        } else {
            courses.forEach(course => {
                response += `
                    <div class="course-card">
                        <div class="course-title">${course.code} - ${course.title}</div>
                        <div class="course-credits">Credits: ${course.credits}</div>
                        <div class="course-description">${course.description}</div>
                    </div>
                `;
            });
        }

        return response;
    }

    /**
     * Generate prerequisites response
     */
    generatePrerequisitesResponse(retrievedInfo) {
        const coursesWithPrereqs = retrievedInfo
            .filter(info => info.metadata.type === 'prerequisites')
            .map(info => info.course)
            .filter((course, index, self) => self.findIndex(c => c.code === course.code) === index);

        if (coursesWithPrereqs.length === 0) {
            return '<p>Most ACFI courses do not have specific prerequisites listed. However, some advanced courses may require foundational knowledge.</p>';
        }

        let response = '<h3>Courses with Prerequisites:</h3>';
        coursesWithPrereqs.forEach(course => {
            response += `
                <div class="course-card">
                    <div class="course-title">${course.code} - ${course.title}</div>
                    <div class="course-details">
                        <p><strong>Prerequisites:</strong> ${course.prerequisites}</p>
                    </div>
                </div>
            `;
        });

        return response;
    }

    /**
     * Generate comparison response
     */
    generateComparisonResponse(courses, retrievedInfo) {
        if (courses.length < 2) {
            return 'Please specify at least two courses to compare.';
        }

        let response = '<h3>Course Comparison:</h3>';
        
        courses.forEach(courseCode => {
            const normalizedCode = courseCode.replace(/\s+/g, ' ').toUpperCase();
            const course = this.dataProcessor.getCourse(normalizedCode);
            
            if (course) {
                response += this.formatCourseResponse(course, retrievedInfo);
            }
        });

        return response;
    }

    /**
     * Generate topic-based response
     */
    generateTopicResponse(topic, retrievedInfo) {
        const relevantCourses = retrievedInfo
            .filter(info => info.relevantText.toLowerCase().includes(topic.toLowerCase()))
            .map(info => info.course)
            .filter((course, index, self) => self.findIndex(c => c.code === course.code) === index);

        if (relevantCourses.length === 0) {
            return `<p>No courses found specifically related to "${topic}". Try asking about specific course codes or browse all courses.</p>`;
        }

        let response = `<h3>Courses related to "${topic}":</h3>`;
        relevantCourses.forEach(course => {
            response += `
                <div class="course-card">
                    <div class="course-title">${course.code} - ${course.title}</div>
                    <div class="course-credits">Credits: ${course.credits}</div>
                    <div class="course-description">${course.description}</div>
                </div>
            `;
        });

        return response;
    }

    /**
     * Generate general info response
     */
    generateGeneralInfoResponse(retrievedInfo) {
        const allCourses = this.dataProcessor.getAllCourses();
        const creditCounts = {};
        
        allCourses.forEach(course => {
            const credits = course.credits;
            creditCounts[credits] = (creditCounts[credits] || 0) + 1;
        });

        let response = '<h3>Course Information Summary:</h3>';
        response += '<h4>Credit Distribution:</h4><ul>';
        
        Object.entries(creditCounts).forEach(([credits, count]) => {
            response += `<li><strong>${credits} credits:</strong> ${count} courses</li>`;
        });
        
        response += '</ul>';
        response += '<p>Most ACFI courses are 3 credits and use Letter Grading. Some courses may be repeated for additional credits.</p>';

        return response;
    }

    /**
     * Generate semantic response based on retrieved information
     */
    generateSemanticResponse(query, retrievedInfo) {
        if (retrievedInfo.length === 0) {
            return this.getDefaultResponse();
        }

        // Use the most relevant information
        const topResults = retrievedInfo.slice(0, 3);
        const uniqueCourses = [...new Set(topResults.map(info => info.courseCode))];

        if (uniqueCourses.length === 1) {
            // Single course focus
            const course = this.dataProcessor.getCourse(uniqueCourses[0]);
            return this.formatCourseResponse(course, retrievedInfo);
        } else {
            // Multiple courses or general topic
            let response = '<h3>Related Information:</h3>';
            
            uniqueCourses.slice(0, 3).forEach(courseCode => {
                const course = this.dataProcessor.getCourse(courseCode);
                if (course) {
                    response += `
                        <div class="course-card">
                            <div class="course-title">${course.code} - ${course.title}</div>
                            <div class="course-credits">Credits: ${course.credits}</div>
                            <div class="course-description">${course.description}</div>
                        </div>
                    `;
                }
            });

            return response;
        }
    }

    /**
     * Format course response
     */
    formatCourseResponse(course, retrievedInfo) {
        let response = `
            <div class="course-card">
                <div class="course-title">${course.code} - ${course.title}</div>
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
        response += `</div></div>`;
        
        return response;
    }

    /**
     * Get default response for unrecognized queries
     */
    getDefaultResponse() {
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

    /**
     * Get error response
     */
    getErrorResponse() {
        return `
            <p>I'm sorry, I encountered an error processing your request. Please try asking your question differently or contact support if the problem persists.</p>
            <p>You can try:</p>
            <ul>
                <li>Asking about specific course codes (e.g., "ACFI 801")</li>
                <li>Requesting course lists by category</li>
                <li>Searching for topics like "derivatives" or "accounting"</li>
            </ul>
        `;
    }

    /**
     * Initialize response templates
     */
    initializeResponseTemplates() {
        return {
            greeting: "Hello! I'm your Course Catalog Assistant. I can help you find information about ACFI courses using real-time data from the UNH catalog.",
            help: "I can help you with course information, prerequisites, credit requirements, and topic-based searches.",
            dataStatus: () => {
                const status = this.dataProcessor.getDataStatus();
                return `Data last updated: ${status.lastUpdated ? status.lastUpdated.toLocaleString() : 'Never'}. Total courses: ${status.totalCourses}`;
            }
        };
    }

    /**
     * Get conversation history
     */
    getConversationHistory() {
        return this.conversationHistory;
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Get system status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            dataStatus: this.dataProcessor.getDataStatus(),
            conversationLength: this.conversationHistory.length
        };
    }
}

// Export for use in other modules
window.RAGChatbot = RAGChatbot;
