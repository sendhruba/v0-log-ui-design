"use client"

import { useState } from "react"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LogModal } from "./log-modal"

export interface LogEntry {
  id: string
  timestamp: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  endpoint: string
  status: number
  duration: number
  request: Record<string, any>
  response: Record<string, any>
  children?: LogEntry[]
}

interface LogViewerProps {
  logs: LogEntry[]
}

export function LogViewer({ logs }: LogViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-700 dark:text-green-600"
    if (status >= 400 && status < 500) return "text-orange-600 dark:text-orange-500"
    if (status >= 500) return "text-red-600 dark:text-red-500"
    return "text-muted-foreground"
  }

  const getStatusBadgeClass = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
    if (status >= 400 && status < 500)
      return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
    if (status >= 500)
      return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
    return "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800"
  }

  const getMethodClass = (method: string) => {
    const methodMap: Record<string, string> = {
      GET: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      POST: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
      PUT: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      DELETE: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      PATCH:
        "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    }
    return methodMap[method] || methodMap.GET
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.status.toString().includes(searchQuery) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalChildren = logs.reduce((acc, log) => acc + (log.children?.length || 0), 0)

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-background">
      {/* Header */}
      <div className="border-b border-gray-300 dark:border-border bg-white dark:bg-card px-6 py-4">
        <div className="mb-4">
          <h1 className="text-3xl font-serif text-gray-900 dark:text-foreground">Request Logs</h1>
          <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">
            Monitor and investigate API request/response logs
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by ID, endpoint, method, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-background border-gray-300 dark:border-border"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-gray-200 dark:border-border bg-gray-50 dark:bg-card/50 px-6 py-2">
        <div className="flex items-center gap-6 text-xs text-gray-600 dark:text-muted-foreground">
          <span>
            <strong className="text-gray-900 dark:text-foreground">{logs.length}</strong> parent logs
          </span>
          <span>
            <strong className="text-gray-900 dark:text-foreground">{totalChildren}</strong> child operations
          </span>
          <span>
            <strong className="text-gray-900 dark:text-foreground">{filteredLogs.length}</strong> filtered
          </span>
        </div>
      </div>

      {/* Log List */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-background">
        <div className="divide-y divide-gray-200 dark:divide-border">
          {filteredLogs.map((log) => (
            <button
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className="w-full px-6 py-3 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-accent/5 transition-colors text-left group"
            >
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-primary transition-colors flex-shrink-0 mt-1" />

              <div className="flex-1 min-w-0">
                {/* Title/Endpoint */}
                <div className="font-medium text-sm text-blue-600 dark:text-primary mb-2 truncate group-hover:underline">
                  {log.endpoint}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-1.5 text-xs">
                  {/* ID */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 dark:text-muted-foreground font-medium">ID:</span>
                    <span className="font-mono text-gray-700 dark:text-foreground">{log.id}</span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 dark:text-muted-foreground font-medium">Time:</span>
                    <span className="font-mono text-gray-700 dark:text-foreground">{log.timestamp}</span>
                  </div>

                  {/* Method */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 dark:text-muted-foreground font-medium">Method:</span>
                    <span
                      className={`font-mono font-semibold px-1.5 py-0.5 rounded border text-[10px] ${getMethodClass(log.method)}`}
                    >
                      {log.method}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 dark:text-muted-foreground font-medium">Status:</span>
                    <span
                      className={`font-mono font-semibold px-1.5 py-0.5 rounded border text-[10px] ${getStatusBadgeClass(log.status)}`}
                    >
                      {log.status}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 dark:text-muted-foreground font-medium">Duration:</span>
                    <span className="font-mono text-gray-700 dark:text-foreground">{log.duration}ms</span>
                  </div>
                </div>

                {/* Children Count */}
                {log.children && log.children.length > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-muted-foreground bg-gray-100 dark:bg-muted px-2 py-0.5 rounded">
                    <span className="font-medium">{log.children.length}</span>
                    <span>child operation{log.children.length !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-muted-foreground">
            No logs found matching your search.
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedLog && <LogModal log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  )
}
