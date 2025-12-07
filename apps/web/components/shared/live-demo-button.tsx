import { cva } from "class-variance-authority"
import { Blocks } from "lucide-react"
import Link from "next/link"

type LiveDemoButtonProps = {
	size?: "default" | "sm" | "lg"
	onClick?: () => void
}

const sizeVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all",
	{
		variants: {
			size: {
				// Heights account for 1px wrapper padding on each side (p-px on wrapper)
				default: "h-[34px] px-4 py-2 text-sm",
				sm: "h-[30px] gap-1.5 px-3 text-sm",
				lg: "h-[38px] px-6 text-sm",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
)

export function LiveDemoButton({ size = "sm", onClick }: LiveDemoButtonProps) {
	return (
		<span className="relative inline-flex rounded-md bg-gradient-to-r from-brand-purple via-brand-pink to-brand-purple p-px">
			<Link href="/ui" onClick={onClick} className={`${sizeVariants({ size })} rounded-[5px] bg-zinc-950`}>
				<Blocks className="size-4" />
				Live Demo
			</Link>
		</span>
	)
}
