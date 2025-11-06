"use client"

import { X, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JsonModal } from "./json-modal"
import type { LogEntry } from "./log-viewer"
import { useState } from "react"

interface LogModalProps {
  log: LogEntry
  isOpen: boolean
  onClose: () => void
}

interface NestedLogItemProps {
  child: LogEntry
  level: number
}

function NestedLogItem({ child, level }: NestedLogItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [jsonModal, setJsonModal] = useState<{ type: "request" | "response"; data: any } | null>(null)

  const getStatusBadgeClass = (status: number) => {
    if (status >= 200 && status < 300) return "log-status-success"
    if (status >= 400 && status < 500) return "log-status-warning"
    if (status >= 500) return "log-status-error"
    return "log-status-info"
  }

  const getMethodClass = (method: string) => {
    const methodMap: Record<string, string> = {
      GET: "log-method-get",
      POST: "log-method-post",
      PUT: "log-method-put",
      DELETE: "log-method-delete",
      PATCH: "log-method-patch",
    }
    return methodMap[method] || "log-method-get"
  }

  const borderLeftWidth = level > 0 ? `${level * 2}px` : "0px"

  return (
    <>
      <div className="nested-log-item" style={{ borderLeftWidth, borderLeftColor: "var(--border)" }}>
        {/* Child Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-accent/10 transition-colors text-left"
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto_auto] gap-2 md:gap-4 items-center min-w-0">
            <span className="log-timestamp text-xs">{child.timestamp}</span>
            <span className="font-mono text-xs text-foreground truncate">{child.endpoint}</span>
            <span className={`log-method text-xs ${getMethodClass(child.method)} px-2 py-0.5 rounded`}>
              {child.method}
            </span>
            <span className={`log-status-badge text-xs ${getStatusBadgeClass(child.status)} px-2 py-0.5 rounded`}>
              {child.status}
            </span>
            <span className="text-xs text-muted-foreground font-mono">{child.duration}ms</span>
          </div>

          {child.children && child.children.length > 0 && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0">
              +{child.children.length}
            </span>
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-border bg-muted/10" style={{ paddingLeft: `${16 + level * 16}px` }}>
            <div className="px-4 py-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setJsonModal({ type: "request", data: child.request })
                }}
                className="text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                View Request
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setJsonModal({ type: "response", data: child.response })
                }}
                className="text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-success mr-2"></span>
                View Response
              </Button>
            </div>

            {/* Recursively render nested children */}
            {child.children && child.children.length > 0 && (
              <div className="border-t border-border/50">
                {child.children.map((nestedChild) => (
                  <NestedLogItem key={nestedChild.id} child={nestedChild} level={level + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {jsonModal && (
        <JsonModal
          title={`${child.endpoint} - ${jsonModal.type === "request" ? "Request" : "Response"}`}
          data={jsonModal.data}
          isOpen={true}
          onClose={() => setJsonModal(null)}
          type={jsonModal.type}
        />
      )}
    </>
  )
}

export function LogModal({ log, isOpen, onClose }: LogModalProps) {
  const [jsonModal, setJsonModal] = useState<{ type: "request" | "response"; data: any } | null>(null)

  if (!isOpen) return null

  const getStatusBadgeClass = (status: number) => {
    if (status >= 200 && status < 300) return "log-status-success"
    if (status >= 400 && status < 500) return "log-status-warning"
    if (status >= 500) return "log-status-error"
    return "log-status-info"
  }

  const getMethodClass = (method: string) => {
    const methodMap: Record<string, string> = {
      GET: "log-method-get",
      POST: "log-method-post",
      PUT: "log-method-put",
      DELETE: "log-method-delete",
      PATCH: "log-method-patch",
    }
    return methodMap[method] || "log-method-get"
  }

  const countAllChildren = (entry: LogEntry): number => {
    if (!entry.children || entry.children.length === 0) return 0
    return entry.children.reduce((acc, child) => acc + 1 + countAllChildren(child), 0)
  }

  const totalChildren = countAllChildren(log)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-1">Log Details</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="log-timestamp">{log.timestamp}</span>
                <span className={`log-method ${getMethodClass(log.method)}`}>{log.method}</span>
                <span className="font-mono text-foreground">{log.endpoint}</span>
                <span className={`log-status-badge ${getStatusBadgeClass(log.status)}`}>{log.status}</span>
                <span className="text-muted-foreground font-mono">{log.duration}ms</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Parent Log Data</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setJsonModal({ type: "request", data: log.request })}
                >
                  <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                  View Request
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setJsonModal({ type: "response", data: log.response })}
                >
                  <span className="w-2 h-2 rounded-full bg-success mr-2"></span>
                  View Response
                </Button>
              </div>
            </div>

            {/* Children Section */}
            {log.children && log.children.length > 0 && (
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  Child Operations ({totalChildren} total)
                </h3>
                <div className="border border-border rounded-lg overflow-hidden bg-card">
                  {log.children.map((child) => (
                    <NestedLogItem key={child.id} child={child} level={0} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {jsonModal && (
        <JsonModal
          title={`${log.endpoint} - ${jsonModal.type === "request" ? "Request" : "Response"}`}
          data={jsonModal.data}
          isOpen={true}
          onClose={() => setJsonModal(null)}
          type={jsonModal.type}
        />
      )}
    </>
  )
}
