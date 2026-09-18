import { useEffect, useState } from 'react'
import type { AppState, Plan, Project, Role } from '../types'
import { initialState } from '../types'

const STORAGE_KEY = 's7-robotics-state'

export function readState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
  } catch {
    return initialState
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useAppState() {
  const [state, setState] = useState<AppState>(readState)

  useEffect(() => saveState(state), [state])

  const update = (changes: Partial<AppState>) => setState((current) => ({ ...current, ...changes }))
  const setRole = (role: Role) => update({ role })
  const setPlan = (plan: Plan) => update({ plan })
  const addProject = (project: Project) => update({ projects: [project, ...state.projects] })
  const updateProject = (id: string, changes: Partial<Project>) => update({ projects: state.projects.map((project) => project.id === id ? { ...project, ...changes } : project) })

  return { state, update, setRole, setPlan, addProject, updateProject }
}