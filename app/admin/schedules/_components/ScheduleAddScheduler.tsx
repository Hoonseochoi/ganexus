"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin, User, FileText, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { cn } from "@/src/lib/utils"

interface TimeSlot {
  time: string
  available: boolean
}

interface AvailableDate {
  date: number
  hasSlots: boolean
}

export interface ScheduleAddSchedulerProps {
  userFullName: string
  userAvatar?: string
  onSuccess: () => void
}

export function ScheduleAddScheduler({
  userFullName,
  userAvatar,
  onSuccess
}: ScheduleAddSchedulerProps) {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [selectedDate, setSelectedDate] = useState(now.getDate())
  const [selectedTime, setSelectedTime] = useState("14:00")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form States
  const [category, setCategory] = useState<"dealer" | "internal" | "personal" | "leave" | "etc">("dealer")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [instructor, setInstructor] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [description, setDescription] = useState("")

  const CATEGORIES = [
    { value: "dealer", label: "대리점일정" },
    { value: "internal", label: "사내일정" },
    { value: "personal", label: "개인" },
    { value: "leave", label: "월차" },
    { value: "etc", label: "기타" },
  ] as const

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = []
    for (let h = 9; h <= 20; h++) {
      for (const m of ["00", "30"]) {
        slots.push({ time: `${String(h).padStart(2, "0")}:${m}`, available: true })
      }
    }
    return slots
  }, [])

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("항목명을 입력해주세요.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const isoDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
      const finalTime = category === 'leave' ? '00:00' : selectedTime
      const startAt = new Date(`${isoDate}T${finalTime}:00`).toISOString()

      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description || null,
          category,
          startAt,
          isAllDay: category === 'leave',
          location: location || null,
          instructor: instructor || null,
          targetAudience: targetAudience || null,
          dealerName: category === 'dealer' ? title.trim() : null,
          managerName: category === 'leave' ? title.trim() : null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? "일정 생성에 실패했습니다.")
        return
      }

      onSuccess()
      // Reset
      setTitle("")
      setLocation("")
      setInstructor("")
      setDescription("")
      setTargetAudience("")
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-0 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xl animate-fade-in mb-8">
      {/* 1단 - 일정 정보 입력 */}
      <div className="w-full lg:w-[350px] border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white shadow-sm">
            <AvatarImage src={userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userFullName}`} />
            <AvatarFallback>{userFullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Manager</p>
            <p className="text-sm font-semibold text-slate-700">{userFullName}님, 반갑습니다.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="h-3 w-3 text-primary" /> Category
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-[11px] font-bold border transition-all duration-200",
                    category === c.value
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-white border-slate-200 text-slate-500 hover:border-primary/30 hover:bg-slate-50"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                   <FileText className="h-3 w-3" /> {category === 'dealer' ? '대리점명' : category === 'leave' ? '매니저명' : '일정명'}
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  placeholder="항목명을 입력하세요..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
             </div>

             {(category === 'dealer' || category === 'internal' || category === 'personal') && (
               <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                     <MapPin className="h-3 w-3" /> 장소
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    placeholder="장소를 입력하세요..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
               </div>
             )}

             {category === 'dealer' && (
               <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                     <User className="h-3 w-3" /> 교육자
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    placeholder="교육자 이름을 입력하세요..."
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                  />
               </div>
             )}

             <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                   <Clock className="h-3 w-3" /> 메모
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm min-h-[80px] resize-none"
                  placeholder="추가 전달사항이나 메모를 적어주세요..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
             </div>
          </div>
        </div>
      </div>

      {/* 2단 - 캘린더 날짜 선택 */}
      <div className="flex-1 p-6 md:p-8 bg-white">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">
              {monthNames[currentMonth]} <span className="text-slate-300 ml-1">{currentYear}</span>
            </h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-50 text-slate-400" onClick={handlePrevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-50 text-slate-400" onClick={handleNextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 py-3 uppercase tracking-widest">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) return <div key={`empty-${index}`} />
              const isSelected = day === selectedDate
              const isToday = now.getFullYear() === currentYear && now.getMonth() === currentMonth && now.getDate() === day

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "group relative h-12 md:h-14 rounded-2xl text-sm font-bold transition-all duration-300",
                    "hover:bg-slate-50 active:scale-95",
                    isSelected 
                      ? "bg-primary text-white shadow-xl shadow-primary/30 scale-105 z-10" 
                      : "bg-transparent text-slate-600 hover:text-primary",
                    isToday && !isSelected && "text-primary ring-2 ring-primary/10 ring-inset"
                  )}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
          
          <div className="pt-4 flex items-center gap-4 text-xs text-slate-400 font-medium">
             <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Selected</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full ring-2 ring-primary/10 ring-inset"></div>
                <span>Today</span>
             </div>
          </div>
        </div>
      </div>

      {/* 3단 - 시간 선택 및 완료 */}
      <div className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50/50 p-6 flex flex-col transition-opacity duration-300">
        <div className={cn(
          "mb-6 flex items-center justify-between transition-opacity",
          category === 'leave' && "opacity-40"
        )}>
          <p className="text-sm font-bold text-slate-700">
            {currentMonth + 1}월 {selectedDate}일 <span className="text-slate-400 font-medium ml-1">
              {category === 'leave' ? "종일 일정" : "시간 선택"}
            </span>
          </p>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
             <Clock className="h-4 w-4 text-primary" />
          </div>
        </div>

        <div className={cn(
          "flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-thin max-h-[300px] lg:max-h-[460px] pb-6 transition-opacity",
          category === 'leave' && "opacity-40 pointer-events-none"
        )}>
          {timeSlots.map((slot) => {
            const isSelected = slot.time === selectedTime
            return (
              <button
                key={slot.time}
                type="button"
                disabled={category === 'leave'}
                onClick={() => setSelectedTime(slot.time)}
                className={cn(
                  "w-full py-4 px-4 rounded-xl text-xs font-bold transition-all duration-200 text-left border",
                  isSelected 
                    ? "bg-white border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02] ring-1 ring-primary"
                    : "bg-white border-slate-200 text-slate-500 hover:border-primary/50 hover:bg-white"
                )}
              >
                {slot.time}
              </button>
            )
          })}
        </div>

        <div className="pt-6 mt-auto border-t border-slate-200 pointer-events-auto">
           {error && <p className="text-[10px] text-red-500 font-bold mb-3">{error}</p>}
           <Button 
             onClick={handleSubmit}
             disabled={loading}
             className="w-full py-6 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-white"
           >
             {loading ? "일정 등록 중..." : "일정 등록 완료"}
           </Button>
           <p className="text-[10px] text-slate-400 mt-4 text-center">GA NEXUS Premium Scheduling System</p>
        </div>
      </div>
    </div>
  )
}
