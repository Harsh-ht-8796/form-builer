"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye } from "lucide-react"
import { toast } from "sonner"

interface Submission {
  id: number
  formName: string
  submittedAt: string
  submittedBy: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
  status: "New" | "Reviewed" | "Processed"
}

export default function SubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedForm, setSelectedForm] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const submissions: Submission[] = [
    {
      id: 1,
      formName: "Customer Feedback Form",
      submittedAt: "2024-01-15 10:30 AM",
      submittedBy: "john@example.com",
      data: {
        name: "John Smith",
        email: "john@example.com",
        rating: "5",
        feedback: "Great service!",
      },
      status: "New",
    },
    {
      id: 2,
      formName: "Product Survey",
      submittedAt: "2024-01-15 09:15 AM",
      submittedBy: "jane@example.com",
      data: {
        name: "Jane Doe",
        product: "Widget Pro",
        satisfaction: "Very Satisfied",
        recommend: "Yes",
      },
      status: "Reviewed",
    },
    {
      id: 3,
      formName: "Contact Form",
      submittedAt: "2024-01-14 03:45 PM",
      submittedBy: "bob@example.com",
      data: {
        name: "Bob Johnson",
        email: "bob@example.com",
        subject: "Partnership Inquiry",
        message: "Interested in partnership opportunities",
      },
      status: "Processed",
    },
    {
      id: 4,
      formName: "Customer Feedback Form",
      submittedAt: "2024-01-14 11:20 AM",
      submittedBy: "alice@example.com",
      data: {
        name: "Alice Brown",
        email: "alice@example.com",
        rating: "4",
        feedback: "Good experience overall",
      },
      status: "New",
    },
  ]

  const forms = ["Customer Feedback Form", "Product Survey", "Contact Form", "Event Registration"]

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(submission.data).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesForm = selectedForm === "all" || submission.formName === selectedForm
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter

    return matchesSearch && matchesForm && matchesStatus
  })

  const exportSubmissions = () => {
    toast.success("Submissions exported successfully!")
  }

  const viewSubmission = (submissionId: number) => {
    toast.info(`Opening submission ${submissionId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
          <p className="text-muted-foreground">View and manage all form submissions across your organization.</p>
        </div>
        <Button onClick={exportSubmissions}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>Filter and search through all form submissions.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedForm} onValueChange={setSelectedForm}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                {forms.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Processed">Processed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.formName}</TableCell>
                  <TableCell>{submission.submittedBy}</TableCell>
                  <TableCell>{submission.submittedAt}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        submission.status === "New"
                          ? "default"
                          : submission.status === "Reviewed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(submission.data)
                        .slice(0, 2)
                        .map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {value.toString().slice(0, 30)}
                            {value.toString().length > 30 && "..."}
                          </div>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => viewSubmission(submission.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No submissions found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
