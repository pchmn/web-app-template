import type { Config } from '@react-router/dev/config';
import 'react-router';

declare module 'react-router' {
  interface Future {
    unstable_middleware: true; // 👈 Enable middleware types
  }
}

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    unstable_middleware: true, // 👈 Enable middleware
  },
} satisfies Config;
