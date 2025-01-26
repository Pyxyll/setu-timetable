'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Loader from '@/components/ui/loader';
import { v4 as uuidv4 } from 'uuid';

// Import your timetable data
const initialTimetableData = {
  "Monday": [
    {
      "id": "M_0915_SoftEng",
      "startTime": "09:15",
      "endTime": "10:15",
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
      "id": "M_1515_SoftEng",
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
      "type": "Practical",
      "lecturer": "Mc Inerney, Patrick T",
      "room": "F28"
    }
  ],
  "Tuesday": [
    {
      "id": "T_0915_NoSQL",
      "startTime": "09:15",
      "endTime": "11:15", // Spanning across two hours
      "module": "NoSQL Databases",
      "moduleCode": "COMP-0661-WD_KCRCO_B",
      "type": "Lecture",
      "lecturer": "Power, Clodagh",
      "room": "AN Other"
    },
    {
      "id": "T_1115_DigGraph",
      "startTime": "11:15",
      "endTime": "13:15", // Spanning across two hours
      "module": "Digital Graphic Design",
      "moduleCode": "DESG-0056-WD_KMULA_D",
      "type": "Practical",
      "lecturer": "O Riordan, Sinead",
      "room": "IT101"
    },
    {
      "id": "T_1415_3DAnim",
      "startTime": "14:15",
      "endTime": "17:15", // Spanning across three hours
      "module": "3D Animation",
      "moduleCode": "COMP-0965-WD_KCRCO_B",
      "type": "Practical",
      "lecturer": "Mc Inerney, Patrick T",
      "room": "IT102"
    }
  ],
  "Wednesday": [
    {
      "id": "W_0915_WebApp",
      "startTime": "09:15",
      "endTime": "11:15", // Spanning across two hours
      "module": "Web App Development",
      "moduleCode": "COMP-0597-WD_KCRCO_B",
      "type": "Lecture",
      "lecturer": "Birney, Rosanne",
      "room": "E19A"
    },
    {
      "id": "W_1115_NoSQL",
      "startTime": "11:15",
      "endTime": "12:15",
      "module": "NoSQL Databases",
      "moduleCode": "COMP-0661-WD_KCRCO_B",
      "type": "Lecture",
      "lecturer": "Power, Clodagh",
      "room": "FTG14"
    },
    {
      "id": "W_1215_MultiNet",
      "startTime": "12:15",
      "endTime": "13:15",
      "module": "Multimedia Networks",
      "moduleCode": "COMP-0966-WD_KCRCO_B",
      "type": "Lecture",
      "lecturer": "White, Lucy",
      "room": "FTG23"
    },
    {
      "id": "W_1515_WebApp",
      "startTime": "15:15",
      "endTime": "17:15", // Spanning across two hours
      "module": "Web App Development",
      "moduleCode": "COMP-0597-WD_KCRCO_B",
      "type": "Practical",
      "lecturer": "Birney, Rosanne",
      "room": "IT120"
    }
  ],
  "Thursday": [
    {
      "id": "Th_1115_MultiNet",
      "startTime": "11:15",
      "endTime": "13:15", // Spanning across two hours
      "module": "Multimedia Networks",
      "moduleCode": "COMP-0966-WD_KCRCO_B",
      "type": "Practical",
      "lecturer": "White, Lucy",
      "room": "D04"
    },
    {
      "id": "Th_1315_DigGraph",
      "startTime": "13:15",
      "endTime": "15:15", // Spanning across two hours
      "module": "Digital Graphic Design",
      "moduleCode": "DESG-0056-WD_KMULA_D",
      "type": "Practical",
      "lecturer": "O Riordan, Sinead",
      "room": "IT101"
    }
  ],
  "Friday": [
    {
      "id": "F_0915_SoftEng",
      "startTime": "09:15",
      "endTime": "11:15", // Spanning across two hours
      "module": "Software Engineering",
      "moduleCode": "COMP-0103-WD_KCRCO_B",
      "type": "Practical",
      "lecturer": "O Neill, Sinead M",
      "room": "IT201"
    },
    {
      "id": "F_1415_NoSQL",
      "startTime": "14:15",
      "endTime": "16:15", // Spanning across two hours
      "module": "NoSQL Databases",
      "moduleCode": "COMP-0661-WD_KCRCO_B",
      "type": "Practical",
      "lecturer": "Power, Clodagh",
      "room": "IT220"
    }
  ]
};

  const TimetableContext = createContext();

  export function TimetableProvider({ children }) {
    const [timetableData, setTimetableData] = useState(initialTimetableData);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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

    const updateClassStatus = (day, classId, newStatus) => {
        setTimetableData(prev => ({
            ...prev,
            [day]: prev[day].map(cls => 
                cls.id === classId 
                    ? { ...cls, status: newStatus }
                    : cls
            )
        }));
        setHasUnsavedChanges(true);
    };

    const addClass = (day, newClass) => {
      // Ensure you're adding a unique id and correctly updating state
      const newClassWithId = { ...newClass, id: uuidv4() };
    
      setTimetableData(prev => ({
        ...prev,
        [day]: [...prev[day], newClassWithId] // Add the new class to the array for the correct day
      }));
      setHasUnsavedChanges(true);
    };

    const editClass = (day, classId, updatedClass) => {
        setTimetableData(prev => ({
            ...prev,
            [day]: prev[day].map(cls => 
                cls.id === classId ? { ...updatedClass, id: classId } : cls
            )
        }));
        setHasUnsavedChanges(true);
    };

    const deleteClass = (day, classId) => {
        setTimetableData(prev => ({
            ...prev,
            [day]: prev[day].filter(cls => cls.id !== classId)
        }));
        setHasUnsavedChanges(true);
    };

    const saveChanges = async () => {
      try {
        await fetch('/api/timetable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(timetableData)
        });
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Failed to save timetable data:', error);
        throw error; // Re-throw to handle in the UI
      }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <TimetableContext.Provider value={{ 
            timetableData, 
            updateClassStatus, 
            addClass, 
            editClass, 
            deleteClass,
            saveChanges,
            hasUnsavedChanges
        }}>
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