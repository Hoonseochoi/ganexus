import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen flex items-stretch justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-[minmax(0,260px)_minmax(0,1.8fr)_minmax(0,320px)] gap-6">
        {/* L-Panel */}
        <aside className="backdrop-blur-xl bg-slate-900/60 border border-white/5 rounded-2xl shadow-glass flex flex-col">
          <header className="px-5 py-4 border-b border-white/5">
            <p className="text-xs text-slate-400 mb-1">오늘도 성장하는 지점</p>
            <h1 className="text-lg font-semibold">안녕하세요, 지점장님</h1>
          </header>
          <div className="flex-1 overflow-hidden px-5 py-4 space-y-4 text-sm text-slate-300">
            <div className="h-40 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-center text-xs text-slate-500">
              미니 캘린더 / 필터 영역
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>지점원 상태</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  실시간
                </span>
              </div>
              <div className="space-y-1.5">
                {["사무실 근무", "외근", "월차"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          label === "사무실 근무"
                            ? "bg-emerald-400"
                            : label === "외근"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                        }`}
                      />
                      <span>{label}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">●●명</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Calendar */}
        <section className="relative">
          <div className="absolute -inset-px bg-gradient-to-br from-electric-500/40 via-sky-500/10 to-transparent rounded-[26px] opacity-60 blur-2xl" />
          <div className="relative h-full backdrop-blur-2xl bg-glass-800 border border-white/10 rounded-[24px] shadow-glass overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-1">지점 통합 일정</p>
                <h2 className="text-lg font-semibold tracking-tight">
                  메인 캘린더
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button className="px-3 py-1.5 rounded-full border border-white/10 bg-slate-900/70 text-slate-200 hover:bg-slate-900/90 transition">
                  오늘
                </button>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  <span>교육</span>
                  <span className="h-2 w-2 rounded-full bg-rose-400 ml-3" />
                  <span>월차</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 ml-3" />
                  <span>본사</span>
                </div>
              </div>
            </header>
            <div className="flex-1 grid grid-cols-7 gap-px bg-slate-900/40 p-4 rounded-b-[24px]">
              {Array.from({ length: 35 }).map((_, idx) => {
                const isToday = idx === 10;
                return (
                  <div
                    key={idx}
                    className="relative rounded-xl bg-slate-950/40 border border-slate-800/80 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-2 pt-1">
                      <span className="text-[10px] text-slate-500">
                        {idx + 1}
                      </span>
                      {isToday && (
                        <span className="px-1.5 py-0.5 rounded-full bg-electric-500/20 text-[10px] text-electric-500 border border-electric-500/40">
                          오늘
                        </span>
                      )}
                    </div>
                    {isToday && (
                      <div className="mt-2 space-y-1 px-1 pb-1">
                        <div className="group relative rounded-lg bg-sky-500/15 border border-sky-400/40 px-2 py-1.5 text-[11px] text-slate-50">
                          교육 · MDRT 전략 미팅
                        </div>
                        <div className="group relative rounded-lg bg-rose-500/15 border border-rose-400/40 px-2 py-1.5 text-[11px] text-slate-50">
                          월차 · 김OO 매니저
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* R-Panel */}
        <aside className="backdrop-blur-xl bg-slate-900/60 border border-white/5 rounded-2xl shadow-glass flex flex-col">
          <header className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">선택한 날짜</p>
              <h2 className="text-base font-semibold">오늘의 일정 요약</h2>
            </div>
          </header>
          <div className="flex-1 overflow-hidden px-5 py-4 space-y-4">
            <div className="rounded-xl bg-slate-900/70 border border-white/5 p-4 text-sm text-slate-200">
              <p className="text-xs text-sky-300 mb-1">오늘의 지점 명언</p>
              <p className="text-sm">
                “오늘 캘린더에 적힌 약속은, 고객의 내일을 바꾸는 첫 줄입니다.”
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/70 border border-white/5 p-4">
              <p className="text-xs text-slate-400 mb-2">이번 달 목표 달성률</p>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div className="h-full w-2/3 bg-gradient-to-r from-sky-400 via-emerald-400 to-electric-500" />
              </div>
              <p className="text-xs text-slate-300">
                지점 교육 참석률 <span className="font-semibold">68%</span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

