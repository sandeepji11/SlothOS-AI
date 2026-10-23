import { useEffect, useState } from "react";
import axios from "axios";

import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  ListTodo,
  Brain,
  Sparkles,
  Upload,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Wifi,
  WifiOff,
  Zap,
  Menu,
  X
} from "lucide-react";

const API = "http://127.0.0.1:8000";

const navigation = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard
  },
  {
    id: "organizer",
    name: "File Organizer",
    icon: FolderOpen
  },
  {
    id: "summarizer",
    name: "PDF Summarizer",
    icon: FileText
  },
  {
    id: "tasks",
    name: "Task Planner",
    icon: ListTodo
  },
  {
    id: "sloth",
    name: "Sloth Mode",
    icon: Zap
  }
];

function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [pdf, setPdf] = useState(null);
  const [summary, setSummary] = useState("");

  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState([]);

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [organized, setOrganized] = useState(null);

  const [slothFile, setSlothFile] = useState(null);
  const [slothResult, setSlothResult] = useState("");

  const [stats, setStats] = useState({
    documents: 0,
    files: 0,
    tasks: 0
  });

  useEffect(() => {
    checkHealth();
  }, []);

  async function checkHealth() {
    try {
      const response = await axios.get(
        `${API}/api/health`
      );

      setHealth(response.data);
    } catch {
      setHealth({
        backend: "offline",
        ollama: "offline",
        model_available: false
      });
    }
  }

  function navigate(id) {
    setPage(id);
    setError("");
    setSidebarOpen(false);
  }

  function getErrorMessage(err) {
    const detail = err.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    return err.message || "Something went wrong.";
  }

  async function runRequest(callback) {
    setLoading(true);
    setError("");

    try {
      await callback();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function summarizePDF() {
    if (!pdf) {
      setError("Please select a PDF first.");
      return;
    }

    await runRequest(async () => {
      const form = new FormData();
      form.append("file", pdf);

      const response = await axios.post(
        `${API}/api/summarize`,
        form
      );

      setSummary(response.data.summary);

      setStats((previous) => ({
        ...previous,
        documents: previous.documents + 1
      }));
    });
  }

  async function generateTasks() {
    if (!notes.trim()) {
      setError("Please enter your notes.");
      return;
    }

    await runRequest(async () => {
      const response = await axios.post(
        `${API}/api/tasks`,
        { text: notes }
      );

      setTasks(response.data.tasks);

      setStats((previous) => ({
        ...previous,
        tasks:
          previous.tasks +
          response.data.tasks.length
      }));
    });
  }

  async function previewOrganization() {
    if (files.length === 0) {
      setError("Please select some files.");
      return;
    }

    await runRequest(async () => {
      const form = new FormData();

      Array.from(files).forEach((file) => {
        form.append("files", file);
      });

      const response = await axios.post(
        `${API}/api/organize/preview`,
        form
      );

      setPreview(response.data);
      setOrganized(null);
    });
  }

  async function applyOrganization() {
    if (!preview) return;

    await runRequest(async () => {
      const response = await axios.post(
        `${API}/api/organize/apply`,
        {
          session_id: preview.session_id
        }
      );

      setOrganized(response.data);

      setStats((previous) => ({
        ...previous,
        files:
          previous.files +
          response.data.files.length
      }));
    });
  }

  async function activateSlothMode() {
    if (!slothFile) {
      setError("Please select a PDF first.");
      return;
    }

    await runRequest(async () => {
      const form = new FormData();
      form.append("file", slothFile);

      const response = await axios.post(
        `${API}/api/sloth-mode`,
        form
      );

      setSlothResult(response.data.result);
    });
  }

  const modelReady =
    health?.backend === "online" &&
    health?.ollama === "online" &&
    health?.model_available;

  function ToolCard({
    icon: Icon,
    title,
    description,
    target
  }) {
    return (
      <button
        onClick={() => navigate(target)}
        className="group rounded-2xl border border-white/10
        bg-[#161d30] p-6 text-left transition-all
        hover:-translate-y-1 hover:border-lime-400/50
        hover:bg-[#1d2840]"
      >
        <div className="mb-5 flex h-12 w-12 items-center
        justify-center rounded-xl bg-lime-400/10
        text-lime-400">
          <Icon size={24} />
        </div>

        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6
        text-slate-400">
          {description}
        </p>

        <div className="mt-6 flex items-center gap-2
        text-sm font-medium text-lime-400">
          Open Tool
          <ArrowRight
            size={16}
            className="transition-transform
            group-hover:translate-x-1"
          />
        </div>
      </button>
    );
  }

  function SectionHeader({ title, description }) {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          {title}
        </h2>

        <p className="mt-2 text-slate-400">
          {description}
        </p>
      </div>
    );
  }

  function ResultBox({ title, content }) {
    if (!content) return null;

    return (
      <div className="mt-8 rounded-2xl border
      border-lime-400/20 bg-[#161d30] p-6">
        <div className="mb-4 flex items-center gap-2
        text-lime-400">
          <CheckCircle2 size={20} />
          <h3 className="font-semibold">{title}</h3>
        </div>

        <div className="whitespace-pre-wrap text-sm
        leading-7 text-slate-300">
          {content}
        </div>
      </div>
    );
  }

  function ActionButton({ children, onClick }) {
    return (
      <button
        onClick={onClick}
        disabled={loading}
        className="mt-5 flex items-center justify-center
        gap-2 rounded-xl bg-lime-400 px-6 py-3
        font-semibold text-slate-950 transition
        hover:bg-lime-300"
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            AI is thinking...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            {children}
          </>
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020]
    text-white">

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70
          lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40
        w-64 border-r border-white/10
        bg-[#111827] p-6 transition-transform
        lg:translate-x-0
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="mb-12 flex items-center
        justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11
            items-center justify-center
            rounded-xl bg-lime-400 text-2xl">
              🦥
            </div>

            <div>
              <h1 className="text-xl font-bold">
                SlothOS
              </h1>

              <p className="text-xs text-slate-400">
                AI Productivity
              </p>
            </div>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <p className="mb-4 text-xs font-semibold
        uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex w-full items-center
                gap-3 rounded-xl px-4 py-3
                text-left text-sm transition
                ${
                  page === item.id
                    ? "bg-lime-400/10 text-lime-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6
        right-6 rounded-xl border border-white/10
        bg-white/5 p-4">
          <div className="flex items-center gap-2
          text-sm font-medium">
            <ShieldCheck
              size={18}
              className="text-lime-400"
            />
            Local AI
          </div>

          <p className="mt-2 text-xs leading-5
          text-slate-400">
            Powered by Gemma 3 and Ollama.
            Your AI runs on your machine.
          </p>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="flex items-center
        justify-between border-b border-white/10
        px-6 py-5 lg:px-10">

          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="font-semibold">
                SlothOS Workspace
              </h2>

              <p className="text-xs text-slate-400">
                Slow and steady wins.
              </p>
            </div>
          </div>

          <button
            onClick={checkHealth}
            className={`flex items-center gap-2
            rounded-full border px-4 py-2
            text-xs font-medium
            ${
              modelReady
                ? "border-lime-400/30 bg-lime-400/10 text-lime-400"
                : "border-red-400/30 bg-red-400/10 text-red-400"
            }`}
          >
            {modelReady ? (
              <Wifi size={15} />
            ) : (
              <WifiOff size={15} />
            )}

            {modelReady
              ? "Local AI Ready"
              : "AI Not Ready"}
          </button>
        </header>

        <div className="mx-auto max-w-6xl p-6 lg:p-10">

          {error && (
            <div className="mb-6 rounded-xl border
            border-red-400/30 bg-red-400/10
            p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {page === "dashboard" && (
            <>
              <div className="relative overflow-hidden
              rounded-3xl border border-lime-400/20
              bg-gradient-to-br from-[#202d36]
              via-[#172638] to-[#151b30] p-8
              lg:p-12">

                <div className="relative z-10
                max-w-2xl">
                  <div className="mb-5 inline-flex
                  items-center gap-2 rounded-full
                  border border-lime-400/20
                  bg-lime-400/10 px-4 py-2
                  text-xs font-medium text-lime-400">
                    <Sparkles size={14} />
                    YOUR PERSONAL AI ASSISTANT
                  </div>

                  <h1 className="text-4xl font-bold
                  leading-tight lg:text-5xl">
                    Work less.
                    <br />
                    <span className="text-lime-400">
                      Live more.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-lg
                  leading-7 text-slate-300">
                    Meet SlothOS, your local AI
                    assistant that handles boring
                    tasks so you can focus on
                    what matters.
                  </p>

                  <button
                    onClick={() => navigate("sloth")}
                    className="mt-8 flex items-center
                    gap-2 rounded-xl bg-lime-400
                    px-6 py-3 font-semibold
                    text-slate-950 hover:bg-lime-300"
                  >
                    <Zap size={19} />
                    Activate Sloth Mode
                  </button>
                </div>

                <div className="absolute -bottom-10
                right-0 hidden text-[180px]
                opacity-20 lg:block">
                  🦥
                </div>
              </div>

              <div className="mt-8 grid gap-4
              md:grid-cols-3">

                {[
                  {
                    label: "Documents Summarized",
                    value: stats.documents,
                    icon: FileText
                  },
                  {
                    label: "Files Organized",
                    value: stats.files,
                    icon: FolderOpen
                  },
                  {
                    label: "Tasks Generated",
                    value: stats.tasks,
                    icon: ListTodo
                  }
                ].map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border
                      border-white/10 bg-[#161d30]
                      p-6"
                    >
                      <Icon
                        size={23}
                        className="mb-4 text-lime-400"
                      />

                      <div className="text-3xl
                      font-bold">
                        {stat.value}
                      </div>

                      <p className="mt-2 text-sm
                      text-slate-400">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12">
                <SectionHeader
                  title="Your AI Toolkit"
                  description="Powerful tools that make everyday work effortless."
                />

                <div className="grid gap-5
                md:grid-cols-2 xl:grid-cols-3">

                  <ToolCard
                    icon={FolderOpen}
                    title="Smart File Organizer"
                    description="Let AI categorize and organize your digital clutter."
                    target="organizer"
                  />

                  <ToolCard
                    icon={FileText}
                    title="Document Summarizer"
                    description="Turn long PDFs into useful summaries."
                    target="summarizer"
                  />

                  <ToolCard
                    icon={ListTodo}
                    title="Lazy Task Planner"
                    description="Transform messy notes into actionable tasks."
                    target="tasks"
                  />

                  <ToolCard
                    icon={Zap}
                    title="Sloth Mode"
                    description="Analyze a document and discover your next actions."
                    target="sloth"
                  />

                </div>
              </div>
            </>
          )}

          {page === "summarizer" && (
            <>
              <SectionHeader
                title="📄 AI Document Summarizer"
                description="Upload a PDF and let your local AI do the reading."
              />

              <div className="rounded-2xl border
              border-white/10 bg-[#161d30] p-8">

                <label className="flex cursor-pointer
                flex-col items-center rounded-2xl
                border-2 border-dashed border-white/20
                p-12 text-center hover:border-lime-400">

                  <Upload
                    size={40}
                    className="mb-4 text-lime-400"
                  />

                  <span className="font-semibold">
                    Choose a PDF document
                  </span>

                  <span className="mt-2 text-sm
                  text-slate-400">
                    Maximum file size: 10 MB
                  </span>

                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      setPdf(e.target.files?.[0] || null);
                      setSummary("");
                    }}
                  />
                </label>

                {pdf && (
                  <p className="mt-4 text-sm
                  text-lime-400">
                    Selected: {pdf.name}
                  </p>
                )}

                <ActionButton onClick={summarizePDF}>
                  Summarize Document
                </ActionButton>
              </div>

              <ResultBox
                title="AI Summary"
                content={summary}
              />
            </>
          )}

          {page === "tasks" && (
            <>
              <SectionHeader
                title="🧠 Lazy Task Planner"
                description="Dump your thoughts. Let AI organize them."
              />

              <div className="rounded-2xl border
              border-white/10 bg-[#161d30] p-8">

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Example: I need to finish my Python assignment, prepare for my interview, and complete my presentation..."
                  className="h-48 w-full resize-none
                  rounded-xl border border-white/10
                  bg-[#0b1020] p-5 text-sm
                  leading-7 text-white
                  placeholder:text-slate-500
                  focus:border-lime-400"
                />

                <ActionButton onClick={generateTasks}>
                  Generate My Task List
                </ActionButton>
              </div>

              {tasks.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold">
                    Your Organized Tasks
                  </h3>

                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="rounded-xl border
                      border-white/10 bg-[#161d30]
                      p-5"
                    >
                      <div className="flex items-start
                      justify-between gap-4">
                        <h4 className="font-semibold">
                          {task.title}
                        </h4>

                        <span className={`rounded-full
                        px-3 py-1 text-xs
                        ${
                          task.priority === "High"
                            ? "bg-red-400/10 text-red-400"
                            : task.priority === "Medium"
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "bg-lime-400/10 text-lime-400"
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <p className="mt-2 text-sm
                      text-slate-400">
                        {task.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {page === "organizer" && (
            <>
              <SectionHeader
                title="🗂️ Smart File Organizer"
                description="Upload files and let AI suggest an organized structure."
              />

              <div className="rounded-2xl border
              border-white/10 bg-[#161d30] p-8">

                <label className="flex cursor-pointer
                flex-col items-center rounded-2xl
                border-2 border-dashed border-white/20
                p-12 text-center hover:border-lime-400">

                  <FolderOpen
                    size={42}
                    className="mb-4 text-lime-400"
                  />

                  <span className="font-semibold">
                    Select files to organize
                  </span>

                  <span className="mt-2 text-sm
                  text-slate-400">
                    Up to 20 files, 10 MB each
                  </span>

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      setFiles(e.target.files);
                      setPreview(null);
                      setOrganized(null);
                    }}
                  />
                </label>

                <p className="mt-4 text-sm
                text-slate-400">
                  {files.length} files selected
                </p>

                <ActionButton
                  onClick={previewOrganization}
                >
                  Analyze Files
                </ActionButton>
              </div>

              {preview && (
                <div className="mt-8 rounded-2xl
                border border-white/10
                bg-[#161d30] p-6">

                  <h3 className="mb-5 text-xl
                  font-semibold">
                    AI Organization Preview
                  </h3>

                  <div className="space-y-3">
                    {preview.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap
                        items-center justify-between
                        gap-3 rounded-xl
                        bg-[#0b1020] p-4"
                      >
                        <span className="break-all
                        text-sm">
                          {file.filename}
                        </span>

                        <span className="rounded-full
                        bg-lime-400/10 px-3 py-1
                        text-xs text-lime-400">
                          {file.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  {!organized && (
                    <ActionButton
                      onClick={applyOrganization}
                    >
                      Confirm Organization
                    </ActionButton>
                  )}
                </div>
              )}

              {organized && (
                <ResultBox
                  title="Files Organized Successfully"
                  content={`Organized ${organized.files.length} files.\n\nSaved copies to:\n${organized.output_folder}\n\nYour original uploaded files remain unchanged.`}
                />
              )}
            </>
          )}

          {page === "sloth" && (
            <>
              <SectionHeader
                title="🦥 Activate Sloth Mode"
                description="One document. Multiple useful insights. Minimal effort."
              />

              <div className="rounded-3xl border
              border-lime-400/20 bg-gradient-to-br
              from-[#1d2b30] to-[#161d30]
              p-8 text-center">

                <div className="mb-5 text-7xl">
                  🦥
                </div>

                <h3 className="text-2xl font-bold">
                  Time to Relax!
                </h3>

                <p className="mx-auto mt-3 max-w-lg
                text-sm leading-7 text-slate-400">
                  Upload a PDF and SlothOS will
                  summarize it, identify action
                  items, and suggest priorities.
                </p>

                <label className="mx-auto mt-8
                block max-w-md cursor-pointer
                rounded-xl border-2 border-dashed
                border-white/20 p-8
                hover:border-lime-400">

                  <Upload
                    size={32}
                    className="mx-auto mb-3
                    text-lime-400"
                  />

                  <span className="text-sm">
                    {slothFile
                      ? slothFile.name
                      : "Choose your PDF"}
                  </span>

                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      setSlothFile(
                        e.target.files?.[0] || null
                      );
                      setSlothResult("");
                    }}
                  />
                </label>

                <div className="flex justify-center">
                  <ActionButton
                    onClick={activateSlothMode}
                  >
                    Activate Sloth Mode
                  </ActionButton>
                </div>
              </div>

              <ResultBox
                title="Sloth Mode Results"
                content={slothResult}
              />
            </>
          )}

          <footer className="mt-16 border-t
          border-white/10 pt-6 text-center
          text-xs text-slate-500">
            🦥 SlothOS AI — Slow and Steady.
            Powered by local open-weight AI.
          </footer>

        </div>
      </main>
    </div>
  );
}

export default App;