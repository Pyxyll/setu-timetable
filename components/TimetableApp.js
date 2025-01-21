'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

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
            "room": "FTG15",
            "status": "cancelled"
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
            "room": "FTG14",
            "status": "cancelled"
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
            "room": "D04",
            "status": "cancelled"
        },
        {
            "startTime": "13:15",
            "endTime": "15:15",
            "module": "Digital Graphics",
            "moduleCode": "DESG-0056-WD_KMULA_D",
            "type": "Practical",
            "lecturer": "O Riordan, Sinead",
            "room": "IT101",
            "status": "cancelled"
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
            "room": "IT201",
            "status": "cancelled"
            
        },
        {
            "startTime": "14:15",
            "endTime": "16:15",
            "module": "NoSQL Database",
            "moduleCode": "COMP-0661-WD_KCRCO_B",
            "type": "Practical",
            "lecturer": "Power, Clodagh",
            "room": "IT220",
            "status": "cancelled"
        }
    ]
};
const TimeTableClass = ({ session }) => {
  const isCancelled = session.status === 'cancelled';

  return (
    <Card className={`h-full shadow-sm ${isCancelled ? 'bg-red-50' : ''}`}>
      <CardContent className="p-3 h-full">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">
                {session.startTime} - {session.endTime}
              </span>
              <div className="flex gap-2 items-center">
                {isCancelled && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                    Cancelled
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  session.type === 'Practical' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-purple-50 text-purple-700'
                }`}>
                  {session.type}
                </span>
              </div>
            </div>
            
            <h3 className={`text-base font-semibold ${isCancelled ? 'line-through text-gray-500' : ''}`}>
              {session.module}
            </h3>
          </div>
          
          <div className={`flex flex-col space-y-1 text-sm ${isCancelled ? 'text-gray-400' : 'text-gray-600'}`}>
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

const DayView = ({ day, isActive }) => {
  return (
    <div className={`w-full ${!isActive ? 'pointer-events-none' : ''}`}>
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
    </div>
  );
};

const TimetableApp = () => {
  const days = Object.keys(timetableData);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [api, setApi] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize with URL param day or today's day
  useEffect(() => {
    const urlDay = searchParams.get('day');
    const today = new Date().toLocaleString('en-us', {weekday: 'long'});
    
    if (urlDay && days.includes(urlDay)) {
      setSelectedDay(urlDay);
      if (api) {
        api.scrollTo(days.indexOf(urlDay));
      }
    } else if (days.includes(today)) {
      setSelectedDay(today);
      if (api) {
        api.scrollTo(days.indexOf(today));
      }
      // Update URL with today's day
      router.push(`?day=${today}`);
    }
  }, [api, searchParams]);

  // Handle carousel selection changes
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      const currentIndex = api.selectedScrollSnap();
      const newDay = days[currentIndex];
      setSelectedDay(newDay);
      router.push(`?day=${newDay}`);
    });

    return () => {
      api.off('select');
    };
  }, [api, days, router]);

  const handleDayClick = (day) => {
    const index = days.indexOf(day);
    setSelectedDay(day);
    api?.scrollTo(index);
    router.push(`?day=${day}`);
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8" viewBox="0 0 40 40">
            <rect x="4" y="4" width="32" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="4" y1="12" x2="36" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="4" x2="12" y2="36" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="14" width="8" height="8" fill="currentColor" opacity="0.2"/>
            <rect x="24" y="24" width="8" height="8" fill="currentColor" opacity="0.2"/>
          </svg>
          <span className="text-2xl font-bold">MTU Schedule</span>
        </div>
        <div className="flex gap-2 hidden sm:flex">
          {days.map((day) => (
            <Button
              key={day}
              variant={day === selectedDay ? "default" : "ghost"}
              className="relative"
              onClick={() => handleDayClick(day)}
            >
              {day}
              {day === selectedDay && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-foreground rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile day indicator */}
      <div className="sm:hidden text-center mb-4 text-lg font-semibold">
        {selectedDay}
      </div>
      
      <Carousel 
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
        orientation="horizontal"
      >
        <CarouselContent>
          {days.map((day) => (
            <CarouselItem key={day}>
              <DayView day={day} isActive={day === selectedDay} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TimetableApp;