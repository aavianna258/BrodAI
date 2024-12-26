# BrodAI

## Setting up the project environment

Create a virtual environment and then install the requirements.txt file.

## Running the backend API

``` fastapi dev src/main.pi ```

## Running pre-commit hook without committing

``` pre-commit run --all-files ```

## Running the backend - Flask API

From the project’s root directory (or wherever src/backend/serve.py is located):

```uvicorn src.backend.serve:app --reload --port 8000```

## Running the Frontend ( Next.js)

Go to the frontend folder and then do : 
``` npm install ```

You can now start the server using : 

``` npm run dev ```

By default it is running on (http://localhost:3000)

Then open http://localhost:3000 to see the frontend locally.




