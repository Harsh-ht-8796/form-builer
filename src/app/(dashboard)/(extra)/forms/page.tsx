"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, Edit, Eye, Copy, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Form {
  id: number
  name: string
  status: "Draft" | "Published"
  submissions: number
  lastModified: string
  createdBy: string
  isPublic: boolean
}

export default function FormsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const forms: Form[] = [
    {
      id: 1,
      name: "Customer Feedback Form",
      status: "Published",
      submissions: 45,
      lastModified: "2 hours ago",
      createdBy: "John Doe",
      isPublic: true,
    },
    {
      id: 2,
      name: "Event Registration",
      status: "Draft",
      submissions: 0,
      lastModified: "1 day ago",
      createdBy: "Jane Smith",
      isPublic: false,
    },
    {
      id: 3,
      name: "Product Survey",
      status: "Published",
      submissions: 123,
      lastModified: "3 days ago",
      createdBy: "John Doe",
      isPublic: true,
    },
    {
      id: 4,
      name: "Contact Form",
      status: "Published",
      submissions: 67,
      lastModified: "1 week ago",
      createdBy: "Alice Johnson",
      isPublic: true,
    },
    {
      id: 5,
      name: "Newsletter Signup",
      status: "Draft",
      submissions: 0,
      lastModified: "2 weeks ago",
      createdBy: "Bob Wilson",
      isPublic: false,
    },
  ]

  const filteredForms = forms.filter((form) => form.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDuplicate = (formId: number) => {
    toast.success("Form duplicated successfully!")
  }

  const handleDelete = (formId: number) => {
    toast.success("Form deleted successfully!")
  }

  const copyFormLink = (formId: number) => {
    const link = `${window.location.origin}/form/${formId}`
    navigator.clipboard.writeText(link)
    toast.success("Form link copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground">Manage all your forms in one place.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
          <CardDescription>A list of all forms in your organization.</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {form.name}
                      {form.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={form.status === "Published" ? "default" : "secondary"}>{form.status}</Badge>
                  </TableCell>
                  <TableCell>{form.submissions}</TableCell>
                  <TableCell>{form.createdBy}</TableCell>
                  <TableCell>{form.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/forms/${form.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/forms/${form.id}/submissions`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Submissions
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/form/${form.id}`} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Form
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyFormLink(form.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(form.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(form.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
