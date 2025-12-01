# Safahomes

A full-stack AI-powered home design application. Users can generate home design images using various AI providers (Pollinations, Gemini, DALL-E) and save their history.

## Tech Stack

-   **Backend**: FastAPI, PostgreSQL, SQLAlchemy, JWT Authentication.
-   **Frontend**: React, Vite, Vanilla CSS (Premium Dark Theme).
-   **AI Providers**: Pollinations.ai (Default), Google Gemini (Native & Enhanced), OpenAI DALL-E 3.
-   Pllinations.ai [Free API] , Google Gemini & OpenAI DALL-E 3 [Paid models]
-   **Storage**: Cloudinary (for Gemini generated images).

## Prerequisites

-   Python 3.10+
-   Node.js 16+
-   PostgreSQL Database (e.g., NeonDB, Local)
-   Cloudinary Account
-   Google Gemini API Key
-   OpenAI API Key (Optional)

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Configure Environment Variables:
Create a `.env` file in the `backend` directory with the following:
```env
DATABASE_URL=postgresql://user:password@host/dbname
SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the server:
```bash
uvicorn main:app --reload
```
The API will be available at `https://safahome-assignment-anushka.onrender.com`.

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
Access the application at `https://safahomes-assignment.vercel.app/`.

## Features

-   **User Authentication**: Signup and Login with JWT.
-   **Image Generation**:
    -   **Pollinations AI**: Fast and free generation.
    -   **Gemini Enhanced**: Uses Gemini to enhance the prompt before sending to Pollinations.
    -   **Gemini Native**: Uses Google's `gemini-2.0-flash-exp-image-generation` model.
    -   **DALL-E 3**: Uses OpenAI's DALL-E 3 model.
-   **History**: View previously generated designs.
-   **Cloud Storage**: Automatically uploads native Gemini images to Cloudinary.
-   **Download**: Download generated images in HD.
