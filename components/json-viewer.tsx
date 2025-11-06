"use client"

interface JsonViewerProps {
  data: any
}

export function JsonViewer({ data }: JsonViewerProps) {
  const jsonString = JSON.stringify(data, null, 2)

  return (
    <div className="rounded-md bg-muted/50 border border-border overflow-hidden">
      <pre className="p-4 overflow-x-auto text-xs font-mono">
        <code className="text-foreground">{jsonString}</code>
      </pre>
    </div>
  )
}
