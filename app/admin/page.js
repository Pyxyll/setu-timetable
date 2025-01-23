'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/theme-toggle';
import { useTimetable } from '@/contexts/TimetableContext';

const AdminPanel = () => {
  const { timetableData, updateClassStatus } = useTimetable();

  const toggleClassStatus = (day, classId) => {
    const currentClass = timetableData[day].find(cls => cls.id === classId);
    const newStatus = currentClass.status === 'cancelled' ? undefined : 'cancelled';
    updateClassStatus(day, classId, newStatus);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Timetable Control Panel</h1>
          <ThemeToggle />
        </div>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          View Timetable
        </Button>
      </div>

      {Object.entries(timetableData).map(([day, classes]) => (
        <Card key={day} className="mb-6">
          <CardHeader>
            <CardTitle>{day}</CardTitle>
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
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        cls.type === 'Practical' 
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : cls.type === 'Slack Class'
                          ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {cls.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {cls.startTime} - {cls.endTime} | {cls.lecturer} | Room {cls.room}
                    </div>
                  </div>
                  <Button
                    variant={cls.status === 'cancelled' ? 'destructive' : 'outline'}
                    onClick={() => toggleClassStatus(day, cls.id)}
                  >
                    {cls.status === 'cancelled' ? 'Cancelled' : 'Running'}
                  </Button>
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