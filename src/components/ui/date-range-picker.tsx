"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangePickerProps {
  initialRange?: DateRange;
  dateFormat?: "en-GB" | "en-US" | "custom";
  customFormat?: (date: Date) => string;
  className?: string;
  buttonVariant?: "outline" | "default" | "ghost" | "secondary";
  onRangeChange?: (range: DateRange) => void;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (date: Date): (Date | null)[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  const days: (Date | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  return days;
};

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}) => (
  <div className="flex items-center justify-between mb-4">
    <Button variant="ghost" size="sm" onClick={onPrevMonth} className="h-8 w-8 p-0">
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <h3 className="font-semibold text-sm">
      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
    </h3>
    <Button variant="ghost" size="sm" onClick={onNextMonth} className="h-8 w-8 p-0">
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

interface CalendarGridProps {
  days: (Date | null)[];
  tempRange: DateRange;
  onDateClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ days, tempRange, onDateClick }) => {
  const isDateInRange = useCallback((date: Date | null) => {
    if (!date || !tempRange.from || !tempRange.to) return false;
    return date >= tempRange.from && date <= tempRange.to;
  }, [tempRange]);

  const isDateRangeStartOrEnd = useCallback((date: Date | null, isStart: boolean) => {
    if (!date || !tempRange[isStart ? "from" : "to"]) return false;
    return date.getTime() === tempRange[isStart ? "from" : "to"]?.getTime();
  }, [tempRange]);

  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {daysOfWeek.map((day) => (
        <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
          {day}
        </div>
      ))}
      {days.map((date, index) => (
        <div key={index} className="h-8 flex items-center justify-center">
          {date && (
            <button
              onClick={() => onDateClick(date)}
              className={cn(
                "h-8 w-8 text-xs rounded-full flex items-center justify-center transition-colors",
                "hover:bg-gray-100",
                isDateInRange(date) && "bg-purple-100 text-purple-800",
                (isDateRangeStartOrEnd(date, true) || isDateRangeStartOrEnd(date, false)) &&
                  "bg-purple-500 text-white hover:bg-purple-600",
                !isDateInRange(date) && "text-gray-900"
              )}
            >
              {date.getDate()}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialRange = { from: new Date(2025, 6, 1), to: new Date(2025, 10, 7) },
  dateFormat = "en-GB",
  customFormat,
  className,
  buttonVariant = "outline",
  onRangeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>(initialRange);
  const [tempRange, setTempRange] = useState<DateRange>(initialRange);

  const handleDateClick = useCallback((date: Date) => {
    if (!tempRange.from || (tempRange.from && tempRange.to)) {
      setTempRange({ from: date, to: null });
    } else if (tempRange.from && !tempRange.to) {
      setTempRange({
        from: date < tempRange.from ? date : tempRange.from,
        to: date >= tempRange.from ? date : tempRange.from,
      });
    }
  }, [tempRange]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  }, [currentMonth]);

  const handleCancel = useCallback(() => {
    setTempRange(selectedRange);
    setIsOpen(false);
  }, [selectedRange]);

  const handleDone = useCallback(() => {
    setSelectedRange(tempRange);
    onRangeChange?.(tempRange);
    setIsOpen(false);
  }, [tempRange, onRangeChange]);

  const formatDateRange = useCallback(() => {
    if (!selectedRange.from || !selectedRange.to) return "Select date range";
    
    const formatSingleDate = (date: Date) => {
      if (customFormat) return customFormat(date);
      return date.toLocaleDateString(dateFormat, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return `${formatSingleDate(selectedRange.from)} - ${formatSingleDate(selectedRange.to)}`;
  }, [selectedRange, dateFormat, customFormat]);

  const days = getDaysInMonth(currentMonth);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={buttonVariant} className={cn("flex items-center gap-2", className)}>
          <Calendar className="h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <CalendarHeader
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <CalendarGrid days={days} tempRange={tempRange} onDateClick={handleDateClick} />
          <div className="flex justify-between">
            <Button variant="ghost" onClick={handleCancel} className="text-gray-600">
              Cancel
            </Button>
            <Button onClick={handleDone} className="bg-purple-500 hover:bg-purple-600 text-white">
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};