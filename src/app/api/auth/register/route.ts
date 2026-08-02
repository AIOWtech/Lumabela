import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      id: 'usr_new_' + Date.now(),
      name,
      email,
      avatar: '',
      token: 'mock_jwt_token_' + Date.now(),
    },
  });
}