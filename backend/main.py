import json
import re
import shutil
import uuid
from pathlib import Path
from datetime import datetime

import fitz
import requests

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="SlothOS AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "gemma3:1b"

BASE_DIR = Path(__file__).resolve().parent
WORKSPACE = BASE_DIR / "workspace"
WORKSPACE.mkdir(exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_FILES = 20

CATEGORIES = [
    "Documents",
    "Study Materials",
    "Programming",
    "Images",
    "Other"
]


class TextRequest(BaseModel):
    text: str


class OrganizeRequest(BaseModel):
    session_id: str


def ask_ai(prompt):
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.2
                }
            },
            timeout=180
        )

        response.raise_for_status()

        return response.json().get("response", "").strip()

    except requests.exceptions.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to Ollama: {error}"
        )


def extract_json(text):
    cleaned = re.sub(
        r"^```(?:json)?\s*|\s*```$",
        "",
        text.strip(),
        flags=re.IGNORECASE
    )

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)

        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

    raise HTTPException(
        status_code=502,
        detail="AI returned invalid JSON. Please try again."
    )


def safe_filename(filename):
    name = Path(filename or "unnamed").name
    name = name.replace("\\", "_").replace("/", "_")

    if name in ("", ".", ".."):
        name = "unnamed"

    return name


def unique_destination(folder, filename):
    destination = folder / filename

    if not destination.exists():
        return destination

    original = Path(filename)
    counter = 1

    while True:
        candidate = folder / (
            f"{original.stem}_{counter}{original.suffix}"
        )

        if not candidate.exists():
            return candidate

        counter += 1


def extract_pdf_text(data):
    try:
        with fitz.open(stream=data, filetype="pdf") as doc:
            if doc.page_count > 100:
                raise HTTPException(
                    status_code=400,
                    detail="PDF must contain 100 pages or fewer."
                )

            return "\n".join(
                page.get_text() for page in doc
            )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read this PDF."
        )


@app.get("/")
def home():
    return {
        "message": "SlothOS AI backend is running",
        "model": MODEL
    }


@app.get("/api/health")
def health():
    try:
        response = requests.get(
            "http://localhost:11434/api/tags",
            timeout=5
        )

        response.raise_for_status()

        models = [
            model.get("name", "")
            for model in response.json().get("models", [])
        ]

        available = any(
            name == MODEL or name.startswith(MODEL + "-")
            for name in models
        )

        return {
            "backend": "online",
            "ollama": "online",
            "model_available": available
        }

    except requests.exceptions.RequestException:
        return {
            "backend": "online",
            "ollama": "offline",
            "model_available": False
        }


@app.post("/api/chat")
def chat(request: TextRequest):
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    prompt = f"""
You are SlothOS, a friendly local AI productivity assistant.

Be helpful, concise, and practical.

User message:
{request.text}
"""

    return {
        "response": ask_ai(prompt)
    }


@app.post("/api/summarize")
async def summarize(file: UploadFile = File(...)):
    filename = safe_filename(file.filename)

    if Path(filename).suffix.lower() != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )

    data = await file.read(MAX_FILE_SIZE + 1)

    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="PDF exceeds the 10 MB limit."
        )

    text = extract_pdf_text(data)

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No extractable text found in PDF."
        )

    # MVP: limit input to avoid overwhelming smaller models.
    text = text[:12000]

    prompt = f"""
Summarize the following document.

Return:
1. A short overview
2. Five key points
3. Important concepts
4. Action items, if any

Do not invent information.

DOCUMENT:
{text}
"""

    summary = ask_ai(prompt)

    return {
        "filename": filename,
        "summary": summary
    }


@app.post("/api/tasks")
def generate_tasks(request: TextRequest):
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Please enter your tasks."
        )

    prompt = f"""
Convert the following notes into an organized task list.

Return ONLY valid JSON.

Format:
{{
  "tasks": [
    {{
      "title": "Task title",
      "priority": "High",
      "description": "Short description"
    }}
  ]
}}

Priority must be High, Medium, or Low.

Do not invent deadlines.

USER NOTES:
{request.text[:6000]}
"""

    result = extract_json(ask_ai(prompt))

    tasks = result.get("tasks", [])

    if not isinstance(tasks, list):
        raise HTTPException(
            status_code=502,
            detail="Invalid task format returned by AI."
        )

    cleaned_tasks = []

    for task in tasks[:30]:
        if not isinstance(task, dict):
            continue

        priority = task.get("priority", "Medium")

        if priority not in ("High", "Medium", "Low"):
            priority = "Medium"

        cleaned_tasks.append({
            "title": str(task.get("title", "Untitled Task")),
            "priority": priority,
            "description": str(task.get("description", ""))
        })

    return {"tasks": cleaned_tasks}


