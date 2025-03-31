# RAG Implementation Demo

A demonstration of a Retrieval-Augmented Generation (RAG) system built with Next.js, Express, and LangChain. This project showcases how to implement a RAG system that can process documents, perform semantic search, and generate context-aware responses using LLMs.

## Screenshot

![RAG Implementation Demo](screenshots/rag-demo.png)

## Features

- 📄 Document Processing
  - Support for multiple file types (TXT, PDF, DOC, DOCX)
  - Automatic text chunking and embedding generation
  - Vector similarity search using pgvector

- 🤖 RAG Implementation
  - Semantic search using OpenAI embeddings
  - Context-aware response generation
  - Source document tracking and display
  - Side-by-side comparison with direct LLM responses

- 🎨 User Interface
  - Modern, responsive design with Tailwind CSS
  - Drag-and-drop document upload
  - Real-time search results
  - Loading states and error handling
  - Source document highlighting

## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- React Dropzone

### Backend
- Express.js
- TypeScript
- LangChain
- OpenAI API
- PostgreSQL with pgvector
- Node.js

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- OpenAI API key

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000  # Required for CORS in production

# Authentication
API_KEY=your_api_key  # For frontend-backend communication
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_KEY=your_api_key  # For frontend-backend communication
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/krystonen/rag-implementation.git
cd rag-implementation
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up the database:
```bash
# Connect to PostgreSQL and create the database
psql -U postgres
CREATE DATABASE your_database_name;

# Run the database migrations
cd backend
npm run migrate
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload documents using the drag-and-drop interface
2. Enter your question in the search bar
3. View the RAG-enhanced response alongside the direct LLM response
4. Examine the source documents used to generate the response

## Project Structure

```
rag-implementation/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── page.tsx
│   │   └── types/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [LangChain](https://www.langchain.com/) for the RAG implementation tools
- [OpenAI](https://openai.com/) for the LLM and embedding models
- [Next.js](https://nextjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling 