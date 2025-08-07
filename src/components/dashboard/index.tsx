"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";


import AnalyticsCards from "@/components/dashboard/analyticsCards";
import SimpleTable from "./simpleTable";
import { formData } from "@/components/dashboard/data";




export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Public");

  const filteredData = formData.filter((form) => {
    const matchesSearch = form.formName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || form.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen ">
      <div>
        <div className="mx-auto">
          {/* Date Range Picker */}

          {/* Analytics Cards */}
          <AnalyticsCards />

          {/* My Forms Section */}
          <Card className="bg-white">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Forms
                </h2>

                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Input
                      placeholder="Search Forms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-4 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Type Filter */}
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table */}
              <SimpleTable filteredData={filteredData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
