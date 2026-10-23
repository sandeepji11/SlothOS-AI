<div align="center">

🦥 SlothOS AI

Work Less. Live More.

Your intelligent, privacy-first productivity companion powered by local AI.

Because the smartest way to get things done is to let AI handle the boring stuff.

🏆 Hacktoberfest Week 3 — Slow and Steady

⭐ Star Repository • 🐛 Report an Issue • 💻 View Source Code

</div>

⸻

📖 Table of Contents

* Overview
* The Problem
* Our Solution
* Key Features
* Why Open Innovation Matters
* System Architecture
* Technology Stack
* Project Structure
* Installation and Setup
* API Endpoints
* Screenshots
* Project Demo
* Hacktoberfest Challenge
* Future Roadmap
* Contributing
* Security and Privacy
* Project Creator
* License

⸻

🌟 Overview

SlothOS AI is a local-first, AI-powered productivity assistant designed to reduce repetitive digital tasks and make everyday workflows easier.

From organizing messy files to summarizing lengthy documents and converting unstructured thoughts into actionable tasks, SlothOS helps users accomplish more with less manual effort.

Unlike cloud-dependent AI assistants, SlothOS uses Gemma 3 through Ollama, enabling AI inference directly on the user’s computer.

The project is built around three principles:

🔒 Privacy — Keep AI processing local.

⚡ Simplicity — Make complex workflows easier.

🦥 Effortless Productivity — Let AI handle repetitive work.

Why spend hours doing repetitive work when your computer can help handle it?

⸻

🎯 The Problem

Students, developers, and professionals spend significant time on repetitive digital tasks.

Common challenges include:

* 📂 Organizing scattered files and downloads.
* 📄 Reading lengthy PDFs to extract useful information.
* 📝 Converting unstructured notes into task lists.
* ⏰ Identifying priorities and planning activities.
* 🔄 Switching between multiple productivity tools.

These activities consume time that could otherwise be spent learning, building, or solving meaningful problems.

Many AI-powered alternatives also depend on external servers, introducing potential privacy concerns, internet dependency, and recurring API costs.

The Challenge

How can we reduce repetitive digital work while giving users more control over their AI tools and data?

⸻

💡 Our Solution

SlothOS AI brings multiple AI-powered productivity workflows into a single local-first application.

Users interact with a modern React dashboard while a Python FastAPI backend communicates with a locally running Gemma 3 model through Ollama.

Our Approach

Upload → Analyze → Generate → Review → Act

Instead of manually processing information, users can delegate routine analysis and organization tasks to SlothOS.

The goal is simple:

Spend less time managing work and more time doing what matters.

⸻

🚀 Key Features

🗂️ 1. Smart File Organizer

Turn digital clutter into an organized workspace.

The Smart File Organizer is designed to help users classify and organize uploaded files.

Capabilities

* Upload multiple files.
* Analyze filenames and supported file contents.
* Suggest categories using AI.
* Preview file classifications.
* Review organization suggestions.
* Organize file copies within a local workspace.

Example

Before Organization

Downloads/
├── notes.pdf
├── assignment.py
├── screenshot.png
├── project_report.pdf
└── tasks.txt

After Organization

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

Benefit: Less manual file sorting and a cleaner workspace.

⸻

📄 2. AI Document Summarizer

Turn long documents into useful insights.

The Document Summarizer uses AI to analyze text extracted from uploaded PDF documents.

Capabilities

* Upload text-based PDFs.
* Extract document text.
* Generate concise summaries.
* Highlight important information.
* Identify key concepts.
* Suggest action items when relevant.

Example

Input: A PDF containing lecture notes.

Generated Output:

DOCUMENT SUMMARY
Overview:
A concise explanation of the document.
KEY POINTS
1. Important concept one
2. Important concept two
3. Important concept three
ACTION ITEMS
- Review important definitions
- Practice related exercises
- Prepare revision notes

Benefit: Spend less time reading repetitive material and more time understanding it.

Limitation: Very long documents may require additional processing because the current prototype limits the amount of text sent to the model.

⸻

🧠 3. Lazy Task Planner

Turn messy thoughts into structured plans.

