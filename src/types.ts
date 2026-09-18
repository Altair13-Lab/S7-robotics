export type Role = 'student' | 'mentor' | 'school'
export type Plan = 'free' | 'plus' | 'pro' | 'school'
export type ProjectStatus = 'draft' | 'pending' | 'approved' | 'changes'

export interface Project {
  id: string
  name: string
  technology: string
  difficulty: string
  author: string
  description: string
  code: string
  status: ProjectStatus
  feedback?: string
  submittedAt: string
}

export interface AppState {
  role: Role
  plan: Plan
  completedLessons: number[]
  currentLesson: number
  xp: number
  aiUsed: number
  achievements: string[]
  projects: Project[]
  lessonCompleted: boolean
}

export const planDetails: Record<Plan, { name: string; price: string; tone: string; aiLimit: number | null }> = {
  free: { name: 'Free', price: '0 ₸', tone: 'starter', aiLimit: 5 },
  plus: { name: 'Plus', price: '2,990 ₸', tone: 'growth', aiLimit: 50 },
  pro: { name: 'Pro', price: '7,990 ₸', tone: 'pro', aiLimit: null },
  school: { name: 'School', price: 'Custom', tone: 'school', aiLimit: null },
}

export const initialState: AppState = {
  role: 'student',
  plan: 'free',
  completedLessons: [1, 2, 3],
  currentLesson: 4,
  xp: 750,
  aiUsed: 1,
  achievements: ['FIRST STEP', 'ROBOTICS STARTER'],
  projects: [
    { id: 'seed-1', name: 'LED Controller', technology: 'Arduino', difficulty: 'Beginner', author: 'Arman', description: 'A responsive LED controller.', code: 'digitalWrite(13, HIGH);', status: 'approved', submittedAt: '2 days ago' },
    { id: 'seed-2', name: 'Servo Project', technology: 'Arduino', difficulty: 'Beginner', author: 'Dias', description: 'A small servo experiment.', code: 'servo.write(90);', status: 'changes', feedback: 'Add a clear explanation of the angle logic.', submittedAt: 'Yesterday' },
  ],
  lessonCompleted: false,
}