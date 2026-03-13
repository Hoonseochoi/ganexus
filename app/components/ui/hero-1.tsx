import { cn } from "@/src/lib/utils";
import { Button } from "@/app/components/ui/button";
import { RocketIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { LogoCloud } from "@/app/components/ui/logo-cloud-3";

const logos = [
  { src: "/ci/logo01.png", alt: "로고 01" },
  { src: "/ci/logo02.png", alt: "로고 02" },
  { src: "/ci/logo03.png", alt: "로고 03" },
  { src: "/ci/logo04.png", alt: "로고 04" },
  { src: "/ci/logo05.png", alt: "로고 05" },
  { src: "/ci/logo06.png", alt: "로고 06" },
  { src: "/ci/logo07.png", alt: "로고 07" },
  { src: "/ci/logo08.png", alt: "로고 08" },
  { src: "/ci/logo09.png", alt: "로고 09" },
  { src: "/ci/logo10.png", alt: "로고 10" },
  { src: "/ci/logo11.png", alt: "로고 11" },
  { src: "/ci/logo12.png", alt: "로고 12" },
  { src: "/ci/logo13.png", alt: "로고 13" },
  { src: "/ci/logo14.png", alt: "로고 14" },
  { src: "/ci/logo15.png", alt: "로고 15" },
  { src: "/ci/logo16.png", alt: "로고 16" },
  { src: "/ci/logo17.png", alt: "로고 17" },
  { src: "/ci/logo18.png", alt: "로고 18" },
  { src: "/ci/logo19.png", alt: "로고 19" },
  { src: "/ci/logo20.png", alt: "로고 20" },
];

export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div
        aria-hidden="true"
        className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
      >
        <div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
      >
        <div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15" />
        <div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-5 pt-24 pb-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-1 size-full overflow-hidden"
        >
          <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>

        <div
          className={cn(
            "group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out",
          )}
        >
          <RocketIcon className="size-3 text-muted-foreground" />
          <span className="text-xs text-brand-gray">
            GA 지점 일정 공유를 한 곳에서
          </span>
          <span className="block h-5 border-l" />
          <ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
        </div>

        <h1
          className={cn(
            "fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-4xl md:text-5xl lg:text-6xl delay-100 duration-500 ease-out",
            "bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent font-semibold tracking-tight md:tracking-[-0.03em]",
          )}
        >
          우리만의 GA 캘린더
        </h1>

        <p className="fade-in slide-in-from-bottom-10 mx-auto max-w-xl animate-in fill-mode-backwards text-center text-base text-foreground/80 tracking-wider delay-200 duration-500 ease-out sm:text-lg md:text-xl">
          지점만의 캘린더를 만들어보세요.{" "}
          <span className="font-semibold">GALENDER</span>에서 교육 일정과 지점
          일정을 실시간으로 공유하고 한눈에 확인할 수 있습니다.
        </p>

        <div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-4 delay-300 duration-500 ease-out">
          <Link href="/login">
            <Button className="rounded-full px-6" size="lg" variant="default">
              관리자로 시작하기
            </Button>
          </Link>
          <Link href="/manager-login">
            <Button
              className="rounded-full px-6"
              size="lg"
              variant="secondary"
            >
              매니저로 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LogosSection() {
  return (
    <section className="relative space-y-4 border-t border-border/60 pt-6 pb-10">
      <h2 className="text-center font-medium text-sm text-muted-foreground tracking-tight md:text-base">
        이미 여러 지점에서 <span className="text-foreground">GALENDER</span>로
        일정을 정리하고 있습니다.
      </h2>
      <div className="relative z-10 mx-auto max-w-4xl">
        <LogoCloud logos={logos} />
      </div>
    </section>
  );
}

