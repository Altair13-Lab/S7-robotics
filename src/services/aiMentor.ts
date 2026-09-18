import type { Plan } from '../types'
import { planDetails } from '../types'

export const fallbackResponses = [
  'Let\'s troubleshoot it step by step. Check VCC, then GND, then verify TRIG and ECHO are connected to the pins named in your code. Which step have you already checked?',
  'A useful debugging move is to print the raw duration before converting it to centimeters. What value does pulseIn return when the sensor is still?',
  'Try changing one variable at a time: test the sensor alone, then add your threshold action. This helps us see whether the wiring or the logic is causing the issue.',
]

export function canAskMentor(plan: Plan, used: number) {
  const limit = planDetails[plan].aiLimit
  return limit === null || used < limit
}

export function getMentorResponse(question: string) {
  const normalized = question.toLowerCase()
  if (normalized.includes('0') || normalized.includes('sensor')) return fallbackResponses[0]
  if (normalized.includes('code') || normalized.includes('explain')) return fallbackResponses[1]
  return fallbackResponses[2]
}