export const earlyBirdDeadlineUtc = Date.UTC(2026, 7, 28, 15, 0, 0);

export type ProgramPricing = {
  activeLabel: string;
  amount: string;
  bankLabel: string;
  description: string;
  earlyBirdActive: boolean;
  nextStep: string;
  regularAmount: string;
};

export function isEarlyBirdActive(now = new Date()) {
  return now.getTime() < earlyBirdDeadlineUtc;
}

export function getProgramPricing(now = new Date()): ProgramPricing {
  const earlyBirdActive = isEarlyBirdActive(now);

  if (earlyBirdActive) {
    return {
      activeLabel: "얼리버드",
      amount: "150,000원",
      bankLabel: "얼리버드 첫 달 수강료 150,000원",
      description: "8월 28일까지 신청하면 월 15만원 얼리버드가 적용됩니다.",
      earlyBirdActive,
      nextStep: "신청자명과 동일한 입금자명으로 얼리버드 첫 달 수강료 150,000원을 입금해주세요.",
      regularAmount: "정규 수강료 월 200,000원",
    };
  }

  return {
    activeLabel: "정규가",
    amount: "200,000원",
    bankLabel: "첫 달 수강료 200,000원",
    description: "8월 29일부터는 정규 수강료 월 20만원으로 등록됩니다.",
    earlyBirdActive,
    nextStep: "신청자명과 동일한 입금자명으로 첫 달 수강료 200,000원을 입금해주세요.",
    regularAmount: "정규 수강료 월 200,000원",
  };
}
