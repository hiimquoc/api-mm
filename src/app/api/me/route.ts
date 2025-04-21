import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'
import { authOptions } from '@/lib/auth'
import { adminSupabase } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log("session", session.user.id)

    const { data, error } = await adminSupabase
      .from('users')
      .select(`
        id,
        email,
        name,
        avatar_url,
        provider,
        provider_id,
        max_usage,
        usage,
        created_at
      `)
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching user data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: data.id,
      email: data.email,
      name: data.name,
      avatar_url: data.avatar_url,
      provider: data.provider,
      max_usage: data.max_usage,
      usage: data.usage,
      created_at: data.created_at,
    })
  } catch (error) {
    console.error('Unexpected error in /me endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 