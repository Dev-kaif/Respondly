import { create } from 'zustand'

import {
  createDefaultQuestion,
  type BuilderQuestion,
  type QuestionType,
} from '@/src/lib/builder-questions'
import { DEFAULT_BUILDER_CONFIG, type BuilderConfig } from '@/src/lib/builder-config'
import type { BuilderForm } from '@/src/lib/api'

type BuilderStore = {
  form: BuilderForm | null
  questions: BuilderQuestion[]
  builderConfig: BuilderConfig
  selectedQuestionId: string | null
  deletedQuestionIds: string[]
  isDirty: boolean
  setForm: (form: BuilderForm | null) => void
  setQuestions: (questions: BuilderQuestion[]) => void
  setBuilderConfig: (builderConfig: BuilderConfig) => void
  addQuestion: (type: QuestionType) => void
  insertQuestion: (type: QuestionType, index: number) => void
  updateQuestion: (
    questionId: string,
    updater: (question: BuilderQuestion) => BuilderQuestion,
  ) => void
  deleteQuestion: (questionId: string) => void
  replaceQuestionId: (temporaryId: string, persistedId: string) => void
  selectQuestion: (questionId: string | null) => void
  reorderQuestions: (questionIds: string[]) => void
  resetPersistenceTracking: () => void
  markDirty: () => void
  resetDirty: () => void
}

function isTemporaryQuestionId(questionId: string) {
  return questionId.startsWith('temp-')
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  form: null,
  questions: [],
  builderConfig: DEFAULT_BUILDER_CONFIG,
  selectedQuestionId: null,
  deletedQuestionIds: [],
  isDirty: false,
  setForm: (form) => set({ form }),
  setQuestions: (questions) => set({ questions }),
  setBuilderConfig: (builderConfig) => set({ builderConfig }),
  addQuestion: (type) =>
    set((state) => {
      const question = createDefaultQuestion(type)

      return {
        questions: [...state.questions, question],
        selectedQuestionId: question.id,
        isDirty: true,
      }
    }),
  insertQuestion: (type, index) =>
    set((state) => {
      const question = createDefaultQuestion(type)
      const insertIndex = Math.max(0, Math.min(index, state.questions.length))

      return {
        questions: [
          ...state.questions.slice(0, insertIndex),
          question,
          ...state.questions.slice(insertIndex),
        ],
        selectedQuestionId: question.id,
        isDirty: true,
      }
    }),
  updateQuestion: (questionId, updater) =>
    set((state) => ({
      questions: state.questions.map((question) =>
        question.id === questionId ? updater(question) : question,
      ),
      isDirty: true,
    })),
  deleteQuestion: (questionId) =>
    set((state) => ({
      questions: state.questions.filter((question) => question.id !== questionId),
      selectedQuestionId:
        state.selectedQuestionId === questionId ? null : state.selectedQuestionId,
      deletedQuestionIds: isTemporaryQuestionId(questionId)
        ? state.deletedQuestionIds
        : state.deletedQuestionIds.includes(questionId)
          ? state.deletedQuestionIds
          : [...state.deletedQuestionIds, questionId],
      isDirty: true,
    })),
  replaceQuestionId: (temporaryId, persistedId) =>
    set((state) => ({
      questions: state.questions.map((question) =>
        question.id === temporaryId ? { ...question, id: persistedId } : question,
      ),
      selectedQuestionId:
        state.selectedQuestionId === temporaryId ? persistedId : state.selectedQuestionId,
    })),
  selectQuestion: (questionId) => set({ selectedQuestionId: questionId }),
  reorderQuestions: (questionIds) =>
    set((state) => {
      const byId = new Map(state.questions.map((question) => [question.id, question]))
      const reordered = questionIds
        .map((questionId) => byId.get(questionId))
        .filter((question): question is BuilderQuestion => Boolean(question))

      if (reordered.length !== state.questions.length) {
        return state
      }

      return {
        questions: reordered,
        isDirty: true,
      }
    }),
  resetPersistenceTracking: () => set({ deletedQuestionIds: [] }),
  markDirty: () => set({ isDirty: true }),
  resetDirty: () => set({ isDirty: false }),
}))
