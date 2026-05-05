"use client"

import { useState } from "react"
import { Plus, X, Upload, FileJson, Video, FileText } from "lucide-react"
import { createChapter } from "./actions"

interface ChapterFormProps {
  gradeId: string
}

export const ChapterForm = ({ gradeId }: ChapterFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quizJson, setQuizJson] = useState<any>(null)
  const [contentType, setContentType] = useState<"video" | "pdf">("video")

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string)
          setQuizJson(json)
        } catch (err) {
          alert("Invalid JSON format")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!quizJson) {
      alert("Please upload Quiz JSON first")
      return
    }
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createChapter(gradeId, formData, quizJson)
      setIsOpen(false)
      setQuizJson(null)
    } catch (err) {
      alert("Error creating chapter")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-12 py-3.5 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-500"
      >
        <Plus className="h-5 w-5" />
        Add New Chapter
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-md">
          <div className="glass-card relative my-auto w-full max-w-2xl animate-in p-6 md:p-10 duration-300 fade-in slide-in-from-bottom-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-7 w-7" />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">Add New Chapter</h2>
              <p className="text-muted-foreground">
                Upload lesson content and quiz details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Chapter Number
                  </label>
                  <input
                    name="chapterNo"
                    type="number"
                    required
                    placeholder="e.g. 1"
                    className="w-full rounded-2xl border border-border bg-white px-5 py-4 shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Chapter Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. Living Things"
                    className="w-full rounded-2xl border border-border bg-white px-5 py-4 shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex w-fit items-center gap-4 rounded-2xl border border-border bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => setContentType("video")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${contentType === "video" ? "bg-indigo-600 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Video className="h-4 w-4" />
                    Video URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType("pdf")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${contentType === "pdf" ? "bg-indigo-600 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <FileText className="h-4 w-4" />
                    PDF URL
                  </button>
                </div>

                {contentType === "video" ? (
                  <>
                    <input
                      name="videoUrl"
                      type="url"
                      required
                      placeholder="Enter Google Drive preview URL..."
                      className="w-full rounded-2xl border border-border bg-white px-5 py-4 shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                    />
                    <p className="text-md">
                      Note:{" "}
                      <span className="text-red-500">
                        Use Google Drive preview URL only. Do not use the actual
                        file URL. for e.g:
                        https://drive.google.com/file/d/your_file_id/preview
                        replace your view with{" "}
                        <span className="font-extrabold text-red-900">
                          preview
                        </span>{" "}
                        at the end of link
                      </span>
                    </p>
                  </>
                ) : (
                  <input
                    name="pdfUrl"
                    type="url"
                    required
                    placeholder="Enter PDF public URL..."
                    className="w-full rounded-2xl border border-border bg-white px-5 py-4 shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Quiz JSON Data
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleJsonUpload}
                    className="hidden"
                    id="json-upload"
                  />
                  <label
                    htmlFor="json-upload"
                    className={`flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 transition-all ${
                      quizJson
                        ? "border-green-200 bg-green-50 text-green-600"
                        : "border-border bg-white text-muted-foreground hover:border-border/80 hover:bg-secondary"
                    }`}
                  >
                    {quizJson ? (
                      <>
                        <div className="rounded-full bg-green-100 p-4">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold">
                            JSON Uploaded: {quizJson.title}
                          </p>
                          <p className="text-xs opacity-60">
                            {quizJson.questions.length} Questions found
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-full bg-secondary p-4">
                          <Upload className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold">Click to upload Quiz JSON</p>
                          <p className="text-xs">
                            Must contain title and questions array
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 py-5 text-lg font-bold shadow-xl shadow-indigo-500/30 transition-all hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Create Chapter"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

// Helper for check icon since I missed importing it above
import { CheckCircle2 } from "lucide-react"
