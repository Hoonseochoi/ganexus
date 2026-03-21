"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import type { ScheduleParticipant } from "./types";

type Props = {
  scheduleId: string;
  currentUserProfileId?: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  attending: "참석",
  declined: "불참",
  tentative: "미정",
};

const STATUS_COLORS: Record<string, string> = {
  attending: "bg-emerald-100 text-emerald-700",
  declined: "bg-rose-100 text-rose-700",
  tentative: "bg-amber-100 text-amber-700",
};

function RsvpSectionBase({ scheduleId, currentUserProfileId }: Props) {
  const [participants, setParticipants] = useState<ScheduleParticipant[]>([]);
  const [myStatus, setMyStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch(`/api/schedules/${scheduleId}/participants`);
      const data = (await res.json()) as { participants?: ScheduleParticipant[] };
      if (res.ok && data.participants) {
        setParticipants(data.participants);
        const mine = data.participants.find((p) => p.profile_id === currentUserProfileId);
        setMyStatus(mine?.status ?? null);
      }
    } catch {
      // 네트워크 오류 무시
    }
  }, [scheduleId, currentUserProfileId]);

  useEffect(() => {
    void fetchParticipants();
  }, [fetchParticipants]);

  const handleRsvp = async (status: "attending" | "declined" | "tentative") => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/schedules/${scheduleId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMyStatus(status);
        void fetchParticipants();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pb-4 pt-3 border-t border-slate-100">
      <p className="text-xs font-semibold text-brand-gray mb-2">참석 여부</p>

      {/* RSVP 버튼 */}
      {currentUserProfileId && (
        <div className="flex gap-2 mb-3">
          {(["attending", "declined", "tentative"] as const).map((s) => (
            <EclipseButton
              key={s}
              type="button"
              variant={myStatus === s ? "primary" : "outline"}
              size="sm"
              text={STATUS_LABELS[s]}
              onClick={() => handleRsvp(s)}
              disabled={loading}
              className="!text-xs flex-1"
            />
          ))}
        </div>
      )}

      {/* 참석자 목록 */}
      {participants.length > 0 ? (
        <ul className="space-y-1.5 max-h-32 overflow-y-auto">
          {participants.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={p.avatar_url ?? undefined} />
                <AvatarFallback className="text-[10px]">
                  {(p.full_name ?? "?").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-slate-700 flex-1 truncate">
                {p.full_name ?? "알 수 없음"}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] ?? ""}`}
              >
                {STATUS_LABELS[p.status] ?? p.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-brand-gray">아직 참석 응답이 없습니다.</p>
      )}
    </div>
  );
}

const RsvpSection = memo(RsvpSectionBase);
export default RsvpSection;
