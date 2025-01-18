'use client'

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const timeSlots = Array.from({ length: 9 }, (_, i) => `${String(i + 9).padStart(2, '0')}:15`);


const timetableData = {
    "Monday": [
        {
            "startTime": "09:15",
            "endTime": "10:15",
            "module": "NoSQL Database",
            "moduleCode": "COMP-0661-WD_KCRCO_B",
            "type": "Lecture",
            "lecturer": "Power, Clodagh",
            "room": "FTG15"
        },
        {
            "startTime": "10:15",
            "endTime": "11:15",
            "module": "Software Engineering",
            "moduleCode": "COMP-0103-WD_KCRCO_B",
            "type": "Lecture",
            "lecturer": "O Neill, Sinead M",
            "room": "TL251"
        },
        {
            "startTime": "13:15",
            "endTime": "15:15",
            "module": "Multimedia Networks",
            "moduleCode": "COMP-0966-WD_KCRCO_B",
            "type": "Lecture",
            "lecturer": "White, Lucy",
            "room": "TL251"
        },
        {
            "startTime": "15:15",
            "endTime": "16:15",
            "module": "Software Engineering",
            "moduleCode": "COMP-0103-WD_KCRCO_B",
            "type": "Lecture",
            "lecturer": "O Neill, Sinead M",
            "room": "TL251"
        },
        {
            "startTime": "16:15",
            "endTime": "17:15",
            "module": "3D Animation",
            "moduleCode": "COMP-0965-WD_KCRCO_B",
            "type": "Lecture",
            "lecturer": "Mc Inerney, Patrick T",
            "room": "F28"
        }
    ],
    "Tuesday": [
        {
            "startTime": "09:15",
            "endTime": "11:15",
            "module": "Web App Development",
            "moduleCode": "COMP-0597-WD_KCRCO_B",
            "type": "Practical",
            "lecturer": "Birney, Rosanne",
            "room": "ITG19"
        },
        {
            "startTime": "11:15",
            "endTime": "13:15",
            "module": "Digital Graphics",
            "moduleCode": "DESG-0056-WD_KMULA_D",
            "type": "Practical",
            "lecturer": "O Riordan, Sinead",
            "room": "IT101"
        },
        {
            "startTime": "14:15",
            "endTime": "17:15",
            "module": "3D Animation",
            "moduleCode": "COMP-0965-WD_KCRCO_B",
            "type": "Practical",
            "lecturer": "Mc Inerney, Patrick T",
            "room": "IT102"
        }
    ],
    "Wednesday": [
        {
            "startTime": "09:15",
            "endTime": "11:15",
            "module": "Web App Development",
            "moduleCode": "COMP-0597-WD_KCRCO_B",
            "type": "Lecture",
            "lecturer": "Birney, Rosanne",
            "room": "E19A"
        },
        {
            "startTime": "11:15",
            "endTime": "12:15",
            "module": "NoSQL Database",
            "moduleCode": "COMP-0661-WD_KCRCO_B",
            "type": "Lecture",
            "lecturer": "Power, Clodagh",
            "room": "FTG14"
        },
        {
            "startTime": "12:15",
            "endTime": "13:15",
            "module": "Multimedia Networks",
            "moduleCode": "COMP-0966-WD_KCRCO_B",
            "type": "Lecture",
            "lecturer": "White, Lucy",
            "room": "FTG23"
        }
    ],
    "Thursday": [
        {
            "startTime": "11:15",
            "endTime": "13:15",
            "module": "Multimedia Networks",
            "moduleCode": "COMP-0966-WD_KCRCO_B",
            "type": "Practical",
            "lecturer": "White, Lucy",
            "room": "D04"
        },
        {
            "startTime": "13:15",
            "endTime": "15:15",
            "module": "Digital Graphics",
            "moduleCode": "DESG-0056-WD_KMULA_D",
            "type": "Practical",
            "lecturer": "O Riordan, Sinead",
            "room": "IT101"
        }
    ],
    "Friday": [
        {
            "startTime": "11:15",
            "endTime": "13:15",
            "module": "Software Engineering",
            "moduleCode": "COMP-0103-WD_KCRCO_B",
            "type": "Practical",
            "lecturer": "O Neill, Sinead M",
            "room": "IT201"
        },
        {
            "startTime": "14:15",
            "endTime": "16:15",
            "module": "NoSQL Database",
            "moduleCode": "COMP-0661-WD_KCRCO_B",
            "type": "Practical",
            "lecturer": "Power, Clodagh",
            "room": "IT220"
        }
    ]
};
const TimeTableClass = ({ session }) => {
    return (
      <Card className="h-full shadow-sm">
        <CardContent className="p-3 h-full">
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">
                  {session.startTime} - {session.endTime}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  session.type === 'Practical' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-purple-50 text-purple-700'
                }`}>
                  {session.type}
                </span>
              </div>
              
              <h3 className="text-base font-semibold">{session.module}</h3>
            </div>
            
            <div className="flex flex-col space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <span>Lecturer:</span>
                <span className="ml-1">{session.lecturer}</span>
              </div>
              <div className="flex items-center">
                <span>Room:</span>
                <span className="ml-1">{session.room}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const getGridRow = (time) => {
    const hour = parseInt(time.split(':')[0]);
    return hour - 8;
  };
  
  const calculateDuration = (startTime, endTime) => {
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    return endHour - startHour;
  };
  
  const TimetableApp = () => {
    const days = Object.keys(timetableData);
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [direction, setDirection] = useState('right');
  
    useEffect(() => {
      const today = new Date().toLocaleString('en-us', {weekday: 'long'});
      if (days.includes(today)) {
        setSelectedDay(today);
      }
    }, [days]);
  
    const handleDayChange = (newDay) => {
      const currentIndex = days.indexOf(selectedDay);
      const newIndex = days.indexOf(newDay);
      setDirection(newIndex > currentIndex ? 'right' : 'left');
      setSelectedDay(newDay);
    };
  
    const getAnimationClasses = () => {
      const baseClasses = 'data-[state=active]:animate-in data-[state=inactive]:animate-out data-[state=inactive]:fade-out-50 data-[state=active]:fade-in-50';
      return `${baseClasses} ${
        direction === 'right' 
          ? 'data-[state=inactive]:slide-out-to-left data-[state=active]:slide-in-from-right'
          : 'data-[state=inactive]:slide-out-to-right data-[state=active]:slide-in-from-left'
      }`;
    };
  
    if (!selectedDay) return null;
  
    return (
      <div className="w-full mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">College Timetable</h1>
        
        <Tabs 
          defaultValue={selectedDay} 
          onValueChange={handleDayChange} 
          className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-5">
            {days.map((day) => (
              <TabsTrigger 
                key={day} 
                value={day}
                className="text-sm"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
  
          {days.map((day) => (
            <TabsContent 
              key={day} 
              value={day}
              className={getAnimationClasses()}
            >
              <div className="grid grid-cols-[80px_1fr] gap-4">
                <div className="space-y-24 pr-4">
                  {timeSlots.map((time) => (
                    <div key={time} className="text-sm text-gray-500">{time}</div>
                  ))}
                </div>
  
                <div className="relative h-[1080px]">
                  {timetableData[day].map((session, index) => {
                    const startRow = getGridRow(session.startTime);
                    const duration = calculateDuration(session.startTime, session.endTime);
                    
                    return (
                      <div
                        key={index}
                        className="absolute w-full px-2"
                        style={{
                          top: `${(startRow - 1) * 120}px`,
                          height: `${duration * 120}px`
                        }}
                      >
                        <TimeTableClass session={session} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };
  
  export default TimetableApp;