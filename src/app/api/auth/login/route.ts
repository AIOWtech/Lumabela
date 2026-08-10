import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      id: 'usr_1',
      name: 'Alex Johnson',
      email: email,
      avatar: '',
      token: 'mock_jwt_token_' + Date.now(),
    },
  });
}