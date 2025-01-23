'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/theme-toggle'
import { useTimetable } from '@/contexts/TimetableContext';


const timeSlots = Array.from({ length: 9 }, (_, i) => `${String(i + 9).padStart(2, '0')}:15`);

const getGridRow = (time) => {
  const hour = parseInt(time.split(':')[0]);
  return hour - 8;
};

const calculateDuration = (startTime, endTime) => {
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  return endHour - startHour;
};

const CurrentTimeLine = ({ day }) => {
  const [position, setPosition] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      // Check if this is today
      const today = new Date().toLocaleString('en-us', {weekday: 'long'});
      const isToday = today === day;
      setShouldShow(isToday);

      // Get current time
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Only show during timetable hours (9:15 - 17:15)
      if (hours < 9 || (hours === 9 && minutes < 15) || hours >= 17) {
        setShouldShow(false);
        return;
      }

      const currentTime = (hours - 9) * 120 + (minutes / 60) * 120;
      setPosition(currentTime);
    };

    updatePosition();
    // Update every minute
    const interval = setInterval(updatePosition, 60000);

    return () => clearInterval(interval);
  }, [day]);

  if (!shouldShow || position < 0) return null;

  return (
    <div 
      className="absolute left-0 right-0 h-0.5 bg-red-500 z-50"
      style={{
        top: `${position}px`,
      }}
    >
      <div className="absolute -left-1 -top-1.5 w-4 h-4 rounded-full bg-red-500" />
    </div>
  );
};
const TimeTableClass = ({ session }) => {
  const isCancelled = session.status === 'cancelled';

  return (
    <Card className={`h-full shadow-sm transition-colors duration-300 ${
      isCancelled 
        ? 'bg-red-50 dark:bg-red-950' 
        : 'bg-white dark:bg-gray-800'
    }`}>
      <CardContent className="p-3 h-full">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                {session.startTime} - {session.endTime}
              </span>
              <div className="flex gap-2 items-center">
                {isCancelled && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 transition-colors duration-300">
                    Cancelled
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs transition-colors duration-300 ${
                  session.type === 'Practical' 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : session.type === 'Slack Class'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  {session.type}
                </span>
              </div>
            </div>
            
            <h3 className={`text-base font-semibold transition-colors duration-300 ${
              isCancelled 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-gray-50'
            }`}>
              {session.module}
            </h3>
          </div>
          
          <div className={`flex flex-col space-y-1 text-sm transition-colors duration-300 ${
            isCancelled 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-gray-600 dark:text-gray-300'
          }`}>
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


const DayView = ({ day, isActive }) => {
  const { timetableData } = useTimetable();
  return (
    <div className={`w-full ${!isActive ? 'pointer-events-none' : ''}`}>
      <div className="grid grid-cols-[80px_1fr] gap-4">
        <div className="space-y-24 pr-4">
          {timeSlots.map((time) => (
            <div key={time} className="text-sm text-gray-500">{time}</div>
          ))}
        </div>

        <div className="relative h-[1080px]">
        <CurrentTimeLine day={day} />
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
  const { timetableData } = useTimetable();
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
          <span className="text-2xl font-bold">CC & MAD Timetable</span>
          <ThemeToggle />
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