'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Import your timetable data
const initialTimetableData = {
    "Monday": [
      {
        "id": "M_0915_NoSQL", 
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
        "id": "M_1015_SoftEng", 
        "startTime": "10:15",
        "endTime": "11:15",
        "module": "Software Engineering",
        "moduleCode": "COMP-0103-WD_KCRCO_B",
        "type": "Lecture",
        "lecturer": "O Neill, Sinead M",
        "room": "TL251"
      },
      {
        "id": "M_1315_MultiNet", 
        "startTime": "13:15",
        "endTime": "15:15",
        "module": "Multimedia Networks",
        "moduleCode": "COMP-0966-WD_KCRCO_B",
        "type": "Lecture",
        "lecturer": "White, Lucy",
        "room": "TL251"
      },
      {
        "id": "M_1515_SoftEng2", 
        "startTime": "15:15",
        "endTime": "16:15",
        "module": "Software Engineering",
        "moduleCode": "COMP-0103-WD_KCRCO_B",
        "type": "Lecture",
        "lecturer": "O Neill, Sinead M",
        "room": "TL251"
      },
      {
        "id": "M_1615_3DAnim", 
        "startTime": "16:15",
        "endTime": "17:15",
        "module": "3D Animation",
        "moduleCode": "COMP-0965-WD_KCRCO_B",
        "type": "Slack Class",
        "lecturer": "Mc Inerney, Patrick T",
        "room": "Elsewhere"
      }
    ],
    "Tuesday": [
      {
        "id": "T_0915_WebApp", 
        "startTime": "09:15",
        "endTime": "11:15",
        "module": "Web App Development",
        "moduleCode": "COMP-0597-WD_KCRCO_B",
        "type": "Practical",
        "lecturer": "Birney, Rosanne",
        "room": "ITG19"
      },
      {
        "id": "T_1115_DigGraph", 
        "startTime": "11:15",
        "endTime": "13:15",
        "module": "Digital Graphics",
        "moduleCode": "DESG-0056-WD_KMULA_D",
        "type": "Practical",
        "lecturer": "O Riordan, Sinead",
        "room": "IT101"
      },
      {
        "id": "T_1415_3DAnim2", 
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
        "id": "W_0915_WebApp2", 
        "startTime": "09:15",
        "endTime": "11:15",
        "module": "Web App Development",
        "moduleCode": "COMP-0597-WD_KCRCO_B",
        "type": "Lecture",
        "lecturer": "Birney, Rosanne",
        "room": "E19A"
      },
      {
        "id": "W_1115_NoSQL2", 
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
        "id": "W_1215_MultiNet2", 
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
        "id": "Th_1115_MultiNet3", 
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
        "id": "Th_1315_DigGraph2", 
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
        "id": "F_1115_SoftEng3", 
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
        "id": "F_1415_NoSQL3", 
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

  const TimetableContext = createContext();

  export function TimetableProvider({ children }) {
      const [timetableData, setTimetableData] = useState(initialTimetableData);
      const [isLoading, setIsLoading] = useState(true);
  
      // Load initial data
      useEffect(() => {
          const loadData = async () => {
              try {
                  const response = await fetch('/api/timetable');
                  if (response.ok) {
                      const data = await response.json();
                      setTimetableData(data);
                  }
              } catch (error) {
                  console.error('Failed to load timetable data:', error);
              } finally {
                  setIsLoading(false);
              }
          };
  
          loadData();
      }, []);
  
      const updateClassStatus = async (day, classId, newStatus) => {
          // Update local state
          const newData = {
              ...timetableData,
              [day]: timetableData[day].map(cls => 
                  cls.id === classId 
                      ? { ...cls, status: newStatus }
                      : cls
              )
          };
          
          setTimetableData(newData);
  
          // Persist to Vercel Blob
          try {
              await fetch('/api/timetable', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newData)
              });
          } catch (error) {
              console.error('Failed to save timetable data:', error);
              // Optionally revert the local state if save fails
              setTimetableData(timetableData);
          }
      };
  
      if (isLoading) {
          return <div>Loading timetable...</div>;
      }
  
      return (
          <TimetableContext.Provider value={{ timetableData, updateClassStatus }}>
              {children}
          </TimetableContext.Provider>
      );
  }
  
  export function useTimetable() {
      const context = useContext(TimetableContext);
      if (!context) {
          throw new Error('useTimetable must be used within a TimetableProvider');
      }
      return context;
  }