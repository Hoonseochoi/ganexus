"use client";

import { memo, useCallback, useState } from "react";
import type { CalendarMonthData } from "@/src/lib/calendar/month-view";

type Props = {
  year: number;
  month: number;
  monthData: CalendarMonthData;
  branchName: string;
  onClose: () => void;
};

const CATEGORY_COLORS: Record<string, string> = {
  dealer: "#3B82F6",
  internal: "#10B981",
  personal: "#F59E0B",
  leave: "#EF4444",
  etc: "#6B7280",
};

const DAY_HEADERS = ["월", "화", "수", "목", "금"];

function CalendarPdfExportBase({ year, month, monthData, branchName, onClose }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePdf = useCallback(async () => {
    setGenerating(true);
    setError(null);

    try {
      const pdfRenderer = await import("@react-pdf/renderer");
      const { Document, Page, View, Text, Font, pdf } = pdfRenderer;

      // 한글 폰트 등록
      Font.register({
        family: "NotoSansKR",
        src: "/fonts/NotoSansKR-Regular.ttf",
      });

      // 월~금 셀 데이터를 5열 그리드로 구성
      const cells = monthData.cells;
      const rows: (typeof cells[number] | null)[][] = [];
      for (let i = 0; i < cells.length; i += 5) {
        rows.push(cells.slice(i, i + 5));
      }
      // 부족한 셀 채우기
      const lastRow = rows[rows.length - 1];
      if (lastRow) {
        while (lastRow.length < 5) {
          lastRow.push(null);
        }
      }

      const monthLabel = `${year}년 ${month + 1}월`;

      const doc = (
        <Document>
          <Page
            size="A4"
            orientation="landscape"
            style={{
              fontFamily: "NotoSansKR",
              padding: 30,
              fontSize: 8,
            }}
          >
            {/* 헤더 */}
            <View style={{ marginBottom: 15, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {monthLabel} 일정표
              </Text>
              <Text style={{ fontSize: 8, color: "#6B7280" }}>
                {branchName} · GALENDER
              </Text>
            </View>

            {/* 요일 헤더 */}
            <View style={{ flexDirection: "row", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 2 }}>
              {DAY_HEADERS.map((d) => (
                <View key={d} style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ fontSize: 9, fontWeight: "bold", color: "#334155" }}>{d}</Text>
                </View>
              ))}
            </View>

            {/* 캘린더 그리드 */}
            {rows.map((row, rowIdx) => (
              <View
                key={rowIdx}
                style={{
                  flexDirection: "row",
                  minHeight: 65,
                  borderBottom: "0.5px solid #f1f5f9",
                }}
              >
                {row.map((cell, colIdx) => {
                  const schedules = cell?.day
                    ? (monthData.eventsByDay[String(cell.day)] ?? [])
                    : [];
                  const displayed = schedules.filter((s) => !s.is_soft_deleted).slice(0, 4);

                  return (
                    <View
                      key={colIdx}
                      style={{
                        flex: 1,
                        padding: 3,
                        borderRight: colIdx < 4 ? "0.5px solid #f1f5f9" : undefined,
                      }}
                    >
                      {cell?.day && (
                        <>
                          <Text
                            style={{
                              fontSize: 9,
                              fontWeight: cell.isToday ? "bold" : "normal",
                              color: cell.isHoliday ? "#EF4444" : "#334155",
                              marginBottom: 2,
                            }}
                          >
                            {cell.day}
                          </Text>
                          {displayed.map((s, sIdx) => (
                            <View
                              key={sIdx}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 1.5,
                              }}
                            >
                              <View
                                style={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: 2,
                                  backgroundColor: CATEGORY_COLORS[s.category] ?? "#6B7280",
                                  marginRight: 3,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 6.5,
                                  color: "#475569",
                                  maxLines: 1,
                                }}
                              >
                                {s.title.length > 12 ? s.title.slice(0, 12) + "…" : s.title}
                              </Text>
                            </View>
                          ))}
                          {schedules.length > 4 && (
                            <Text style={{ fontSize: 5.5, color: "#94a3b8" }}>
                              +{schedules.length - 4}건
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </Page>
        </Document>
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `일정표_${year}년_${month + 1}월_${branchName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      console.error("[PDF 오류]", err);
      setError("PDF 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setGenerating(false);
    }
  }, [year, month, monthData, branchName, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-bold text-brand-black mb-2">PDF 내보내기</h3>
        <p className="text-xs text-brand-gray mb-4">
          {year}년 {month + 1}월 일정표를 PDF로 다운로드합니다.
        </p>

        {error && (
          <div className="mb-3 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={generatePdf}
            disabled={generating}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-bold disabled:opacity-50"
          >
            {generating ? "생성 중..." : "다운로드"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

const CalendarPdfExport = memo(CalendarPdfExportBase);
export default CalendarPdfExport;
