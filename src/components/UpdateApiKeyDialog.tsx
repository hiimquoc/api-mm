"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"

interface ApiKey {
  id: string;
  name: string;
  type: string;
  usage: number;
  key: string;
}

interface UpdateApiKeyDialogProps {
  apiKey: ApiKey;
  onUpdateKey: (id: string, updates: Partial<ApiKey>) => void;
}

export function UpdateApiKeyDialog({ apiKey, onUpdateKey }: UpdateApiKeyDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState(apiKey.name)
  const [type, setType] = React.useState(apiKey.type)

  React.useEffect(() => {
    setName(apiKey.name)
    setType(apiKey.type)
  }, [apiKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateKey(apiKey.id, { name, type })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit API key"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
            <DialogDescription>
              Update your API key details. Changes will be applied immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="My API Key"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="dev">Development</option>
                <option value="prod">Production</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Key
              </Label>
              <div className="col-span-3 font-mono text-sm bg-muted p-2 rounded-md">
                {apiKey.key}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Usage
              </Label>
              <div className="col-span-3">
                {apiKey.usage}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 