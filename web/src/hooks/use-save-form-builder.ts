import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createQuestion,
  deleteQuestion,
  formsQueryKeys,
  reorderQuestions,
  type SaveQuestionPayload,
  saveFormBuilder,
  updateQuestion,
} from '@/src/lib/api'
import { type BuilderQuestion } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

function isTemporaryQuestion(question: BuilderQuestion) {
  return question.id.startsWith('temp-')
}

function toQuestionPayload(question: BuilderQuestion, position: number): SaveQuestionPayload {
  const base = {
    type: question.type,
    title: question.title,
    required: question.required,
    position,
  }

  if (question.type === 'multiple_choice') {
    return {
      ...base,
      placeholder: null,
      optionsJson: JSON.stringify(question.options),
      settingsJson: null,
    }
  }

  if (question.type === 'rating') {
    return {
      ...base,
      placeholder: null,
      optionsJson: null,
      settingsJson: JSON.stringify(question.settings),
    }
  }

  return {
    ...base,
    placeholder: question.placeholder || null,
    optionsJson: null,
    settingsJson: null,
  }
}

export function useSaveFormBuilder(formId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const state = useBuilderStore.getState()
      const form = state.form

      if (!form) {
        throw new Error('Form is not loaded yet.')
      }

      const updatedForm = await saveFormBuilder(formId, {
        title: form.title,
        description: form.description,
        theme: state.builderConfig.theme,
        builderConfig: JSON.stringify(state.builderConfig),
      })

      const syncedQuestions: BuilderQuestion[] = []

      for (const [index, question] of state.questions.entries()) {
        const payload = toQuestionPayload(question, index)

        if (isTemporaryQuestion(question)) {
          const createdQuestion = await createQuestion(formId, payload)
          useBuilderStore.getState().replaceQuestionId(question.id, createdQuestion.id)
          syncedQuestions.push({ ...question, id: createdQuestion.id })
        } else {
          await updateQuestion(question.id, payload)
          syncedQuestions.push(question)
        }
      }

      await Promise.all(state.deletedQuestionIds.map((questionId) => deleteQuestion(questionId)))
      await reorderQuestions(
        formId,
        syncedQuestions.map((question) => question.id),
      )

      useBuilderStore.setState({
        form: updatedForm,
        questions: syncedQuestions,
        deletedQuestionIds: [],
        isDirty: false,
      })

      return {
        form: updatedForm,
        questions: syncedQuestions,
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.detail(formId) })
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.all })
    },
  })
}