Users can enter unstructured notes and ask SlothOS to identify tasks and suggest priorities.

Example Input

I need to finish my Python assignment,
prepare for my robotics interview,
complete my presentation,
and revise mathematics.

Example Output

Task	Suggested Priority
Prepare for robotics interview	🔴 High
Complete presentation	🔴 High
Finish Python assignment	🟡 Medium
Revise mathematics	🟡 Medium

Capabilities

* Natural-language task extraction.
* AI-generated task descriptions.
* Suggested priorities.
* Structured task presentation.

Benefit: Less time planning and more time completing tasks.

⸻

🦥 4. Sloth Mode

One Document. Multiple Useful Insights.

Sloth Mode represents the central philosophy of SlothOS AI.

Instead of manually reading, analyzing, and planning around a document, users can upload it and request a structured AI response.

Workflow

Upload Document
       |
       v
Extract Text
       |
       v
Analyze with Gemma 3
       |
       v
Generate Summary
       |
       v
Identify Action Items
       |
       v
Suggest Priorities
       |
       v
Recommend Next Steps

Generated Insights

1. Concise document summary.
2. Important action items.
3. Suggested priorities.
4. Recommended next steps.

Benefit: One action replaces several repetitive analysis steps.

Future versions aim to connect these insights to more advanced automated workflows.

⸻

🧠 Why Open Innovation Matters

SlothOS AI uses Gemma 3 (1B), an open-weight language model, through Ollama, a local AI inference runtime.

This choice is fundamental to the project’s architecture.

🔓 Why Use Open-Weight AI?

Feature	SlothOS Local AI	Typical Cloud AI
Inference Location	User’s computer	Remote servers
Internet for Inference	Not required after setup	Usually required
Document Privacy	Local processing possible	Data may be transmitted
Per-Request API Cost	None	May apply
Model Configuration	Locally configurable	Provider-dependent
Hardware	Uses local resources	Uses remote resources
Offline Operation	Supported after setup	Often unavailable

🔒 Privacy

SlothOS can process documents locally without sending their contents to an external AI inference provider.

This gives users greater control over their information.

🌐 Offline Functionality

After installing Ollama, downloading Gemma 3, and setting up the application, core AI functionality can run without an internet connection.

🛠️ Customization

Developers can modify prompts, workflows, and model configurations.

💰 Cost Control

Local inference avoids recurring per-request cloud AI charges.

Users still need sufficient computing resources, and local inference consumes electricity.

🌍 Open Innovation Philosophy

Open innovation allows developers to inspect, customize, and extend their AI applications.

SlothOS demonstrates how local AI can support practical productivity workflows without requiring a proprietary cloud AI API.

Important: Gemma is an open-weight model distributed under its own terms. It is not described here as software released under a conventional open-source license.

⸻

🏗️ System Architecture

SlothOS follows a frontend–backend architecture with local AI inference.

flowchart TD
    A["👤 User"] --> B["🖥️ React Dashboard"]
    B --> C["⚙️ FastAPI Backend"]
    C --> D["🗂️ Smart File Organizer"]
    C --> E["📄 Document Summarizer"]
    C --> F["🧠 Lazy Task Planner"]
    C --> G["🦥 Sloth Mode"]
    D --> H["🤖 Ollama"]
    E --> H
    F --> H
    G --> H
    H --> I["🧠 Gemma 3 1B"]
    I --> J["✨ AI-Generated Results"]
    J --> C
    C --> B

How It Works

1. The user interacts with the React dashboard.
2. The frontend sends requests to the FastAPI backend.
3. The backend processes input files or text.
4. Ollama runs the Gemma 3 model locally.
5. The AI generates a response.
6. The backend returns the result to the frontend.
7. The dashboard displays the generated information.

⸻

🛠️ Technology Stack

Layer	Technology	Purpose
Frontend	React	Interactive dashboard
Build Tool	Vite	Fast frontend development
Styling	Tailwind CSS	Responsive interface
Icons	Lucide React	UI icons
HTTP Client	Axios	API communication
Backend	Python	Application logic
API Framework	FastAPI	REST API
AI Runtime	Ollama	Local model inference
AI Model	Gemma 3 (1B)	AI text processing
PDF Processing	PyMuPDF	Extract PDF text
File Management	Python pathlib/shutil	Local file operations
Version Control	Git	Source control
Repository Hosting	GitHub	Code collaboration

