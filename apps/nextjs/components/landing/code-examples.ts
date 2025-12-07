export const codeExamples = {
	basic: `import { story } from "@ftzi/storify"
import { Button } from "@/components/ui/button"

export const Default = story({
  render: () => <Button>Click me</Button>,
})`,
	controls: `import { story } from "@ftzi/storify"
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
	matrix: `import { storyMatrix } from "@ftzi/storify"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export const Matrix = storyMatrix({
  schema: z.object({
    variant: z.enum(["default", "secondary", "outline", "ghost"]),
    size: z.enum(["sm", "default", "lg"]),
    loading: z.boolean(),
  }),
  render: (props) => <Button {...props}>Click me</Button>,
})`,
} as const

export type TabId = keyof typeof codeExamples
