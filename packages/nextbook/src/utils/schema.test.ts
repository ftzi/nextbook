import { describe, expect, test } from "bun:test"
import { z } from "zod"
import { generateCombinations, getEnumerableValues, getSchemaDefaults, schemaToControls } from "./schema"

describe("schemaToControls", () => {
	describe("label derivation from prop name", () => {
		test("derives label from camelCase prop name", () => {
			const schema = z.object({
				buttonVariant: z.string(),
			})

			const controls = schemaToControls(schema)

			expect(controls).toHaveLength(1)
			expect(controls[0]?.name).toBe("buttonVariant")
			expect(controls[0]?.label).toBe("Button Variant")
		})

		test("derives label from single word prop name", () => {
			const schema = z.object({
				disabled: z.boolean(),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.label).toBe("Disabled")
		})

		test("derives label from snake_case prop name", () => {
			const schema = z.object({
				button_size: z.string(),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.label).toBe("Button Size")
		})

		test("derives label from kebab-case prop name", () => {
			const schema = z.object({
				"font-weight": z.string(),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.label).toBe("Font Weight")
		})

		test("label is always derived from prop name, never from describe()", () => {
			const schema = z.object({
				variant: z.enum(["primary", "secondary"]).describe("The visual style"),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.label).toBe("Variant")
			expect(controls[0]?.description).toBe("The visual style")
		})
	})

	describe("description from .describe()", () => {
		test("extracts description from describe() method", () => {
			const schema = z.object({
				size: z.enum(["sm", "md", "lg"]).describe("Controls the button size"),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.description).toBe("Controls the button size")
		})

		test("description is undefined when describe() is not used", () => {
			const schema = z.object({
				enabled: z.boolean(),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.description).toBeUndefined()
		})

		test("extracts description with default value", () => {
			const schema = z.object({
				count: z.number().default(5).describe("Number of items to show"),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.label).toBe("Count")
			expect(controls[0]?.description).toBe("Number of items to show")
			expect(controls[0]?.defaultValue).toBe(5)
		})

		test("extracts description from optional field", () => {
			const schema = z.object({
				title: z.string().optional().describe("Optional title text"),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.description).toBe("Optional title text")
		})
	})

	describe("control types", () => {
		test("creates text control for string", () => {
			const schema = z.object({
				name: z.string(),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.type).toBe("text")
			expect(controls[0]?.defaultValue).toBe("")
		})

		test("creates number control for number", () => {
			const schema = z.object({
				count: z.number(),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.type).toBe("number")
			expect(controls[0]?.defaultValue).toBe(0)
		})

		test("creates boolean control for boolean", () => {
			const schema = z.object({
				active: z.boolean(),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.type).toBe("boolean")
			expect(controls[0]?.defaultValue).toBe(false)
		})

		test("creates select control for enum", () => {
			const schema = z.object({
				size: z.enum(["sm", "md", "lg"]),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.type).toBe("select")
			expect(controls[0]?.options).toEqual(["sm", "md", "lg"])
			expect(controls[0]?.defaultValue).toBe("sm")
		})
	})

	describe("default values", () => {
		test("uses default() value when provided", () => {
			const schema = z.object({
				title: z.string().default("Hello"),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.defaultValue).toBe("Hello")
		})

		test("uses enum default when provided", () => {
			const schema = z.object({
				variant: z.enum(["primary", "secondary", "ghost"]).default("secondary"),
			})

			const controls = schemaToControls(schema)

			expect(controls[0]?.defaultValue).toBe("secondary")
		})
	})

	describe("multiple fields", () => {
		test("handles multiple fields with mixed types", () => {
			const schema = z.object({
				buttonText: z.string().default("Click me").describe("Text shown on button"),
				variant: z.enum(["primary", "secondary"]).default("primary"),
				isDisabled: z.boolean().default(false).describe("Disables the button"),
				clickCount: z.number().default(0),
			})

			const controls = schemaToControls(schema)

			expect(controls).toHaveLength(4)

			expect(controls[0]?.name).toBe("buttonText")
			expect(controls[0]?.label).toBe("Button Text")
			expect(controls[0]?.description).toBe("Text shown on button")
			expect(controls[0]?.type).toBe("text")

			expect(controls[1]?.name).toBe("variant")
			expect(controls[1]?.label).toBe("Variant")
			expect(controls[1]?.type).toBe("select")

			expect(controls[2]?.name).toBe("isDisabled")
			expect(controls[2]?.label).toBe("Is Disabled")
			expect(controls[2]?.description).toBe("Disables the button")
			expect(controls[2]?.type).toBe("boolean")

			expect(controls[3]?.name).toBe("clickCount")
			expect(controls[3]?.label).toBe("Click Count")
			expect(controls[3]?.type).toBe("number")
		})
	})
})

describe("getSchemaDefaults", () => {
	test("returns defaults from schema", () => {
		const schema = z.object({
			name: z.string().default("test"),
			count: z.number().default(10),
		})

		const defaults = getSchemaDefaults(schema)

		expect(defaults.name).toBe("test")
		expect(defaults.count).toBe(10)
	})

	test("handles schema without defaults", () => {
		const schema = z.object({
			title: z.string(),
			active: z.boolean(),
		})

		const defaults = getSchemaDefaults(schema)

		expect(defaults.title).toBe("")
		expect(defaults.active).toBe(false)
	})
})

describe("getEnumerableValues", () => {
	test("returns all values for boolean", () => {
		const schema = z.object({
			active: z.boolean(),
		})

		const values = getEnumerableValues(schema)

		expect(values).toHaveLength(1)
		expect(values[0]?.name).toBe("active")
		expect(values[0]?.values).toEqual([false, true])
	})

	test("returns all values for enum", () => {
		const schema = z.object({
			size: z.enum(["sm", "md", "lg"]),
		})

		const values = getEnumerableValues(schema)

		expect(values[0]?.values).toEqual(["sm", "md", "lg"])
	})

	test("returns single default value for string", () => {
		const schema = z.object({
			name: z.string().default("test"),
		})

		const values = getEnumerableValues(schema)

		expect(values[0]?.values).toEqual(["test"])
	})
})

describe("generateCombinations", () => {
	test("generates all combinations for boolean and enum", () => {
		const schema = z.object({
			disabled: z.boolean(),
			size: z.enum(["sm", "lg"]),
		})

		const result = generateCombinations(schema)

		expect(result.total).toBe(4)
		expect(result.truncated).toBe(false)
		expect(result.combinations).toHaveLength(4)
	})

	test("truncates when exceeding limit", () => {
		const schema = z.object({
			a: z.boolean(),
			b: z.boolean(),
			c: z.boolean(),
			d: z.boolean(),
			e: z.boolean(),
			f: z.boolean(),
			g: z.boolean(),
			h: z.boolean(),
		})

		const result = generateCombinations(schema, 10)

		expect(result.total).toBe(256)
		expect(result.truncated).toBe(true)
		expect(result.combinations).toHaveLength(10)
	})

	test("returns single combination for empty schema", () => {
		const schema = z.object({})

		const result = generateCombinations(schema)

		expect(result.total).toBe(1)
		expect(result.combinations).toHaveLength(1)
		expect(result.combinations[0]?.label).toBe("(no props)")
	})
})
