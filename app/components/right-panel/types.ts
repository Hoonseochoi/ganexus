// RightPanel 공유 타입 및 포맷터

export type ScheduleItem = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category: "dealer" | "internal" | "personal" | "leave" | "etc";
  dealer_name?: string | null;
  location?: string | null;
  instructor?: string | null;
  target_audience?: string | null;
  manager_name?: string | null;
  is_soft_deleted?: boolean;
  creator_full_name?: string | null;
  creator_avatar_url?: string | null;
  target_full_name?: string | null;
  target_avatar_url?: string | null;
  instructor_color?: string | null;
};

export type MemoItem = {
  id: string;
  content: string;
  author_name: string | null;
  created_at: string;
};

export type NoticeItem = {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  created_at: string;
} | null;

export type ScheduleEditLogItem = {
  id: string;
  schedule_id: string;
  modified_by: string;
  modifier_name?: string;
  created_at: string;
  changed_fields: Record<string, { before: unknown; after: unknown }>;
};

type InstructorRow = {
  id: string;
  name: string;
  is_instructor: boolean;
  instructor_color?: string | null;
};

export type ManagersApiResponse = {
  managers: InstructorRow[];
};

// ── 포맷 유틸리티 ──────────────────────────────────────────

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });
}

export function formatDateLabel(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });
}

export function parseHexColor(hex: string | null | undefined): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  const normalized = hex.trim();
  const short = normalized.match(/^#([0-9a-fA-F]{3})$/);
  if (short) {
    const chars = short[1].split("").map((ch) => parseInt(ch + ch, 16));
    return { r: chars[0] ?? 0, g: chars[1] ?? 0, b: chars[2] ?? 0 };
  }
  const full = normalized.match(/^#([0-9a-fA-F]{6})$/);
  if (full) {
    const v = full[1];
    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
    };
  }
  return null;
}
