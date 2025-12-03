export const codeExamples = {
	basic: `import { story } from "nextbook"
import { Button } from "@/components/ui/button"

export const Default = story({
  render: () => <Button>Click me</Button>,
})`,
	controls: `import { story } from "nextbook"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const Controlled = story({
  schema: z.object({
    variant: z.enum(["primary", "secondary"]).default("primary"),
    disabled: z.boolean().default(false),
    children: z.string().default("Click me"),
  }),
  render: (props) => <Button {...props} />,
})`,
	matrix: `import { storyMatrix } from "nextbook"
import { z } from "zod"
import { Button } from "@/components/ui/button"

// Generates ALL 12 combinations automatically!
// (3 variants × 2 sizes × 2 disabled states)
export const Matrix = storyMatrix({
  schema: z.object({
    variant: z.enum(["primary", "secondary", "ghost"]),
    size: z.enum(["sm", "lg"]),
    disabled: z.boolean(),
  }),
  render: (props) => <Button {...props}>Click me</Button>,
})`,
} as const

export type TabId = keyof typeof codeExamples
