import { Link } from '@tanstack/react-router'
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatSubmittedAt, getResponseNumber } from '@/src/lib/responses/format'

type ResponseListItemProps = {
    formId: string
    response: {
        id: string
        submittedAt: string
    }
    page: number
    index: number
    totalResponses: number
    onDelete?: (responseId: string) => void
}

export function ResponseListItem({
    formId,
    response,
    page,
    index,
    totalResponses,
    onDelete,
}: ResponseListItemProps) {
    return (
        <div className="flex h-20 items-center justify-between rounded-xl border bg-background p-4 shadow-xs transition-colors hover:bg-muted/40">
            <Link
                to="/forms/$id/responses/$responseId"
                params={{
                    id: formId,
                    responseId: response.id,
                }}
                search={{
                    page,
                    submittedAt: String(response.submittedAt),
                }}
                className="min-w-0 flex-1"
            >
                <p className="text-sm font-medium">
                    Response #
                    {getResponseNumber(response, totalResponses, index)}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    Submitted {formatSubmittedAt(response.submittedAt)}
                </p>
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link
                            to="/forms/$id/responses/$responseId"
                            params={{
                                id: formId,
                                responseId: response.id,
                            }}
                            search={{
                                page,
                                submittedAt: String(response.submittedAt),
                            }}
                        >
                            <ExternalLink />
                            Open
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={(event) => {
                            event.preventDefault()
                            onDelete?.(response.id)
                        }}
                    >
                        <Trash2 />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}