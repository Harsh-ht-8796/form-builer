"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Building2, Users, Mail, Settings } from "lucide-react"
import { toast } from "sonner"

interface Organization {
  id: number
  name: string
  locality: string
  role: "Admin" | "Member"
  members: number
  forms: number
  createdAt: string
}

interface TeamMember {
  id: number
  name: string
  email: string
  role: "Admin" | "Member"
  joinedAt: string
  avatar?: string
}

export default function OrganizationsPage() {
  const [newOrgName, setNewOrgName] = useState("")
  const [newOrgLocality, setNewOrgLocality] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [selectedOrg, setSelectedOrg] = useState<number | null>(null)

  const organizations: Organization[] = [
    {
      id: 1,
      name: "Acme Corporation",
      locality: "New York, NY",
      role: "Admin",
      members: 12,
      forms: 8,
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Tech Startup Inc",
      locality: "San Francisco, CA",
      role: "Member",
      members: 5,
      forms: 3,
      createdAt: "2024-01-15",
    },
  ]

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@acme.com",
      role: "Admin",
      joinedAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@acme.com",
      role: "Admin",
      joinedAt: "2024-01-02",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@acme.com",
      role: "Member",
      joinedAt: "2024-01-10",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@acme.com",
      role: "Member",
      joinedAt: "2024-01-15",
    },
  ]

  const createOrganization = () => {
    if (!newOrgName.trim()) {
      toast.error("Please enter an organization name")
      return
    }
    toast.success("Organization created successfully!")
    setNewOrgName("")
    setNewOrgLocality("")
  }

  const inviteMember = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address")
      return
    }
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage your organizations and team members.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>Set up a new organization to manage forms and team members.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  placeholder="Enter organization name"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locality">Locality</Label>
                <Input
                  id="locality"
                  placeholder="Enter locality (e.g., New York, NY)"
                  value={newOrgLocality}
                  onChange={(e) => setNewOrgLocality(e.target.value)}
                />
              </div>
              <Button onClick={createOrganization} className="w-full">
                Create Organization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {organizations.map((org) => (
          <Card key={org.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription>{org.locality}</CardDescription>
                  </div>
                </div>
                <Badge variant={org.role === "Admin" ? "default" : "secondary"}>{org.role}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {org.members} members
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {org.forms} forms
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setSelectedOrg(org.id)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedOrg && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage team members for {organizations.find((o) => o.id === selectedOrg)?.name}
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>Send an invitation to join your organization.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="inviteEmail">Email Address</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={inviteMember} className="w-full">
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.role === "Admin" ? "default" : "secondary"}>{member.role}</Badge>
                    </TableCell>
                    <TableCell>{member.joinedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
