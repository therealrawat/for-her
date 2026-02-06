import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Cycle } from '../types';

interface CalendarViewProps {
  cycles: Cycle[];
  onDateClick?: (date: Date) => void;
  fertilityWindow?: {
    start: Date;
    end: Date;
  } | null;
}

const CalendarView = ({ cycles, onDateClick, fertilityWindow }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Get all days to display (including padding from previous/next month)
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay()); // Start from Sunday

  const endDate = new Date(monthEnd);
  const daysToAdd = 6 - monthEnd.getDay(); // End on Saturday
  endDate.setDate(endDate.getDate() + daysToAdd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Check if a date is a period day
  const isPeriodDay = (date: Date): { isPeriod: boolean; intensity?: string } => {
    for (const cycle of cycles) {
      const cycleStart = parseISO(cycle.startDate);
      const cycleEnd = parseISO(cycle.endDate);
      
      if (isWithinInterval(date, { start: cycleStart, end: cycleEnd })) {
        return { isPeriod: true, intensity: cycle.flowIntensity };
      }
    }
    return { isPeriod: false };
  };

  // Check if a date is in fertility window
  const isFertileDay = (date: Date): boolean => {
    if (!fertilityWindow) return false;
    return isWithinInterval(date, { start: fertilityWindow.start, end: fertilityWindow.end });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getDayClasses = (date: Date) => {
    const isToday = isSameDay(date, new Date());
    const periodInfo = isPeriodDay(date);
    const isFertile = isFertileDay(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);

    let classes = 'calendar-day relative h-12 sm:h-14 flex items-center justify-center text-sm font-medium transition-all cursor-pointer ';

    if (!isCurrentMonth) {
      classes += 'text-gray-300 ';
    } else {
      classes += 'text-gray-700 ';
    }

    // Period day styling
    if (periodInfo.isPeriod) {
      classes += 'bg-gradient-to-br from-lavender-400 to-purple-500 text-white font-semibold shadow-sm ';
    } 
    // Fertility window styling
    else if (isFertile) {
      classes += 'bg-gradient-to-br from-teal-300 to-cyan-400 text-white font-semibold ';
    }
    // Regular day hover
    else if (isCurrentMonth) {
      classes += 'hover:bg-lavender-50 ';
    }

    // Today indicator
    if (isToday) {
      classes += 'ring-2 ring-lavender-600 ring-offset-1 rounded-full ';
    } else {
      classes += 'rounded-lg ';
    }

    return classes;
  };

  return (
    <div className="card">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-lavender-50 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-lavender-50 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 uppercase py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => onDateClick?.(day)}
            className={getDayClasses(day)}
            disabled={!isSameMonth(day, currentMonth)}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-lavender-400 to-purple-500"></div>
          <span className="text-xs text-gray-600">Period Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-teal-300 to-cyan-400"></div>
          <span className="text-xs text-gray-600">Fertility Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-lavender-600"></div>
          <span className="text-xs text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
