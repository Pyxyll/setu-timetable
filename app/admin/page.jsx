"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTimetable } from "@/contexts/TimetableContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const ClassForm = ({ initialData, onSubmit, dialogClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      startTime: "09:15",
      endTime: "10:15",
      module: "",
      moduleCode: "",
      type: "Lecture",
      lecturer: "",
      room: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    dialogClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
<div className="grid grid-cols-2 gap-4">
  <div>
    <Label htmlFor="startTime">Start Time</Label>
    <TimePicker
      value={formData.startTime}
      onChange={(time) => setFormData({ ...formData, startTime: time })}
    />
  </div>
  <div>
    <Label htmlFor="endTime">End Time</Label>
    <TimePicker
      value={formData.endTime}
      onChange={(time) => setFormData({ ...formData, endTime: time })}
    />
  </div>
</div>

      <div>
        <Label htmlFor="module">Module Name</Label>
        <Input
          id="module"
          value={formData.module}
          onChange={(e) => setFormData({ ...formData, module: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="moduleCode">Module Code</Label>
        <Input
          id="moduleCode"
          value={formData.moduleCode}
          onChange={(e) =>
            setFormData({ ...formData, moduleCode: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lecture">Lecture</SelectItem>
            <SelectItem value="Practical">Practical</SelectItem>
            <SelectItem value="Slack Class">Slack Class</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="lecturer">Lecturer</Label>
        <Input
          id="lecturer"
          value={formData.lecturer}
          onChange={(e) =>
            setFormData({ ...formData, lecturer: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="room">Room</Label>
        <Input
          id="room"
          value={formData.room}
          onChange={(e) => setFormData({ ...formData, room: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Class" : "Add Class"}
      </Button>
    </form>
  );
};

const AdminPanel = () => {
  const { timetableData, updateClassStatus, addClass, editClass, deleteClass } =
    useTimetable();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddClass = (day, classData) => {
    const id = `${day}_${classData.startTime.replace(
      ":",
      ""
    )}_${classData.module.replace(/\s+/g, "")}`;
    addClass(day, { ...classData, id });
  };

  const handleEditClass = (day, id, classData) => {
    editClass(day, id, classData);
  };

  const [open, setOpen] = useState(false);

  const handleDeleteClass = (day, id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      deleteClass(day, id);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Timetable Control Panel</h1>
          <ThemeToggle />
        </div>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          View Timetable
        </Button>
      </div>

      {Object.entries(timetableData).map(([day, classes]) => (
        <Card key={day} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{day}</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                </DialogHeader>
                <ClassForm
                  onSubmit={(data) => handleAddClass(day, data)}
                  dialogClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{cls.module}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          cls.type === "Practical"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : cls.type === "Slack Class"
                            ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                        }`}
                      >
                        {cls.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {cls.startTime} - {cls.endTime} | {cls.lecturer} | Room{" "}
                      {cls.room}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDeleteClass(day, cls.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Class</DialogTitle>
                        </DialogHeader>
                        <ClassForm
                          initialData={cls}
                          onSubmit={(data) => {
                            handleEditClass(day, cls.id, data);
                            setOpen(false);
                          }}
                          dialogClose={() => setOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant={
                        cls.status === "cancelled" ? "destructive" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        const newStatus =
                          cls.status === "cancelled" ? undefined : "cancelled";
                        updateClassStatus(day, cls.id, newStatus);
                      }}
                    >
                      {cls.status === "cancelled" ? "Cancelled" : "Running"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminPanel;


const TimePicker = ({ value, onChange }) => {
  const times = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9; // 9AM to 5PM
    return `${hour.toString().padStart(2, '0')}:15`;
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent>
        {times.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};