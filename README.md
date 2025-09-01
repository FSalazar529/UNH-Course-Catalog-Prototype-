# UNH Course Catalog Assistant (RAG-Powered)

An intelligent chatbot prototype using Retrieval-Augmented Generation (RAG) technology that helps students find information about University of New Hampshire's Accounting and Finance (ACFI) graduate courses. The system dynamically processes course data from the [UNH Catalog](https://catalog.unh.edu/graduate/course-descriptions/acfi/) to provide accurate, up-to-date responses.

## Features

### 🤖 RAG-Powered Intelligence
- **Semantic Search**: Advanced natural language understanding using embedding-based similarity
- **Dynamic Data Processing**: Real-time course information from UNH catalog
- **Context-Aware Responses**: Intelligent retrieval and generation based on query intent
- **Conversation Memory**: Maintains context throughout the conversation

### 📚 Course Information
- **Comprehensive Details**: Course descriptions, prerequisites, credits, and learning objectives
- **Smart Search**: Search by course code, course name, or topic keywords
- **Course Comparison**: Compare multiple courses side-by-side
- **Category Filtering**: Find courses by discipline (finance vs accounting)

### 🎨 User Experience
- **Interactive UI**: Modern, responsive design with UNH branding
- **Real-time Updates**: System status indicators and data freshness information
- **Quick Actions**: Pre-built buttons for common queries
- **Error Handling**: Graceful fallback to cached data when needed

## How to Use

1. Open `index.html` in a web browser
2. Type your question in the chat input or click one of the quick question buttons
3. The chatbot will respond with relevant course information

## Sample Questions

### Basic Queries
- "What is ACFI 801?"
- "Tell me about Corporate Finance"
- "List all finance courses"
- "Show me accounting courses"

### Advanced RAG Queries
- "Compare ACFI 801 and ACFI 802"
- "What courses involve derivative securities?"
- "Find courses related to international business"
- "Which courses have prerequisites?"
- "What programming languages are taught in ACFI courses?"

### System Commands
- "System status" - View RAG system information
- "Refresh data" - Update course data from catalog
- "Help" - Get assistance with available features

## Course Data

The chatbot contains information about all 24 ACFI graduate courses from the UNH catalog, including:

- Course descriptions and objectives
- Credit hours and grading modes
- Prerequisites and repeat rules
- Key topics and learning outcomes
- Mutual exclusions and equivalent courses

## Technologies Used

### Frontend
- **HTML5** - Semantic structure and accessibility
- **CSS3** - Modern design with UNH branding and animations
- **Vanilla JavaScript** - No external dependencies for maximum compatibility

### RAG Architecture
- **Data Processing** - Dynamic course data extraction and processing
- **Semantic Embeddings** - TF-IDF based vector representations for semantic search
- **Intent Classification** - Natural language understanding for query interpretation
- **Response Generation** - Context-aware response synthesis
- **Cosine Similarity** - Mathematical similarity scoring for relevant content retrieval

### Data Sources
- **UNH Catalog API** - Real-time course information
- **Fallback Cache** - Local data storage for offline capability

## Course Categories Covered

### Finance Courses
- Corporate Finance (ACFI 801)
- Investments (ACFI 802)
- International Financial Management (ACFI 803)
- Derivative Securities and Markets (ACFI 804)
- Financial Institutions (ACFI 805)
- Financial Modeling and Analytics (ACFI 806)
- And more...

### Accounting Courses
- Ethics and Non-Profit Accounting (ACFI 825)
- Advanced Auditing (ACFI 830)
- Governmental Accounting (ACFI 835)
- Forensic Accounting & Fraud Examination (ACFI 840)
- International Accounting (ACFI 845)
- And more...

## File Structure

```
├── index.html          # Main HTML file and UI structure
├── style.css           # Styling and UNH branding
├── script.js           # Main chatbot logic and UI management
├── data-processor.js   # RAG data processing and semantic search
├── rag-chatbot.js      # RAG chatbot implementation and response generation
├── imgs/
│   └── logo.png        # University of New Hampshire official logo
└── README.md           # This file
```

## RAG System Architecture

### 1. Data Processing Layer (`data-processor.js`)
- **CourseDataProcessor**: Handles data fetching, processing, and storage
- **Semantic Chunking**: Breaks course information into searchable segments
- **Embedding Generation**: Creates vector representations for semantic search
- **Similarity Scoring**: Implements cosine similarity for content retrieval

### 2. RAG Engine (`rag-chatbot.js`)
- **RAGChatbot**: Main conversational AI engine
- **Intent Classification**: Determines user query type and intent
- **Information Retrieval**: Finds relevant course information using semantic search
- **Response Generation**: Synthesizes natural responses based on retrieved content
- **Context Management**: Maintains conversation history and context

### 3. User Interface (`script.js`, `index.html`)
- **Chat Interface**: Modern conversational UI with typing indicators
- **System Integration**: Seamless integration between UI and RAG engine
- **Error Handling**: Graceful degradation and fallback mechanisms
- **Real-time Status**: System health and data freshness indicators

## Future Enhancements

### RAG System Improvements
- **Neural Embeddings**: Upgrade to transformer-based embeddings (BERT, Sentence-BERT)
- **Advanced NLP**: Implement more sophisticated intent recognition and entity extraction
- **Multi-modal RAG**: Include images, PDFs, and multimedia course content
- **Fine-tuning**: Custom language model fine-tuning on university domain data

### Data Integration
- **Live API Integration**: Real-time connection to UNH course registration system
- **Cross-departmental Data**: Expand to all university departments and programs
- **Schedule Integration**: Include class times, locations, and availability
- **Professor Information**: Faculty profiles, ratings, and office hours

### User Experience
- **Voice Interaction**: Speech-to-text and text-to-speech capabilities
- **Mobile App**: Native mobile application with offline capability
- **Personalization**: Student-specific recommendations and saved preferences
- **Multi-language Support**: Spanish and other language translations

### Advanced Features
- **Degree Planning**: AI-powered academic pathway recommendations
- **Prerequisite Tracking**: Automated degree progress monitoring
- **Course Reviews**: Integration with student feedback and ratings
- **Chat Export**: Conversation history and PDF report generation

