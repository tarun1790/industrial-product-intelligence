import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging_config import setup_production_logging
from app.api.routes_ingest import router as ingest_router
from app.api.routes_products import router as products_router, CATALOG
from app.api.routes_search import router as search_router
from app.api.routes_graph import router as graph_router
from app.api.routes_validation import router as validation_router
from app.api.routes_advanced import router as advanced_router
from app.api.routes_realtime import router as realtime_router

# Initialize Clean Production Logging
setup_production_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise AI Engine for Industrial Product Intelligence & Catalog Standardization",
    version="2.4.0"
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
app.include_router(advanced_router, prefix=settings.API_V1_STR)
app.include_router(realtime_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "engine": "ProductIQ Industrial Intelligence Platform",
        "status": "online",
        "version": "2.4.0",
        "device": settings.DEVICE,
        "cuda_gpu": settings.CUDA_NAME,
        "pillars": ["Extract", "Enrich", "Validate", "Prove"],
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.4.0",
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "device": settings.DEVICE,
        "gpu_active": settings.DEVICE == "cuda"
    }

@app.get("/ready")
async def readiness_probe():
    return {
        "ready": True,
        "total_catalog_skus": len(CATALOG),
        "sectors_indexed": 10,
        "websocket_telemetry_live": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
