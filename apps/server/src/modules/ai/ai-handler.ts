import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { stream } from 'hono/streaming';
import { factory } from '~/lib/factory';

export const aiHandler = factory.createHandlers(async (c) => {
  const body = await c.req.json();
  const messages = body.messages || [];

  const result = streamText({
    model: google('gemini-1.5-flash'),
    messages,
  });

  c.header('X-Vercel-AI-Data-Stream', 'v1');
  c.header('Content-Type', 'text/plain; charset=utf-8');

  return stream(c, (stream) => stream.pipe(result.toDataStream()));
});
