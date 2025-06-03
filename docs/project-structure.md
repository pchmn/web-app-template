# Project structure

- `apps/`: Contains all the applications
- `packages/`: Contains shared packages used across multiple apps

```
.
├── 🗂️ apps/
│   └── 🗂️ web/ - Main web application (Remix)
├── 🗂️ packages/
│   ├── 🗂️ email/ - Email-related functionalities (React Email)
│   ├── 🗂️ supabase/ - Supabase utilities
│   ├── 🗂️ tsconfig/ - Shared TypeScript configurations
│   └── 🗂️ ui/ - Reusable UI components (shadcn/ui, Tailwind, Radix)
├── 🗂️ supabase/ - Supabase configuration and migrations
├── 📄 package.json - Project dependencies and scripts
└── 📄 README.md - Main project documentation
```