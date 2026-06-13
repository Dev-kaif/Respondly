/// <reference types="@cloudflare/workers-types" />

export async function onRequest(
    context: EventContext<Record<string, unknown>, string, Record<string, unknown>>,
) {
    const url = new URL(context.request.url)

    url.hostname = 'respondly-api.rakeshtata082.workers.dev'
    url.protocol = 'https:'
    url.port = ''

    const request = new Request(url.toString(), {
        method: context.request.method,
        headers: context.request.headers,
        body: ['GET', 'HEAD'].includes(context.request.method) ? null : context.request.body,
        redirect: 'manual',
        // @ts-expect-error — duplex required for streaming body
        duplex: 'half',
    })

    const response = await fetch(request)

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    })
}