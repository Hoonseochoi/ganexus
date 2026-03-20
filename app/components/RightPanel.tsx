/**
 * 하위 호환성 re-export
 * 실제 구현은 app/components/right-panel/ 하위로 분리됨.
 * 기존에 이 경로에서 import하던 코드들이 그대로 동작하도록 유지.
 */
export { default } from "./right-panel/index";
export type { ScheduleItem } from "./right-panel/types";
export { ScheduleDetailPopup } from "./right-panel/ScheduleDetailPopup";