⸻

📂 Project Structure

SlothOS-AI/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── workspace/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

The local Python virtual environment, installed Node.js dependencies, and generated workspace files should not be committed to Git.

⸻

⚙️ Installation and Setup

Prerequisites

Install the following software:

* Node.js and npm
* Python 3.11 or newer with compatible dependencies
* Git
* Ollama

AI Model: gemma3:1b

Step 1: Clone the Repository

Open your terminal and run:

git clone https://github.com/sandeepji11/SlothOS-AI.git
cd SlothOS-AI

Step 2: Install Gemma 3

Download the model:

ollama pull gemma3:1b

Verify that it is installed:

ollama list

You should see gemma3:1b among the installed models.

If Ollama is not running, start the Ollama application or use:

ollama serve

If Ollama is already running, you do not need to start another instance.

Step 3: Set Up the Backend

Open a terminal inside the project.

cd backend

Create a Python virtual environment:

python3 -m venv venv

Activate the environment on macOS or Linux:

source venv/bin/activate

Install the dependencies:

python -m pip install -r requirements.txt

Start FastAPI:

python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

Expected output:

INFO: Uvicorn running on http://127.0.0.1:8000
INFO: Application startup complete.

Backend Address:

http://127.0.0.1:8000

Interactive API Documentation:

http://127.0.0.1:8000/docs

Keep this terminal running.

Step 4: Set Up the Frontend

Open another terminal.

From the project root, run:

cd frontend

Install the frontend dependencies:

npm install

Start the development server on port 5175:

npm run dev -- --port 5175

Expected output:

VITE ready
Local: http://localhost:5175/

Step 5: Open SlothOS AI

Open your browser and visit:

http://localhost:5175/

Make sure the following services are running:

Service	Address
React Frontend	http://localhost:5175
FastAPI Backend	http://127.0.0.1:8000
Ollama	http://localhost:11434
API Documentation	http://127.0.0.1:8000/docs

The frontend origin must be allowed by the backend’s CORS configuration.

When the frontend successfully communicates with the backend and the backend detects Gemma 3, the dashboard should indicate that local AI is ready.

⸻

🔌 API Endpoints

SlothOS uses FastAPI to connect its frontend tools to backend functionality.

The following endpoints are documented for the project:

Method	Endpoint	Description
GET	/	Backend information
GET	/api/health	Backend and AI status
POST	/api/chat	Local AI chat
POST	/api/summarize	PDF summarization
POST	/api/tasks	Task generation
POST	/api/organize/preview	File classification preview
POST	/api/organize/apply	Apply approved organization
POST	/api/sloth-mode	Document analysis and action items

Note: Available routes depend on the current backend implementation. Use /docs to inspect the endpoints exposed by the running application.

⸻

📸 Screenshots

🖥️ Main Dashboard

The main dashboard provides access to SlothOS productivity tools and displays the local AI connection status.

📄 AI Document Summarizer

The summarizer interface allows users to upload PDF documents and request AI-generated insights.

🗂️ Smart File Organizer

The organizer interface is designed to classify uploaded files and preview suggested categories.

🧠 Lazy Task Planner

The task planner converts unstructured notes into organized tasks with suggested priorities.

🦥 Sloth Mode

Sloth Mode combines document summarization, action-item extraction, and next-step recommendations.

Application screenshots will be added as the project documentation is updated.

⸻

🎬 Project Demo

SlothOS AI in Action

Demo Video: Coming soon.

Source Code: SlothOS AI GitHub Repository

Project Type: Local-first AI application.

Planned Demo Highlights

* Launching the SlothOS dashboard.
* Verifying local Gemma 3 inference.
* Summarizing a PDF document.
* Generating tasks from natural-language notes.
* Demonstrating file classification.
* Running Sloth Mode.
* Showing that the model runs locally through Ollama.

Note: The application currently runs locally. The development address is not a publicly hosted demo.

