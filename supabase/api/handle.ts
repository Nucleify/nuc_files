import { readBody } from 'h3'

import type {
  ApiContext,
  ApiHandlerResult,
  Json,
} from '../../../../nuxt/server/api/_types'
import {
  formatRowResponseTimestamps,
  formatRowsResponseTimestamps,
} from '../../../../nuxt/server/api/format_timestamptz_response'
import { resolveGatewayListScope } from '../../../../nuxt/server/api/gateway_auth'

export async function handleFilesApi(
  ctx: ApiContext
): Promise<ApiHandlerResult> {
  const { segments, method, supabase, ok } = ctx
  if (segments[0] !== 'files') return { handled: false }
  if (segments[1] === 'upload' || segments[1] === 'unzip')
    return { handled: true, status: 501, body: { error: 'Use storage flow.' } }
  if (method === 'GET' && segments.length === 1) {
    const scope = await resolveGatewayListScope(supabase, ctx.event)
    if ('error' in scope)
      return {
        handled: true,
        status: scope.status,
        body: { error: scope.error },
      }

    let q = supabase.from('files').select('*').order('id', { ascending: false })
    if (scope.mode === 'own') q = q.eq('user_id', scope.userId)
    const { data, error } = await q
    if (error)
      return { handled: true, status: 500, body: { error: error.message } }
    return {
      handled: true,
      body: ok(formatRowsResponseTimestamps(data || [])),
    }
  }
  if (method === 'POST' && segments.length === 1) {
    const scope = await resolveGatewayListScope(supabase, ctx.event)
    if ('error' in scope)
      return {
        handled: true,
        status: scope.status,
        body: { error: scope.error },
      }

    const raw = (await readBody(ctx.event)) as Json | null
    let body: Json = { ...(raw ?? {}) }
    if (scope.mode === 'own') body = { ...body, user_id: scope.userId }

    const { data, error } = await supabase
      .from('files')
      .insert(body)
      .select('*')
      .single()
    if (error)
      return { handled: true, status: 400, body: { error: error.message } }
    return {
      handled: true,
      status: 201,
      body: ok(data ? formatRowResponseTimestamps(data) : data),
    }
  }
  if ((method === 'PUT' || method === 'PATCH') && segments.length === 2) {
    const scope = await resolveGatewayListScope(supabase, ctx.event)
    if ('error' in scope)
      return {
        handled: true,
        status: scope.status,
        body: { error: scope.error },
      }

    const body = (await readBody(ctx.event)) as Json
    let q = supabase.from('files').update(body).eq('id', segments[1])
    if (scope.mode === 'own') q = q.eq('user_id', scope.userId)
    const { data, error } = await q.select('*').single()
    if (error)
      return { handled: true, status: 400, body: { error: error.message } }
    return {
      handled: true,
      body: ok(formatRowResponseTimestamps(data)),
    }
  }
  if (method === 'DELETE' && segments.length === 2) {
    const scope = await resolveGatewayListScope(supabase, ctx.event)
    if ('error' in scope)
      return {
        handled: true,
        status: scope.status,
        body: { error: scope.error },
      }

    let q = supabase.from('files').delete().eq('id', segments[1])
    if (scope.mode === 'own') q = q.eq('user_id', scope.userId)
    const { error } = await q
    if (error)
      return { handled: true, status: 500, body: { error: error.message } }
    return { handled: true, body: { deleted: true } }
  }
  if (
    method === 'GET' &&
    segments.length === 2 &&
    segments[1] === 'count-by-created-last-week'
  ) {
    const scope = await resolveGatewayListScope(supabase, ctx.event)
    if ('error' in scope)
      return {
        handled: true,
        status: scope.status,
        body: { error: scope.error },
      }

    const since = new Date()
    since.setDate(since.getDate() - 7)
    let q = supabase
      .from('files')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', since.toISOString())
    if (scope.mode === 'own') q = q.eq('user_id', scope.userId)
    const { count, error } = await q
    if (error)
      return { handled: true, status: 500, body: { error: error.message } }
    return { handled: true, body: ok(count ?? 0) }
  }
  return { handled: true, status: 405, body: { error: 'Method not allowed' } }
}
