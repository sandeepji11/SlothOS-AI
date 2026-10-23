<div align="center">

🦥 SlothOS AI

Work Less. Live More.

Your intelligent, privacy-first productivity companion powered by local AI.

Because the smartest way to get things done is to let AI handle the boring stuff.

Hacktoberfest Week 3 | Slow and Steady

</div>

⸻

🌟 Overview

SlothOS AI is a local-first, AI-powered productivity assistant designed to eliminate repetitive digital tasks and make everyday workflows effortless.

From organizing messy files to summarizing lengthy documents and converting unstructured thoughts into actionable tasks, SlothOS helps users accomplish more with less effort.

Unlike traditional cloud-dependent AI assistants, SlothOS uses Gemma 3 through Ollama, allowing AI inference to run directly on your computer.

The result is a productivity assistant built around three principles:

🔒 Privacy. ⚡ Simplicity. 🦥 Effortless Productivity.

Why spend hours doing repetitive work when your computer can help handle it?

⸻

🎯 The Problem

Every day, students, developers, and professionals spend valuable time on repetitive tasks:

* Manually organizing downloaded files.
* Reading lengthy PDFs to extract important information.
* Converting scattered notes into structured task lists.
* Identifying priorities from unorganized information.
* Switching between multiple productivity applications.

Although these tasks are necessary, they consume time that could be spent learning, creating, or solving meaningful problems.

Many AI solutions also rely on external servers, requiring users to upload personal information and maintain an internet connection.

SlothOS AI aims to solve both problems: repetitive work and unnecessary cloud dependency.

⸻

💡 Our Solution

SlothOS brings AI-powered productivity tools into a single, intuitive dashboard.

Powered by locally running open-weight AI, it helps users automate everyday tasks while maintaining greater control over their information.

🗂️ 1. Smart File Organizer

Transform digital clutter into an organized workspace.

Capabilities:

* Upload multiple files.
* Analyze filenames, extensions, and supported document content.
* Use AI to suggest appropriate categories.
* Preview the proposed organization.
* Confirm the operation before files are organized.
* Preserve the original uploaded files.

Example:

Before:
Downloads/
├── notes.pdf
├── assignment.py
├── screenshot.png
├── project_report.pdf
└── tasks.txt
After:
Organized/
├── Documents/
│   └── project_report.pdf
├── Study Materials/
│   └── notes.pdf
├── Programming/
│   └── assignment.py
├── Images/
│   └── screenshot.png
└── Other/
    └── tasks.txt

The application organizes copies inside its local workspace rather than modifying the user’s original files.

📄 2. AI Document Summarizer

Turn lengthy PDF documents into concise, useful information.

Capabilities:

* Upload text-based PDF documents.
* Extract document text.
* Generate an AI-powered summary.
* Identify important concepts.
* Highlight key points.
* Extract action items when relevant.

Example:

Input: A PDF containing lecture notes.

Output:

* Document overview
* Five key points
* Important concepts
* Suggested action items

The current prototype limits the amount of text sent to the model, so very long documents may require future chunking support.

🧠 3. Lazy Task Planner

Turn unstructured thoughts into an organized task list.

Example input:

I need to finish my Python assignment,
prepare for my robotics interview,
complete my presentation,
and revise mathematics.

Example output:

Task	Suggested Priority
Prepare for robotics interview	High
Complete presentation	High
Finish Python assignment	Medium
Revise mathematics	Medium

Capabilities:

* Natural-language task extraction.
* AI-generated task descriptions.
* Priority suggestions.
* Structured task presentation.

🦥 4. Sloth Mode

One document. Multiple useful insights.

Sloth Mode is designed around the challenge’s central philosophy: reducing unnecessary effort.

Instead of manually reviewing a document and planning what to do next, users can upload a PDF and let SlothOS analyze it.

The current prototype generates:

1. A concise document summary.
2. Important action items.
3. Suggested priorities.
4. Recommended next steps.

