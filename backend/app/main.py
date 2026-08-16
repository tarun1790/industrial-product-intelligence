from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes_ingest import router as ingest_router
from app.api.routes_products import router as products_router
from app.api.routes_search import router as search_router
from app.api.routes_graph import router as graph_router
from app.api.routes_validation import router as validation_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise AI Engine for Industrial Product Intelligence & Catalog Standardization",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(ingest_router, prefix=settings.API_V1_STR)
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(graph_router, prefix=settings.API_V1_STR)
app.include_router(validation_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "engine": "ProductIQ Industrial Intelligence Platform",
        "status": "online",
        "device": settings.DEVICE,
        "cuda_gpu": settings.CUDA_NAME,
        "pillars": ["Extract", "Enrich", "Validate", "Prove"],
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "device": settings.DEVICE, "gpu_active": settings.DEVICE == "cuda"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
