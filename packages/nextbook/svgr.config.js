/** @type {import('@svgr/core').Config} */
export default {
	typescript: true,
	jsxRuntime: "automatic",
	replaceAttrValues: {
		"#000": "currentColor",
	},
	svgProps: {
		"aria-hidden": "true",
	},
	filenameCase: "kebab",
	index: false,
}
