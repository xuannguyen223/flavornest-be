export type InstructionMockType = {
  step: number;
  description: string;
};

export function parseInstructions(instructions: string): InstructionMockType[] {
  const steps = instructions
    .split(/\r?\n/)
    .filter((step) => step.trim())
    .map((step, idx) => {
      return { step: idx + 1, description: step.trim() };
    });
  return steps;
}
