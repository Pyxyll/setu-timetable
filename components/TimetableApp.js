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
import { useTimetableData } from '@/hooks/useTimetableData';
import { Loader2 } from 'lucide-react';


const timeSlots = Array.from({ length: 9 }, (_, i) => `${String(i + 9).padStart(2, '0')}:15`);

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
  const { timetableData, isLoading } = useTimetableData();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [api, setApi] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const days = timetableData ? Object.keys(timetableData) : [];

  // Setup carousel effect handlers
  useEffect(() => {
    if (!api || !days.length) return;

    api.on('select', () => {
      const currentIndex = api.selectedScrollSnap();
      setSelectedDay(days[currentIndex]);
    });

    return () => {
      api.off('select');
    };
  }, [api, days]);

  // Handle URL params and initial day selection
  useEffect(() => {
    if (!days.length || !api) return;

    const urlDay = searchParams.get('day');
    const today = new Date().toLocaleString('en-us', {weekday: 'long'});
    
    if (urlDay && days.includes(urlDay)) {
      setSelectedDay(urlDay);
      api.scrollTo(days.indexOf(urlDay));
    } else if (days.includes(today)) {
      setSelectedDay(today);
      api.scrollTo(days.indexOf(today));
      router.push(`?day=${today}`);
    }
  }, [api, searchParams, days, router]);

  if (isLoading || !timetableData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
          <ThemeToggle />
        </div>
        <div className="flex gap-2 hidden sm:flex">
          {days.map((day) => (
            <Button 
              key={day}
              variant={day === selectedDay ? "default" : "ghost"}
              className="relative"
              onClick={() => {
                const index = days.indexOf(day);
                api?.scrollTo(index);
                setSelectedDay(day);
                router.push(`?day=${day}`);
              }}
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
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TimetableApp;