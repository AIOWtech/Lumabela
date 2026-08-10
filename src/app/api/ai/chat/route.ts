import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { message, conversationId } = body;

  const responses: Record<string, string> = {
    default: "I'm Lumi, your AI learning assistant! I can help you understand concepts, solve problems, and create study plans. What would you like to learn about today?",
    hello: "Hello! 👋 I'm here to help you learn. You can ask me about any topic, request explanations, or get help with your coursework.",
    react: "React is a JavaScript library for building user interfaces. The key concepts include components, JSX, state, props, and the virtual DOM. Would you like me to explain any specific aspect?",
    help: "I can help you with:\n\n📚 **Explaining concepts** - Ask me about any topic\n🧩 **Practice problems** - I'll create exercises\n📝 **Study plans** - Personalized learning paths\n💡 **Code review** - Share code for feedback\n🎯 **Quiz prep** - Test your knowledge",
  };

  const lowerMsg = (message || '').toLowerCase();
  let reply = responses.default;
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg === 'hi') reply = responses.hello;
  else if (lowerMsg.includes('react')) reply = responses.react;
  else if (lowerMsg.includes('help')) reply = responses.help;
  else if (message) reply = `That's a great question about "${message}"! Let me break it down for you:\n\n1. **Core Concept**: The fundamental idea here involves understanding the underlying principles and how they connect.\n\n2. **Practical Application**: In real-world scenarios, this is applied by...\n\n3. **Key Takeaway**: The most important thing to remember is...\n\nWould you like me to dive deeper into any of these points?`;

  return NextResponse.json({
    reply,
    conversationId: conversationId || 'conv_' + Date.now(),
    timestamp: new Date().toISOString(),
  });
}