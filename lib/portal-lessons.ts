import {
  JULY_COHORT,
  isAugustCohort,
  isSeptemberCohort,
  normalizeCohort,
} from "@/lib/cohorts";

export type PortalVideo = {
  label: string;
  watchUrl: string;
  embedUrl: string;
};

export type PortalLesson = {
  week: string;
  date: string;
  dateKey: number;
  time: string;
  mode: "인강" | "실시간";
  instructor: string;
  title: string;
  videos?: PortalVideo[];
};

const week13Videos: PortalVideo[] = [
  {
    label: "13강 1교시",
    watchUrl: "https://youtu.be/_vinFW809h8",
    embedUrl: "https://www.youtube-nocookie.com/embed/_vinFW809h8",
  },
  {
    label: "13강 2교시",
    watchUrl: "https://youtu.be/FBWgruxyY9Y",
    embedUrl: "https://www.youtube-nocookie.com/embed/FBWgruxyY9Y",
  },
];

const week15Videos: PortalVideo[] = [
  {
    label: "15강 1교시",
    watchUrl: "https://youtu.be/7f2L-3O6J6M",
    embedUrl: "https://www.youtube-nocookie.com/embed/7f2L-3O6J6M",
  },
  {
    label: "15강 2교시",
    watchUrl: "https://youtu.be/oFjaIEUbnq8",
    embedUrl: "https://www.youtube-nocookie.com/embed/oFjaIEUbnq8",
  },
];

const julyLessons: PortalLesson[] = [
  {
    week: "13강",
    date: "2026.10.06(화)",
    dateKey: 20261006,
    time: "00:00 공개",
    mode: "인강",
    instructor: "문원경 교수",
    title: "유통·저작권·퍼블리싱 실무",
    videos: week13Videos,
  },
  {
    week: "14강",
    date: "2026.10.13(화)",
    dateKey: 20261013,
    time: "20:00-22:00",
    mode: "실시간",
    instructor: "안서윤 교수",
    title: "소셜 마케팅 트렌드 & SEO",
  },
  {
    week: "15강",
    date: "2026.10.20(화)",
    dateKey: 20261020,
    time: "00:00 공개",
    mode: "인강",
    instructor: "문원경 교수",
    title: "글로벌 역주행 전략",
    videos: week15Videos,
  },
];

const augustLessons: PortalLesson[] = [
  {
    week: "13강",
    date: "2026.10.26(월)",
    dateKey: 20261026,
    time: "00:00 공개",
    mode: "인강",
    instructor: "문원경 교수",
    title: "유통·저작권·퍼블리싱 실무",
    videos: week13Videos,
  },
  {
    week: "14강",
    date: "2026.11.02(월)",
    dateKey: 20261102,
    time: "20:00-22:00",
    mode: "실시간",
    instructor: "안서윤 교수",
    title: "소셜 마케팅 트렌드 & SEO",
  },
  {
    week: "15강",
    date: "2026.11.03(화)",
    dateKey: 20261103,
    time: "00:00 공개",
    mode: "인강",
    instructor: "문원경 교수",
    title: "글로벌 역주행 전략",
    videos: week15Videos,
  },
];

const septemberLessons: PortalLesson[] = [
  {
    week: "13강",
    date: "2026.11.10(화)",
    dateKey: 20261110,
    time: "00:00 공개",
    mode: "인강",
    instructor: "문원경 교수",
    title: "유통·저작권·퍼블리싱 실무",
    videos: week13Videos,
  },
  {
    week: "14강",
    date: "2026.11.17(화)",
    dateKey: 20261117,
    time: "20:00-22:00",
    mode: "실시간",
    instructor: "안서윤 교수",
    title: "소셜 마케팅 트렌드 & SEO",
  },
  {
    week: "15강",
    date: "2026.11.24(화)",
    dateKey: 20261124,
    time: "00:00 공개",
    mode: "인강",
    instructor: "문원경 교수",
    title: "글로벌 역주행 전략",
    videos: week15Videos,
  },
];

export function getPortalLessons(cohort: string) {
  if (normalizeCohort(cohort) === JULY_COHORT) {
    return julyLessons;
  }

  if (isAugustCohort(cohort)) {
    return augustLessons;
  }

  if (isSeptemberCohort(cohort)) {
    return septemberLessons;
  }

  return [];
}
