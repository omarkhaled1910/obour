'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { memberLoginSchema, memberSignUpSchema, parseOrThrow } from '@/lib/validation'
import type { ActionResult } from './submissions'

const MEMBER_COOKIE_NAME = 'member-token'
const PAYLOAD_COOKIE_NAME = 'payload-token'

export type MemberSignUpInput = {
  fullName: string
  phone: string
  password: string
  age?: string
  job?: string
  email?: string
  governorate?: string
}

export type MemberLoginInput = {
  phone: string
  password: string
}

export type MemberSession = {
  id: string
  fullName: string
}

function failure(error: unknown): ActionResult<MemberSession> {
  console.error(error)
  const message = error instanceof Error ? error.message : ''
  return {
    success: false,
    error: /[؀-ۿ]/.test(message) ? message : 'حدث خطأ غير متوقع، حاول مرة أخرى',
  }
}

async function setMemberCookie(token: string, exp: number) {
  ;(await cookies()).set(MEMBER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(exp * 1000),
  })
}

export async function signUpMember(input: MemberSignUpInput): Promise<ActionResult<MemberSession>> {
  try {
    const data = parseOrThrow(memberSignUpSchema, input)
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'members',
      data: {
        username: data.phone,
        password: data.password,
        fullName: data.fullName,
        age: data.age ? Number(data.age) : undefined,
        job: data.job,
        email: data.email,
        governorate: data.governorate,
      },
    })

    const result = await payload.login({
      collection: 'members',
      data: { username: data.phone, password: data.password },
    })

    if (!result.token || !result.user) throw new Error('تم إنشاء الحساب لكن تعذّر تسجيل الدخول، من فضلك سجّل دخولك يدويًا')

    await setMemberCookie(result.token, result.exp ?? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7)

    return { success: true, data: { id: String(result.user.id), fullName: data.fullName } }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: number }).code === 11000) {
      return { success: false, error: 'رقم الهاتف ده مسجّل بحساب من قبل، جرّب تسجّل الدخول' }
    }
    return failure(error)
  }
}

export async function logInMember(input: MemberLoginInput): Promise<ActionResult<MemberSession>> {
  try {
    const data = parseOrThrow(memberLoginSchema, input)
    const payload = await getPayload({ config })

    const result = await payload.login({
      collection: 'members',
      data: { username: data.phone, password: data.password },
    })

    if (!result.token || !result.user) throw new Error('رقم الهاتف أو كلمة السر غلط')

    await setMemberCookie(result.token, result.exp ?? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7)

    const fullName =
      typeof (result.user as { fullName?: unknown }).fullName === 'string'
        ? ((result.user as { fullName?: string }).fullName as string)
        : ''

    return { success: true, data: { id: String(result.user.id), fullName } }
  } catch {
    return { success: false, error: 'رقم الهاتف أو كلمة السر غلط' }
  }
}

export async function logOutMember(): Promise<void> {
  ;(await cookies()).delete(MEMBER_COOKIE_NAME)
}

export async function getCurrentMember(): Promise<MemberSession | null> {
  const token = (await cookies()).get(MEMBER_COOKIE_NAME)?.value
  if (!token) return null

  try {
    const payload = await getPayload({ config })
    const headers = new Headers({ cookie: `${PAYLOAD_COOKIE_NAME}=${token}` })
    const { user } = await payload.auth({ headers })

    if (!user) return null
    const fullName = typeof (user as { fullName?: unknown }).fullName === 'string'
      ? ((user as { fullName?: string }).fullName as string)
      : null
    if (fullName === null) return null

    return { id: String(user.id), fullName }
  } catch {
    return null
  }
}
