# Self-Development App Backend

## Overview

This backend powers an advanced AI-driven self-development app named "Self". The app engages users in meaningful conversations using a LLM chatbot, facilitating self-exploration, positive psychology, goal setting, habit formation, and more through various frameworks and tasks.

## Technology Stack

- **Framework**: NestJS
- **Databases**: 
  - MySQL (for relational data: user core data, sessions, categories)
  - MongoDB (for non-relational data: user goals, values, limiting beliefs, etc.)
- **Language Model Integration**: Modular LLM service for generating human-like conversations
- **Authentication**: JWT-based authentication
- **API**: RESTful API endpoints

## Project Structure

```
src/
├── config/               # Configuration files
├── core/                 # Core modules
│   ├── auth/             # Authentication module
│   ├── users/            # User management
│   ├── chat/             # Chat functionality
│   ├── sessions/         # Session management
│   └── llm/              # LLM integration
├── common/               # Shared utilities, guards, and interceptors
├── database/             # Database configurations and migrations
└── main.ts               # Application entry point
```

## Key Features

1. **LLM-Powered Conversations**: Custom prompts guide the LLM to facilitate meaningful interactions across various self-development topics.

2. **Dual Database System**: 
   - MySQL for structured, relational data
   - MongoDB for flexible, document-based storage of user progress and insights

3. **Session Management**: Tracks user progress through various self-development tasks and questionnaires.

4. **Event-Driven Architecture**: Uses events to trigger actions based on LLM responses, updating databases and user states.

5. **Internationalization**: Supports multiple languages for a global user base.

6. **Secure Authentication**: Implements JWT-based authentication for user security.

## Getting Started


## API Documentation