Future versions aim to connect document analysis, task creation, and file organization into a broader automated workflow.

⸻

🧠 Powered by Open Innovation

SlothOS uses Gemma 3, an open-weight language model, through the local inference runtime Ollama.

This architecture makes local AI processing a core part of the application rather than an optional feature.

Why Local AI?

Feature	SlothOS Local AI Approach	Typical Cloud AI Approach
Inference location	User’s computer	Remote infrastructure
Internet required for inference	No, after setup	Usually yes
Document transmission to AI provider	Not required	Often required
Per-request API fees	None for local inference	May apply
Model customization	Local model and prompt configuration	Provider-dependent
Hardware requirements	Local computing resources	Primarily remote resources

🔒 Privacy

Documents can be processed locally without sending their contents to an external AI inference service.

🌐 Offline Functionality

After installing the required software and downloading the model, core AI workflows can operate without an internet connection.

🛠️ Customization

Developers can customize prompts, processing logic, and supported models.

💰 Cost Control

Local inference avoids recurring per-request cloud AI fees, although it still consumes local computing resources and electricity.

Open innovation matters because it gives developers and users greater control over how their AI tools operate.

Note: Gemma is distributed under its own model terms. It is described here as open-weight rather than as a model released under a conventional open-source software license.

⸻

🏗️ System Architecture

                     ┌─────────────────────┐
                     │        USER         │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   React Frontend    │
                     │   Tailwind CSS UI   │
                     └──────────┬──────────┘
                                │
                                │ HTTP Requests
                                ▼
                     ┌─────────────────────┐
                     │   FastAPI Backend   │
                     │       Python        │
                     └──────────┬──────────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
          ┌────────────┐ ┌────────────┐ ┌────────────┐
          │    File    │ │  Document  │ │    Task    │
          │ Organizer  │ │ Summarizer │ │  Planner   │
          └──────┬─────┘ └──────┬─────┘ └──────┬─────┘
                 │              │              │
                 └──────────────┼──────────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │       Ollama        │
                     │      Gemma 3        │
                     │    Local Model      │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │    AI Response      │
                     └─────────────────────┘

⸻

🛠️ Technology Stack

Layer	Technology	Purpose
Frontend	React	Interactive user interface
Build Tool	Vite	Frontend development and bundling
Styling	Tailwind CSS	Responsive dashboard design
Icons	Lucide React	Interface icons
HTTP Client	Axios	Frontend–backend communication
Backend	Python	Application logic
API Framework	FastAPI	REST API endpoints
AI Runtime	Ollama	Local model inference
AI Model	Gemma 3 (1B)	Language understanding and generation
PDF Processing	PyMuPDF	Document text extraction
File Management	Python pathlib/shutil	Local file operations

⸻

📂 Project Structure

SlothOS-AI/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── workspace/          # Local files (Git ignored)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

⸻

⚙️ Installation and Setup

Prerequisites

Before starting, install:

* Node.js and npm
* Python 3.11 or newer with compatible dependencies
* Git
* Ollama

The application currently uses the gemma3:1b model.

1️⃣ Clone the Repository

git clone https://github.com/YOUR_USERNAME/SlothOS-AI.git
cd SlothOS-AI

Replace YOUR_USERNAME with your GitHub username.

2️⃣ Install Gemma 3

Make sure Ollama is installed and running.

Download the model:

ollama pull gemma3:1b

Verify installation:

ollama list

3️⃣ Set Up the Backend

Navigate to the backend directory:

cd backend

Create a virtual environment:

python3 -m venv venv

Activate it on macOS or Linux:

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Start FastAPI:

python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

The backend runs at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

4️⃣ Set Up the Frontend

Open another terminal from the project root.

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Vite displays the local address in the terminal.

The default is:

http://localhost:5173

If that port is occupied, Vite may use another available port.

For development on port 5175:

