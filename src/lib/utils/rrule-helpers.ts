import { RRule, type Options as RRuleOptions } from "rrule";

type FreqOption = "daily" | "weekly" | "monthly" | "yearly";

const FREQ_MAP: Record<FreqOption, number> = {
  daily: RRule.DAILY,
  weekly: RRule.WEEKLY,
  monthly: RRule.MONTHLY,
  yearly: RRule.YEARLY,
};

const DAY_MAP: Record<string, InstanceType<typeof import("rrule").Weekday>> = {
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
  SU: RRule.SU,
};

const FREQ_KOREAN: Record<string, string> = {
  DAILY: "매일",
  WEEKLY: "매주",
  MONTHLY: "매월",
  YEARLY: "매년",
};

const DAY_KOREAN: Record<string, string> = {
  MO: "월",
  TU: "화",
  WE: "수",
  TH: "목",
  FR: "금",
  SA: "토",
  SU: "일",
};

/** UI 선택값 → RRULE 문자열 */
export function buildRruleString(opts: {
  freq: FreqOption;
  interval?: number;
  byDay?: string[];
  until?: Date;
  count?: number;
}): string {
  const options: Partial<RRuleOptions> = {
    freq: FREQ_MAP[opts.freq],
    interval: opts.interval ?? 1,
  };

  if (opts.byDay && opts.byDay.length > 0) {
    options.byweekday = opts.byDay
      .map((d) => DAY_MAP[d])
      .filter(Boolean);
  }

  if (opts.until) {
    options.until = opts.until;
  } else if (opts.count) {
    options.count = opts.count;
  }

  const rule = new RRule(options);
  return rule.toString().replace("RRULE:", "");
}

/** rrule 라이브러리로 반복 일정 확장 */
export function expandRecurringSchedules<
  T extends {
    id: string;
    start_at: string;
    end_at: string;
    recurrence_rule?: string | null;
  },
>(rows: T[], from: Date, to: Date): T[] {
  const result: T[] = [];

  for (const row of rows) {
    if (!row.recurrence_rule) {
      result.push(row);
      continue;
    }

    try {
      const startDate = new Date(row.start_at);
      const endDate = new Date(row.end_at);
      const durationMs = endDate.getTime() - startDate.getTime();

      const rule = RRule.fromString(`RRULE:${row.recurrence_rule}`);
      // dtstart를 원본 일정의 시작일로 설정
      const ruleWithStart = new RRule({
        ...rule.origOptions,
        dtstart: startDate,
      });

      const occurrences = ruleWithStart.between(from, to, true);

      // 원본 일정은 첫 번째 occurrence에 해당하므로 원본 id 유지
      for (const occ of occurrences) {
        const occDateStr = occ.toISOString().slice(0, 10).replace(/-/g, "");
        const originalDateStr = startDate.toISOString().slice(0, 10).replace(/-/g, "");
        const isOriginal = occDateStr === originalDateStr;

        const occEnd = new Date(occ.getTime() + durationMs);

        result.push({
          ...row,
          id: isOriginal ? row.id : `${row.id}_${occDateStr}`,
          start_at: occ.toISOString(),
          end_at: occEnd.toISOString(),
        });
      }
    } catch {
      // RRULE 파싱 실패 시 원본만 포함
      result.push(row);
    }
  }

  return result;
}

/** RRULE → 사람이 읽을 수 있는 한국어 설명 */
export function rruleToKorean(rruleStr: string): string {
  if (!rruleStr) return "";

  try {
    const parts: Record<string, string> = {};
    rruleStr.split(";").forEach((segment) => {
      const [key, val] = segment.split("=");
      if (key && val) parts[key] = val;
    });

    const freq = FREQ_KOREAN[parts.FREQ ?? ""] ?? parts.FREQ ?? "";
    let desc = freq;

    if (parts.INTERVAL && Number(parts.INTERVAL) > 1) {
      desc = `${parts.INTERVAL}${freq === "매일" ? "일" : freq === "매주" ? "주" : freq === "매월" ? "개월" : "년"}마다`;
    }

    if (parts.BYDAY) {
      const days = parts.BYDAY.split(",")
        .map((d) => DAY_KOREAN[d] ?? d)
        .join(",");
      desc += ` ${days}`;
    }

    if (parts.UNTIL) {
      const y = parts.UNTIL.slice(0, 4);
      const m = parts.UNTIL.slice(4, 6);
      const d = parts.UNTIL.slice(6, 8);
      desc += ` (${y}.${m}.${d}까지)`;
    } else if (parts.COUNT) {
      desc += ` (${parts.COUNT}회)`;
    }

    return desc;
  } catch {
    return rruleStr;
  }
}
