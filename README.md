# Incedo Coding Challenge - Artist Search and CSV Export

## Overview

This project is a solution for the Incedo Services GmbH backend coding challenge. It is a NestJS application that searches for artists using a public API, saves the search results into a CSV file, and handles fallback searches for random artists if no results are found.

## Features

- Search for artists using a public API.
- Save search results to a CSV file.
- Fallback to random artist search if no results are found.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/incedo-coding-challenge.git
   cd incedo-coding-challenge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the project root and add the following environment variables:**
   ```env
   API_KEY=your_api_key
   ```

## Usage

### Running the Application

To start the application, use the following command:
```bash
npm run start
```

### API Documentation

The API documentation is generated using Swagger. Once the application is running, you can access the Swagger UI at [http://localhost:3000/api](http://localhost:3000/api).

## Endpoints

### Search and Save Artists

**Endpoint:** `GET /artists/search`

**Description:** Searches for artists by name and saves the results to a CSV file. If no results are found, it searches for random artists.

**Request:**
```json
{
  "name": "Artist Name",
  "filename": "results.csv"
}
```

**Responses:**
- **200 OK**
  ```json
  {
    "message": "CSV file created successfully.",
    "records": [
      {
        "name": "Artist Name",
        "mbid": "artist-mbid",
        "url": "artist-url",
        "image_small": "small-image-url",
        "image": "large-image-url"
      }
    ]
  }
  ```
- **404 Not Found**
  ```json
  {
    "statusCode": 404,
    "message": "No results found for Artist Name or any random artists.",
    "error": "Not Found"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "statusCode": 500,
    "message": "Failed to create CSV file.",
    "error": "Internal Server Error"
  }
  ```


## Technologies Used

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Swagger](https://swagger.io/) for API documentation
- [Axios](https://github.com/axios/axios) for HTTP requests
