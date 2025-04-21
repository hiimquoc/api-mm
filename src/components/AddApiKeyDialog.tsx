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
import { Plus } from "lucide-react"
import { nanoid } from "nanoid"

interface AddApiKeyDialogProps {
  onAddKey: (key: { name: string; type: string; key: string; user_id: string; usage: number }) => void;
  userId: string;
}

export function AddApiKeyDialog({ onAddKey, userId }: AddApiKeyDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState("dev")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newKey = {
      name,
      type,
      key: `tvly-${nanoid(32)}`,
      user_id: userId,
      usage: 0
    }
    onAddKey(newKey)
    setName("")
    setType("dev")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for your application. You can change the name and type later.
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
          </div>
          <DialogFooter>
            <Button type="submit">Create Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 