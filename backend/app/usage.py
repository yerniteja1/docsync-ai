import logging
from app.supabase_client import supabase

logger = logging.getLogger(__name__)


def track_usage(user_id: str, doc_id: str, tokens_in: int, tokens_out: int, model: str):
    try:
        supabase.table("usage_logs").insert({
            "user_id": user_id,
            "document_id": doc_id,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "model": model,
        }).execute()
    except Exception as e:
        logger.warning(f"Failed to track usage: {e}")