@app.post("/api/organize/preview")
async def organize_preview(
    files: list[UploadFile] = File(...)
):
    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {MAX_FILES} files allowed."
        )

    session_id = str(uuid.uuid4())
    session_folder = WORKSPACE / session_id
    input_folder = session_folder / "input"

    input_folder.mkdir(parents=True)

    stored_files = []

    for file in files:
        filename = safe_filename(file.filename)

        data = await file.read(MAX_FILE_SIZE + 1)

        if len(data) > MAX_FILE_SIZE:
            shutil.rmtree(session_folder)
            raise HTTPException(
                status_code=413,
                detail=f"{filename} exceeds 10 MB."
            )

        destination = unique_destination(
            input_folder,
            filename
        )

        destination.write_bytes(data)

        stored_files.append(destination.name)

    file_details = []

    for filename in stored_files:
        path = input_folder / filename

        details = {
            "filename": filename,
            "extension": path.suffix.lower()
        }

        if path.suffix.lower() == ".pdf":
            try:
                text = extract_pdf_text(path.read_bytes())
                details["sample"] = text[:500]
            except HTTPException:
                details["sample"] = ""

        elif path.suffix.lower() in (
            ".txt", ".md", ".py", ".js", ".json"
        ):
            try:
                details["sample"] = path.read_text(
                    encoding="utf-8"
                )[:500]
            except (UnicodeError, OSError):
                details["sample"] = ""

        file_details.append(details)

    prompt = f"""
Classify each file into exactly one category:

{", ".join(CATEGORIES)}

Return ONLY valid JSON.

Format:
{{
  "files": [
    {{
      "filename": "example.pdf",
      "category": "Documents"
    }}
  ]
}}

Use the exact original filenames.

FILE INFORMATION:
{json.dumps(file_details)}
"""

    try:
        result = extract_json(ask_ai(prompt))
    except HTTPException:
        shutil.rmtree(session_folder)
        raise

    predictions = {}

    for item in result.get("files", []):
        if not isinstance(item, dict):
            continue

        filename = item.get("filename")
        category = item.get("category")

        if (
            filename in stored_files
            and category in CATEGORIES
        ):
            predictions[filename] = category

    preview = [
        {
            "filename": filename,
            "category": predictions.get(
                filename,
                "Other"
            )
        }
        for filename in stored_files
    ]

    manifest = {
        "session_id": session_id,
        "files": preview
    }

    (session_folder / "manifest.json").write_text(
        json.dumps(manifest),
        encoding="utf-8"
    )

    return manifest


@app.post("/api/organize/apply")
def organize_apply(request: OrganizeRequest):
    try:
        session_uuid = str(uuid.UUID(request.session_id))
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid session ID."
        )

    session_folder = WORKSPACE / session_uuid
    manifest_path = session_folder / "manifest.json"

    if not manifest_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Organization session not found."
        )

    manifest = json.loads(
        manifest_path.read_text(encoding="utf-8")
    )

    input_folder = session_folder / "input"
    output_folder = session_folder / "organized"

    if output_folder.exists():
        raise HTTPException(
            status_code=409,
            detail="This session has already been organized."
        )

    output_folder.mkdir()

    organized = []

    for item in manifest["files"]:
        filename = item["filename"]
        category = item["category"]

        if category not in CATEGORIES:
            category = "Other"

        source = input_folder / filename

        if not source.is_file():
            continue

        category_folder = output_folder / category
        category_folder.mkdir(exist_ok=True)

        destination = unique_destination(
            category_folder,
            filename
        )

        shutil.copy2(source, destination)

        organized.append({
            "filename": filename,
            "category": category
        })

    return {
        "message": "Files organized successfully!",
        "files": organized,
        "output_folder": str(output_folder)
    }


@app.post("/api/sloth-mode")
async def sloth_mode(file: UploadFile = File(...)):
    filename = safe_filename(file.filename)

    if Path(filename).suffix.lower() != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="Sloth Mode currently supports PDF files."
        )

    data = await file.read(MAX_FILE_SIZE + 1)

    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File exceeds 10 MB."
        )

    text = extract_pdf_text(data)

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No extractable text found."
        )

    prompt = f"""
Analyze this document.

Return:
1. A concise summary
2. Important action items
3. Suggested priorities
4. A short recommendation for what to do next

DOCUMENT:
{text[:12000]}
"""

    response = ask_ai(prompt)

    return {
        "filename": filename,
        "result": response,
        "completed_at": datetime.now().isoformat()
    }