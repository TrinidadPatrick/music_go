# MusicGo

MusicGo is a modern, full-stack music streaming application designed to provide a seamless and immersive listening experience. Built with a robust FastAPI backend and a dynamic React frontend, it leverages the power of YouTube Music to offer an extensive library of songs, albums, artists, and videos. With features like real-time lyrics, synchronized playback, and a sleek, responsive UI, MusicGo brings your favorite tunes to life.

## Features

- **Immersive Music Player**: Enjoy a persistent mini-player and a stunning full-screen experience with synchronized lyrics and queue management.
- **Advanced Search**: Easily find songs, artists, albums, videos, and playlists with a comprehensive search engine and tabbed results.
- **Music Discovery**: Explore top charts, trending music, and personalized recommendations on the home page.
- **Library Management**: Keep your music organized with dedicated sections for your favorite albums, artists, and playlists.
- ** seamless Audio Integration**: High-quality audio streaming powered by YouTube Music's vast catalog.
- **Responsive & Modern UI**: A polished interface built with React 19, TailwindCSS, and Radix UI, featuring smooth animations and dark mode aesthetics.

## Project Structure

- **Client**: A React application built with Vite, utilizing TailwindCSS for styling and Zustand for state management.
- **Server**: A Python API built with FastAPI, using SQLAlchemy for database interactions and `ytmusicapi` for fetching music data.

## Technologies

### Client

- **Framework**: React 19 (Vite)
- **Styling**: TailwindCSS 4, Radix UI
- **State Management**: Zustand
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Server

- **Framework**: FastAPI
- **Music API**: ytmusicapi

## 🛠 Prerequisites

- Node.js (v18+ recommended)
- Python (v3.9+ recommended)

## Getting Started

### 1. Requirements Setup

Make sure all the requirements are installed

### 2. Server Setup

Navigate to the `Server` directory:

```bash
cd Server
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment:

- **Windows**:
  ```powershell
  .venv\Scripts\activate
  ```
- **macOS/Linux**:
  ```bash
  source .venv/bin/activate
  ```

Install dependencies:

```bash
pip install -r requirements.txt
```

follow `https://ytmusicapi.readthedocs.io/en/stable/` documentation to setup auth and retrieve
GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET

```bash
uvicorn main:app --reload
```

Or use the provided batch script:

```bash
run.bat
```

The API will be available at `http://localhost:8000`.

### 3. Client Setup

Navigate to the `Client` directory:

```bash
cd Client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Docker Support

The server includes a `Dockerfile` and a run script `run_docker.bat` to run the container.
