/**
 * RAG-based Data Processor for UNH Course Catalog
 * Fetches, processes, and stores course information from the live catalog
 */

class CourseDataProcessor {
    constructor() {
        this.courses = new Map();
        this.embeddings = new Map();
        this.lastUpdated = null;
        this.catalogUrl = 'https://catalog.unh.edu/graduate/course-descriptions/acfi/';
    }

    /**
     * Fetch course data from UNH catalog
     * Note: Due to CORS restrictions, this would typically run on a backend server
     * For demo purposes, we'll use the provided static data with dynamic processing
     */
    async fetchCourseData() {
        try {
            // In a real implementation, this would fetch from the actual URL
            // For now, we'll use the catalog data provided in the web search results
            const catalogData = this.parseStaticCatalogData();
            await this.processCourseData(catalogData);
            this.lastUpdated = new Date();
            console.log('Course data updated successfully');
            return true;
        } catch (error) {
            console.error('Error fetching course data:', error);
            return false;
        }
    }

    /**
     * Parse the static catalog data (simulating web scraping)
     */
    parseStaticCatalogData() {
        return {
            courses: [
                {
                    code: "ACFI 801",
                    title: "Corporate Finance",
                    credits: 3,
                    description: "This course provides the foundation of corporate finance. Topics include investment criteria, capital structure, valuation, mergers and acquisitions, real options, and payout policy.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 802",
                    title: "Investments",
                    credits: 3,
                    description: "This course provides an overview of several important topics in investments: securities and markets, asset pricing theory, stock analysis and valuation, fixed income securities, stock options, and applied portfolio management.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 803",
                    title: "International Financial Management",
                    credits: 3,
                    description: "This course explores the financial management of firms operating in a global environment. Topics typically include foreign exchange markets, the financing of international trade, multinational tax management, derivatives used to mitigate international exposure, and the financial impact of foreign currency usage.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: "No credit for students who have taken ADMN 846."
                },
                {
                    code: "ACFI 804",
                    title: "Derivative Securities and Markets",
                    credits: 3,
                    description: "This course explores the basic types of derivative instruments (forwards, futures, options, swaps) and their use in the context of financial risk management by investors, firms and financial institutions. Topics include the mechanics of derivatives markets, practical and theoretical aspects of hedging and speculating using derivatives, and methodologies for pricing derivatives.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: "ACFI 801 with a minimum grade of B- and ACFI 802 with a minimum grade of B-.",
                    mutualExclusion: null
                },
                {
                    code: "ACFI 805",
                    title: "Financial Institutions",
                    credits: 3,
                    description: "This course explores the financial institutions that create credit and liquidity for businesses and other borrowers, the financial instruments that facilitate credit and liquidity creation, and the markets in which those instruments are sold or traded. Special emphasis is paid to commercial banks.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: "ACFI 801 with a minimum grade of B- and ACFI 802 with a minimum grade of B-.",
                    mutualExclusion: null
                },
                {
                    code: "ACFI 806",
                    title: "Financial Modeling and Analytics",
                    credits: 3,
                    description: "The main objective of the course is to bridge the gap between theory and practice by using software applications and real-world data to solve a variety of financial problems. The course is very 'hands-on' and is expected to help students develop skills that are useful in a variety of jobs in finance, accounting, insurance, and real estate.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: "ACFI 801 (may be taken concurrently) with a minimum grade of B- and ACFI 802 (may be taken concurrently) with a minimum grade of B-.",
                    mutualExclusion: null
                },
                {
                    code: "ACFI 807",
                    title: "Equity Analysis and Firm Valuation",
                    credits: 3,
                    description: "This course is intended to provide practical tools for analyzing and valuing a company's equity. Primarily an applications course, it covers several valuation models such as market multiples and free cash flow models, and focuses on the implementation of finance theories to valuation problems.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 820",
                    title: "Tax Planning & Research",
                    credits: 3,
                    description: "This course covers the history and development of taxation, the role taxes play in financial and managerial decisions, and how taxes motivate people and institutions. The major tax issues inherent in business and financial transactions and their consequences are also explored.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 825",
                    title: "Ethics and Non-Profit Accounting",
                    credits: 3,
                    description: "This course aims to: (1) increase students understanding of, and sensitivity to, ethical issues in accounting and (2) provide a foundation for the conceptual and practical issues surrounding accounting for not-for-profit entities. Ethics topics include:ethical reasoning and cognitive processes, business ethics and corporate governance, ethics in accounting judgments and decisions, and legal/regulatory/professional responsibilities of accountants. Not-for-profit accounting topics include: planning, budgeting, accounting, and internal and external financial reporting for not-for-profit entities.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null,
                    equivalent: "ACFI 897"
                },
                {
                    code: "ACFI 830",
                    title: "Advanced Auditing",
                    credits: 3,
                    description: "This course is designed to establish an advanced competence in auditing theory and practice. Specifically, students will gain an in-depth understanding of current academic auditing research and the philosophy of strategic-systems auditing through readings, presentations, case studies, and a service learning project with a local non-profit organization.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 835",
                    title: "Governmental Accounting",
                    credits: 3,
                    description: "The objective of this course is to provide a foundation for the conceptual and practical issues surrounding accounting for governmental entities. Topics include: planning, budgeting, accounting, and internal and external financial reporting for government organizations.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null,
                    equivalent: "ACFI 895"
                },
                {
                    code: "ACFI 840",
                    title: "Forensic Acctg & Fraud Exam",
                    credits: 3,
                    description: "This course builds on audit coursework, but is not limited to an audit perspective. It covers the major schemes used to defraud organizations and individuals. Students develop skills in the areas of fraud protection, detection, analysis, and some skills relating to investigations.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 844",
                    title: "Topics in Advanced Accounting",
                    credits: 3,
                    description: "Theory and practice of accounting for corporate acquisitions and mergers and the preparation and presentation of consolidated financial statements. Other topics include multinational consolidations, interim reporting and partnership accounting.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 845",
                    title: "International Accounting",
                    credits: 3,
                    description: "The first goal of this course is to provide an overview of how accounting is practiced differently around the world. This goal is accomplished by the first part of the course, which mainly discusses differences between International Financial Reporting Standards (IFRS) and U.S. Generally Accepted Accounting Principles (U.S. GAAP). The second goal of this course is to understand accounting issues uniquely confronted by companies involved in international business, such as the accounting for foreign currency transactions, the translation of foreign currency financial statements for the purpose of preparing consolidated financial statements, and other issues that are of particular importance to multinational corporations.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: "ACC 621 with a minimum grade of D-.",
                    mutualExclusion: null
                },
                {
                    code: "ACFI 850",
                    title: "Accounting Theory and Research",
                    credits: 3,
                    description: "The objective of this course is to study the role of accounting information both in a decision-making and in a performance-evaluation context. This objective will be achieved by studying various accounting theories and the role that research has played in developing and testing those theories.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 860",
                    title: "Advanced Business Law",
                    credits: 3,
                    description: "Focuses on legal issues such as the formation, management, and operation of corporations, and partnerships, and rights and liabilities of shareholders and partners; as well as an analysis of securities regulations. Also covers the due process and equal protection provisions of the Constitution as they relate to business activities. Includes an in depth analysis of the Uniform Commercial Code such as sales, secured transactions, and negotiable instruments. Real and personal property issues are also explored.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 870",
                    title: "Programming in Finance with Quantitative Applications",
                    credits: 3,
                    description: "This course provides students with tools necessary to manipulate, analyze, and interpret financial data. Programming languages covered may include C++, Python, R, SAS, and Stata. Quantitative applications involving data from Bloomberg, CRSP, and Compustat are incorporated into the material.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 871",
                    title: "Financial Theory",
                    credits: 3,
                    description: "This course provides a rigorous overview of modern financial analysis. Topics include valuation, risk analysis, corporate investment decisions, and security analysis and investment management.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: "ACFI 801 with a minimum grade of B- and ACFI 802 with a minimum grade of B- and ACFI 870 (may be taken concurrently) with a minimum grade of B-.",
                    mutualExclusion: null
                },
                {
                    code: "ACFI 872",
                    title: "Corporate Financial Reporting",
                    credits: 3,
                    description: "This course covers the preparation and analysis of financial statements. It focuses on the measuring and reporting of corporate performance for investment decisions, stock valuation, bankers' loan risk assessment, and evaluations of employee performance. Emphasizes the required interdisciplinary understanding of business. Concepts from finance and economics (e.g., cash flow discounting, risk, valuation, and criteria for choosing among alternative investments) place accounting in the context of the business enterprise.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 873",
                    title: "Cases in Finance",
                    credits: 3,
                    description: "This course is an application of financial knowledge to case studies. A number of Harvard business cases will be analyzed and discussed in detail, including buy vs. rent decisions, corporate governance, weighted average cost of capital calculations and merger and acquisition strategies.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: "ACFI 801 (may be taken concurrently) with a minimum grade of B- and ACFI 802 (may be taken concurrently) with a minimum grade of B-.",
                    mutualExclusion: null
                },
                {
                    code: "ACFI 874",
                    title: "Finance Experience",
                    credits: 3,
                    description: "This course enhances student knowledge regarding real-life applications of finance concepts, and includes activities such as: Bloomberg Terminal trainings, executive guest speaker talks, and career opportunities in the field. Presentation skills and networking abilities are emphasized.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: "ACFI 801 (may be taken concurrently) with a minimum grade of B- and ACFI 802 (may be taken concurrently) with a minimum grade of B-.",
                    mutualExclusion: null
                },
                {
                    code: "ACFI 890",
                    title: "Accounting Information Systems",
                    credits: 3,
                    description: "Accounting information systems and the use of computers for decision making with emphasis on sources and types of information and the use of analytical tools in solving accounting management problems.",
                    repeatRule: null,
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 892",
                    title: "Independent Study",
                    credits: "1-6",
                    description: "Projects, research, and reading programs in areas required for concentration within a specialized master's program in accounting or finance. Approval of the student's plan of study by adviser or by proposed instructor required.",
                    repeatRule: "May be repeated for a maximum of 6 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                },
                {
                    code: "ACFI 896",
                    title: "Topics",
                    credits: 3,
                    description: "Special topics.",
                    repeatRule: "May be repeated for a maximum of 12 credits.",
                    gradeMode: "Letter Grading",
                    prerequisites: null,
                    mutualExclusion: null
                }
            ]
        };
    }

    /**
     * Process and store course data with embeddings for semantic search
     */
    async processCourseData(catalogData) {
        for (const course of catalogData.courses) {
            // Store course data
            this.courses.set(course.code, course);
            
            // Create text chunks for embedding
            const textChunks = this.createTextChunks(course);
            
            // Generate embeddings for each chunk (simplified for demo)
            const embeddings = await this.generateEmbeddings(textChunks);
            
            this.embeddings.set(course.code, {
                chunks: textChunks,
                embeddings: embeddings
            });
        }
    }

    /**
     * Create text chunks for better semantic search
     */
    createTextChunks(course) {
        const chunks = [];
        
        // Basic course info chunk
        chunks.push({
            type: 'basic_info',
            text: `${course.code} ${course.title}: ${course.description}`,
            metadata: { type: 'description', courseCode: course.code }
        });
        
        // Prerequisites chunk
        if (course.prerequisites) {
            chunks.push({
                type: 'prerequisites',
                text: `Prerequisites for ${course.code}: ${course.prerequisites}`,
                metadata: { type: 'prerequisites', courseCode: course.code }
            });
        }
        
        // Credits and grading chunk
        chunks.push({
            type: 'logistics',
            text: `${course.code} is worth ${course.credits} credits and uses ${course.gradeMode}`,
            metadata: { type: 'logistics', courseCode: course.code }
        });
        
        // Additional rules chunk
        if (course.repeatRule || course.mutualExclusion || course.equivalent) {
            let rulesText = `Additional rules for ${course.code}: `;
            if (course.repeatRule) rulesText += course.repeatRule + ' ';
            if (course.mutualExclusion) rulesText += course.mutualExclusion + ' ';
            if (course.equivalent) rulesText += `Equivalent to ${course.equivalent}`;
            
            chunks.push({
                type: 'rules',
                text: rulesText,
                metadata: { type: 'rules', courseCode: course.code }
            });
        }
        
        return chunks;
    }

    /**
     * Generate simple word-based embeddings for semantic search
     * In a real implementation, this would use a proper embedding model
     */
    async generateEmbeddings(textChunks) {
        return textChunks.map(chunk => {
            // Simple word frequency vector (TF-IDF approximation)
            const words = chunk.text.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(word => word.length > 2);
            
            const wordFreq = {};
            words.forEach(word => {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            });
            
            return {
                chunkId: chunk.metadata.courseCode + '_' + chunk.type,
                vector: wordFreq,
                text: chunk.text,
                metadata: chunk.metadata
            };
        });
    }

    /**
     * Semantic search using cosine similarity
     */
    semanticSearch(query, topK = 5) {
        const queryWords = query.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        const queryVector = {};
        queryWords.forEach(word => {
            queryVector[word] = (queryVector[word] || 0) + 1;
        });
        
        const results = [];
        
        // Search through all embeddings
        for (const [courseCode, courseEmbeddings] of this.embeddings.entries()) {
            for (const embedding of courseEmbeddings.embeddings) {
                const similarity = this.cosineSimilarity(queryVector, embedding.vector);
                if (similarity > 0) {
                    results.push({
                        courseCode,
                        similarity,
                        text: embedding.text,
                        metadata: embedding.metadata,
                        course: this.courses.get(courseCode)
                    });
                }
            }
        }
        
        // Sort by similarity and return top results
        return results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(vecA, vecB) {
        const wordsA = Object.keys(vecA);
        const wordsB = Object.keys(vecB);
        const allWords = new Set([...wordsA, ...wordsB]);
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (const word of allWords) {
            const a = vecA[word] || 0;
            const b = vecB[word] || 0;
            
            dotProduct += a * b;
            normA += a * a;
            normB += b * b;
        }
        
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Get course by code
     */
    getCourse(courseCode) {
        return this.courses.get(courseCode.toUpperCase());
    }

    /**
     * Get all courses
     */
    getAllCourses() {
        return Array.from(this.courses.values());
    }

    /**
     * Get courses by category
     */
    getCoursesByCategory(category) {
        const categoryKeywords = {
            'finance': ['finance', 'investment', 'corporate', 'derivative', 'portfolio', 'valuation', 'capital', 'securities', 'markets'],
            'accounting': ['accounting', 'audit', 'financial reporting', 'tax', 'governmental', 'non-profit', 'fraud', 'ethics']
        };
        
        const keywords = categoryKeywords[category.toLowerCase()] || [];
        if (keywords.length === 0) return [];
        
        return this.getAllCourses().filter(course => {
            const searchText = (course.title + ' ' + course.description).toLowerCase();
            return keywords.some(keyword => searchText.includes(keyword));
        });
    }

    /**
     * Get data freshness status
     */
    getDataStatus() {
        return {
            lastUpdated: this.lastUpdated,
            totalCourses: this.courses.size,
            totalEmbeddings: this.embeddings.size,
            catalogSource: this.catalogUrl
        };
    }
}

// Export for use in other modules
window.CourseDataProcessor = CourseDataProcessor;
