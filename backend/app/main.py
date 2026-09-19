from fastapi import FastAPI

app = FastAPI(title="LearnFlow API")


@app.get("/")
def root():
    return {
        "message": "LearnFlow API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "LearnFlow API"
    }