import type { FormResponseAnswer, FormResponseListItem } from '@/src/lib/api'

export function getSubmittedTimestamp(value: number) {
  return value < 1_000_000_000_000 ? value * 1000 : value
}

export function formatSubmittedAt(value: string | number | null | undefined) {
  if (!value) {
    return 'Unknown submission time'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown submission time'
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
export function getResponseNumber(_response: FormResponseListItem, total: number, index: number) {
  return Math.max(total - index, 1)
}

export function answersToCsv(
  rows: Array<{
    response: FormResponseListItem
    answers: FormResponseAnswer[]
  }>,
) {
  const questionTitles = Array.from(
    new Set(rows.flatMap((row) => row.answers.map((answer) => answer.questionTitle))),
  )
  const headers = ['Response ID', 'Submitted At', ...questionTitles]
  const body = rows.map((row) => {
    const answersByTitle = new Map(
      row.answers.map((answer) => [answer.questionTitle, answer.answer] as const),
    )

    return [
      row.response.id,
      formatSubmittedAt(row.response.submittedAt),
      ...questionTitles.map((title) => answersByTitle.get(title) ?? ''),
    ]
  })

  return [headers, ...body].map((row) => row.map(escapeCsvCell).join(',')).join('\n')
}

function escapeCsvCell(value: string) {
  if (!/[",\n\r]/.test(value)) {
    return value
  }

  return `"${value.replaceAll('"', '""')}"`
}
