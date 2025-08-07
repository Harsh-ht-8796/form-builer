"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  AlignLeft,
  List,
  CheckCircle,
  Circle,
  Save,
  Eye,
  Settings,
} from "lucide-react"
import { toast } from "sonner"

type FieldType = "text" | "textarea" | "select" | "radio" | "checkbox"

interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface FormSettings {
  title: string
  description: string
  backgroundColor: string
  emailNotifications: string[]
  isPublic: boolean
}

const fieldTypes = [
  { value: "text", label: "Short Text", icon: Type },
  { value: "textarea", label: "Long Text", icon: AlignLeft },
  { value: "select", label: "Select Box", icon: List },
  { value: "radio", label: "Radio Buttons", icon: Circle },
  { value: "checkbox", label: "Checkboxes", icon: CheckCircle },
]

export default function NewFormPage() {
  const [formSettings, setFormSettings] = useState<FormSettings>({
    title: "",
    description: "",
    backgroundColor: "cyan",
    emailNotifications: [],
    isPublic: true,
  })

  const [fields, setFields] = useState<FormField[]>([])
  const [newEmailNotification, setNewEmailNotification] = useState("")

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${fieldTypes.find((ft) => ft.value === type)?.label}`,
      placeholder: "",
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1"] : undefined,
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const addOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId)
    if (field && field.options) {
      updateField(fieldId, {
        options: [...field.options, `Option ${field.options.length + 1}`],
      })
    }
  }

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find((f) => f.id === fieldId)
    if (field && field.options) {
      const newOptions = [...field.options]
      newOptions[optionIndex] = value
      updateField(fieldId, { options: newOptions })
    }
  }

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find((f) => f.id === fieldId)
    if (field && field.options && field.options.length > 1) {
      const newOptions = field.options.filter((_, index) => index !== optionIndex)
      updateField(fieldId, { options: newOptions })
    }
  }

  const addEmailNotification = () => {
    if (newEmailNotification && !formSettings.emailNotifications.includes(newEmailNotification)) {
      setFormSettings({
        ...formSettings,
        emailNotifications: [...formSettings.emailNotifications, newEmailNotification],
      })
      setNewEmailNotification("")
    }
  }

  const removeEmailNotification = (email: string) => {
    setFormSettings({
      ...formSettings,
      emailNotifications: formSettings.emailNotifications.filter((e) => e !== email),
    })
  }

  const saveForm = (status: "draft" | "published") => {
    if (!formSettings.title.trim()) {
      toast.error("Please enter a form title")
      return
    }

    toast.success(`Form ${status === "draft" ? "saved as draft" : "published"} successfully!`)
  }

  const previewForm = () => {
    toast.info("Opening form preview...")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Form</h1>
          <p className="text-muted-foreground">Design your custom form with various field types and settings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewForm}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => saveForm("draft")}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => saveForm("published")}>Publish Form</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Form Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Form Settings
              </CardTitle>
              <CardDescription>Configure your form&apos;s basic information and appearance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  placeholder="Enter form title"
                  value={formSettings.title}
                  onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter form description"
                  value={formSettings.description}
                  onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formSettings.backgroundColor}
                    onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={formSettings.isPublic}
                    onCheckedChange={(checked) => setFormSettings({ ...formSettings, isPublic: checked })}
                  />
                  <Label htmlFor="isPublic">Public Form</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Notifications</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address"
                    value={newEmailNotification}
                    onChange={(e) => setNewEmailNotification(e.target.value)}
                  />
                  <Button onClick={addEmailNotification} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formSettings.emailNotifications.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      {email}
                      <button onClick={() => removeEmailNotification(email)} className="ml-1 hover:text-destructive">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
              <CardDescription>Add and configure fields for your form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No fields added yet. Add your first field using the buttons on the right.
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{fieldTypes.find((ft) => ft.value === field.type)?.label}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeField(field.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Field Label</Label>
                              <Input
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                placeholder="Enter field label"
                              />
                            </div>

                            {field.type === "text" || field.type === "textarea" ? (
                              <div className="space-y-2">
                                <Label>Placeholder</Label>
                                <Input
                                  value={field.placeholder || ""}
                                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                  placeholder="Enter placeholder text"
                                />
                              </div>
                            ) : null}
                          </div>

                          {(field.type === "select" || field.type === "radio" || field.type === "checkbox") &&
                            field.options && (
                              <div className="space-y-2">
                                <Label>Options</Label>
                                <div className="space-y-2">
                                  {field.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex gap-2">
                                      <Input
                                        value={option}
                                        onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                        placeholder={`Option ${optionIndex + 1}`}
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeOption(field.id, optionIndex)}
                                        disabled={field.options!.length <= 1}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button variant="outline" size="sm" onClick={() => addOption(field.id)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option
                                  </Button>
                                </div>
                              </div>
                            )}

                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`required-${field.id}`}
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                            />
                            <Label htmlFor={`required-${field.id}`}>Required field</Label>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Field Types Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Fields</CardTitle>
              <CardDescription>Click on a field type to add it to your form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {fieldTypes.map((fieldType) => (
                <Button
                  key={fieldType.value}
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => addField(fieldType.value as FieldType)}
                >
                  <fieldType.icon className="mr-2 h-4 w-4" />
                  {fieldType.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
              <CardDescription>See how your form will look to users.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="p-4 border rounded-lg min-h-[200px]"
                style={{ backgroundColor: formSettings.backgroundColor }}
              >
                {formSettings.title && <h3 className="text-lg font-semibold mb-2">{formSettings.title}</h3>}
                {formSettings.description && (
                  <p className="text-sm text-muted-foreground mb-4">{formSettings.description}</p>
                )}

                {fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Add fields to see preview</p>
                ) : (
                  <div className="space-y-3">
                    {fields.slice(0, 3).map((field) => (
                      <div key={field.id} className="space-y-1">
                        <Label className="text-sm">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.type === "text" && <Input placeholder={field.placeholder} size={5} />}
                        {field.type === "textarea" && (
                          <Textarea placeholder={field.placeholder} className="min-h-[60px]" />
                        )}
                        {field.type === "select" && (
                          <Select>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </Select>
                        )}
                      </div>
                    ))}
                    {fields.length > 3 && (
                      <p className="text-xs text-muted-foreground">... and {fields.length - 3} more fields</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