npm run dev -- --port 5175

Ensure the selected frontend origin is allowed by the FastAPI CORS configuration.

5️⃣ Launch SlothOS

Open the frontend address in your browser.

Make sure:

* Ollama is running.
* The Gemma 3 model is installed.
* FastAPI is running.
* React is running.

The dashboard should display Local AI Ready when the backend can access the installed model.

⸻

🔌 API Endpoints

Method	Endpoint	Description
GET	/	Backend information
GET	/api/health	Check backend and Ollama status
POST	/api/chat	Generate a local AI response
POST	/api/summarize	Summarize a PDF
POST	/api/tasks	Convert notes into tasks
POST	/api/organize/preview	Preview AI file classification
POST	/api/organize/apply	Organize approved file copies
POST	/api/sloth-mode	Generate document insights and action items

Explore the API using FastAPI’s interactive documentation.

⸻

📸 Screenshots

Add screenshots of the working application here.

Recommended screenshots:

1. Main Dashboard

Show the SlothOS homepage, navigation sidebar, and AI status indicator.

2. AI Document Summarizer

Show a PDF upload and the generated summary.

3. Smart File Organizer

Show the AI classification preview.

4. Lazy Task Planner

Show unstructured notes converted into prioritized tasks.

5. Sloth Mode

Show document insights and recommended next steps.

⸻

🎬 Project Demo

Demo Video: Coming soon.

Live Demo: SlothOS currently runs as a local application.

Source Code: This repository.

A demonstration should highlight the actual working features and show Gemma 3 processing information locally.

⸻

🏆 Hacktoberfest Week 3 — Slow and Steady

The Challenge

Build something using open-weight models or open-source AI that rewards laziness.

Our Interpretation

Sloths conserve energy by avoiding unnecessary effort.

SlothOS applies that philosophy to digital productivity.

Rather than spending time on repetitive tasks, users can delegate routine work to an AI assistant.

How SlothOS Fits the Theme

Slow: The application prioritizes thoughtful, useful automation over unnecessary complexity.

Steady: Repeatable workflows help users complete everyday tasks consistently.

Lazy: Users spend less time organizing, summarizing, and planning.

Open: The application uses an open-weight model and open-source development tools.

Our Goal

Make AI productivity more accessible, customizable, and privacy-conscious.

⸻

🗺️ Future Roadmap

* Download organized files as a ZIP archive.
* Edit AI-suggested file categories before applying changes.
* Support larger PDFs through document chunking.
* Add persistent task storage.
* Implement semantic document search.
* Add configurable local AI models.
* Expand Sloth Mode into a multi-step automation system.
* Add task history and activity analytics.
* Improve error handling and accessibility.
* Add automated tests.
* Package SlothOS as a desktop application.

⸻

🤝 Contributing

Contributions, ideas, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your implementation.
5. Commit your changes.
6. Open a pull request describing your improvements.

Please avoid including personal documents, model weights, credentials, or generated local files in pull requests.

⸻

🔐 Security and Privacy

SlothOS is designed for local development and experimentation.

* AI inference runs through a locally configured Ollama instance.
* Uploaded files are processed by the local backend.
* The organizer operates on uploaded copies.
* Local workspace files should be excluded from Git.
* The development backend should not be exposed publicly without additional security measures.
* Users should review AI-generated outputs before relying on them.

Local inference reduces the need to transmit data to external AI providers, but it does not automatically guarantee complete system security.

⸻

📜 License

A software license will be selected and added before the public release.

Until then, the repository does not grant general permission to reuse or redistribute its code.

Third-party dependencies and the Gemma model remain subject to their respective licenses and terms.

⸻

<div align="center">

🦥 SlothOS AI

Less Busywork. More Meaningful Work.

Built with curiosity, open innovation, and a little bit of laziness.

Hacktoberfest Week 3 — Slow and Steady

⭐ If you find this project useful, consider starring the repository!

</div>