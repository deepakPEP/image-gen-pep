"""
Chat history storage using AWS S3.
Path structure: NanoReplica_chats/<chat_name>/history.json
"""
import os
import json
import boto3
from botocore.exceptions import ClientError

S3_PREFIX = "NanoReplica_chats"
BUCKET = os.getenv("AWS_BUCKET_NAME", "")
REGION = os.getenv("AWS_REGION", "ap-southeast-1")


def _client():
    return boto3.client(
        "s3",
        region_name=REGION,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )


def _key(chat_name: str) -> str:
    return f"{S3_PREFIX}/{chat_name}/history.json"


def load_history(chat_name: str) -> dict:
    if not BUCKET:
        return {"messages": []}
    try:
        client = _client()
        resp = client.get_object(Bucket=BUCKET, Key=_key(chat_name))
        body = resp["Body"].read().decode("utf-8")
        return json.loads(body)
    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            return {"messages": []}
        raise
    except Exception:
        return {"messages": []}


def save_history(chat_name: str, history: dict) -> None:
    if not BUCKET:
        return
    client = _client()
    body = json.dumps(history, indent=2)
    client.put_object(
        Bucket=BUCKET,
        Key=_key(chat_name),
        Body=body.encode("utf-8"),
        ContentType="application/json",
    )


def list_chats() -> list[str]:
    if not BUCKET:
        return []
    try:
        client = _client()
        prefix = f"{S3_PREFIX}/"
        resp = client.list_objects_v2(Bucket=BUCKET, Prefix=prefix, Delimiter="/")
        chat_names = []
        for common_prefix in resp.get("CommonPrefixes", []):
            p = common_prefix["Prefix"].rstrip("/")
            name = p.split("/")[-1]
            if name:
                chat_names.append(name)
        return sorted(chat_names)
    except Exception:
        return []
