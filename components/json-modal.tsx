"use client"

import { X, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JsonViewer } from "./json-viewer"
import { useState } from "react"

interface JsonModalProps {
  title: string
  data: any
  isOpen: boolean
  onClose: () => void
  type: "request" | "response"
}

export function JsonModal({ title, data, isOpen, onClose, type }: JsonModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${type === "request" ? "bg-primary" : "bg-success"}`}></span>
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2 text-sm">{copied ? "Copied!" : "Copy"}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <JsonViewer data={data} />
          </div>
        </div>
      </div>
    </>
  )
}
