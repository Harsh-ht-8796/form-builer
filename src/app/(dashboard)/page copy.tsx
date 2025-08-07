"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Building2, BarChart3, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Forms",
      value: "12",
      description: "3 published, 9 drafts",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Total Submissions",
      value: "1,234",
      description: "This month: 89",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Organizations",
      value: "2",
      description: "Admin in 1, Member in 1",
      icon: Building2,
      color: "text-purple-600",
    },
    {
      title: "Team Members",
      value: "8",
      description: "Across all organizations",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  const recentForms = [
    { id: 1, name: "Customer Feedback Form", status: "Published", submissions: 45, lastModified: "2 hours ago" },
    { id: 2, name: "Event Registration", status: "Draft", submissions: 0, lastModified: "1 day ago" },
    { id: 3, name: "Product Survey", status: "Published", submissions: 123, lastModified: "3 days ago" },
    { id: 4, name: "Contact Form", status: "Published", submissions: 67, lastModified: "1 week ago" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your form building activity.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Forms</CardTitle>
            <CardDescription>Your recently created and modified forms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentForms.map((form) => (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{form.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={form.status === "Published" ? "default" : "secondary"}>{form.status}</Badge>
                      <span>•</span>
                      <span>{form.submissions} submissions</span>
                      <span>•</span>
                      <span>{form.lastModified}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/forms/${form.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/forms/${form.id}/submissions`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/forms/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Form
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/organizations">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Organizations
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/submissions">
                <BarChart3 className="mr-2 h-4 w-4" />
                View All Submissions
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/team">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Members
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
