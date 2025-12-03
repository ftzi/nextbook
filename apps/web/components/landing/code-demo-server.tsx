import { codeToHtml } from "shiki"
import { CodeDemo, codeExamples } from "./code-demo"

export async function CodeDemoServer() {
	const [basic, controls, matrix] = await Promise.all([
		codeToHtml(codeExamples.basic, { lang: "tsx", theme: "github-dark" }),
		codeToHtml(codeExamples.controls, { lang: "tsx", theme: "github-dark" }),
		codeToHtml(codeExamples.matrix, { lang: "tsx", theme: "github-dark" }),
	])

	return <CodeDemo highlightedCode={{ basic, controls, matrix }} />
}