⸻

🏆 Hacktoberfest Week 3 — Slow and Steady

🎯 Challenge Theme

Slow and Steady

Build something with open-weight models or open-source AI that rewards laziness.

🦥 Our Interpretation

Sloths are known for conserving energy and avoiding unnecessary effort.

SlothOS applies the same philosophy to digital productivity.

Instead of requiring users to manually perform every repetitive task, the application helps automate information processing and organization.

How SlothOS Fits the Challenge

Theme	SlothOS Approach
Slow	Thoughtful automation over unnecessary complexity
Steady	Repeatable productivity workflows
Lazy	Less manual organization and analysis
Open	Open-weight AI and open-source development tools
Practical	Everyday productivity use cases
Privacy	Local AI inference

Why This Project Matters

AI productivity should not always require expensive cloud services or external processing of personal information.

SlothOS explores a different approach: local AI that can assist with repetitive tasks while giving users more control.

Our Vision

Make useful AI productivity tools accessible, customizable, and privacy-conscious.

⸻

🗺️ Future Roadmap

The following improvements are planned for future development:

* Export organized files as ZIP archives.
* Edit suggested categories before applying changes.
* Add document chunking for large PDFs.
* Implement persistent task storage.
* Add semantic document search.
* Support configurable local AI models.
* Expand Sloth Mode into multi-step automation.
* Add activity history.
* Add productivity analytics.
* Improve accessibility.
* Add automated backend tests.
* Add frontend component tests.
* Improve error handling.
* Package SlothOS as a desktop application.

⸻

🤝 Contributing

Contributions and suggestions are welcome!

How to Contribute

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your implementation.
5. Commit your changes.
6. Push your branch.
7. Open a pull request.

Example

git clone https://github.com/sandeepji11/SlothOS-AI.git
cd SlothOS-AI
git checkout -b feature/my-improvement

After making changes:

git add .
git commit -m "feat: describe your improvement"
git push -u origin feature/my-improvement

Open a pull request to propose the changes.

Contribution Guidelines

* Write readable, maintainable code.
* Follow the existing project structure.
* Test changes before submitting.
* Explain new features clearly.
* Do not commit credentials or personal documents.
* Respect third-party software and model licenses.

For bugs or suggestions, open an issue:

Report an Issue

⸻

🔐 Security and Privacy

SlothOS is designed as a local-first productivity application.

Privacy Principles

* AI inference runs through a locally configured Ollama instance.
* Supported documents can be processed locally.
* Local workspace files should remain excluded from Git.
* Users should review AI-generated suggestions.
* Local inference reduces dependency on external AI services.

Security Considerations

* Do not expose the development API publicly without authentication and appropriate security controls.
* Do not commit API keys or private information.
* Validate uploaded files.
* Keep dependencies updated.
* Review AI-generated results before taking important actions.
* Back up important documents before using file-management tools.

Local inference improves control over data processing, but it does not automatically guarantee complete security.

⸻

👨‍💻 Project Creator

<div align="center">

Sandeep Verma

Developer & Creator of SlothOS AI

Passionate about artificial intelligence, automation, and building technology that solves real-world problems.

Project: SlothOS AI 🦥

Event: Hacktoberfest Week 3 — Slow and Steady

Technology Stack: React • Python • FastAPI • Ollama • Gemma 3

Connect

</div>

⸻

📜 License

A software license has not yet been specified for this repository.

Until a license is added, the source code remains subject to applicable copyright law.

Third-party dependencies and the Gemma model are governed by their respective licenses and terms.

⸻

⭐ Support the Project

If you find SlothOS AI interesting or useful:

* ⭐ Star the repository.
* 🍴 Fork the project.
* 🐛 Report bugs.
* 💡 Suggest improvements.
* 🤝 Contribute to development.

Your support helps the project grow!

⸻

<div align="center">

🦥 SlothOS AI

Less Busywork. More Meaningful Work.

Work Less. Live More.

Built with curiosity, open innovation, and a little bit of laziness.

Hacktoberfest Week 3 — Slow and Steady

Made by Sandeep Verma

⭐ Star on GitHub

</div>