import { createHighlighter } from "shiki"
import { CodeDemo } from "./code-demo"
import { codeExamples } from "./code-examples"

const highlighterPromise = createHighlighter({
	themes: ["github-dark"],
	langs: ["tsx"],
})

export async function CodeDemoServer() {
	const highlighter = await highlighterPromise

	const basic = highlighter.codeToHtml(codeExamples.basic, { lang: "tsx", theme: "github-dark" })
	const controls = highlighter.codeToHtml(codeExamples.controls, { lang: "tsx", theme: "github-dark" })
	const matrix = highlighter.codeToHtml(codeExamples.matrix, { lang: "tsx", theme: "github-dark" })

	return <CodeDemo highlightedCode={{ basic, controls, matrix }} />
}
