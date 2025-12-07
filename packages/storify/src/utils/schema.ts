import type { z } from "zod"
import type { ControlConfig, ControlType, PropCombination } from "../types"

// Regex patterns (moved to top level for performance)
const CAMEL_CASE_REGEX = /([a-z])([A-Z])/g
const WORD_SPLIT_REGEX = /[\s_-]+/

/**
 * Extract control configurations from a Zod object schema.
 * Supports string, number, boolean, and enum types.
 *
 * @param schema - A Zod object schema
 * @returns Array of control configurations for the controls panel
 */
export function schemaToControls(schema: z.ZodObject<z.ZodRawShape>): ControlConfig[] {
	const controls: ControlConfig[] = []
	const shape = schema.shape

	for (const [name, fieldSchema] of Object.entries(shape)) {
		const control = fieldSchemaToControl(name, fieldSchema as z.ZodType)
		if (control) {
			controls.push(control)
		}
	}

	return controls
}

/**
 * Convert a single Zod field schema to a control configuration.
 */
function fieldSchemaToControl(name: string, schema: z.ZodType): ControlConfig | null {
	// Unwrap layers (ZodDefault, ZodOptional, etc.) to get the inner type
	const { innerSchema, defaultValue, description } = unwrapSchema(schema)

	// Determine control type from the inner schema
	const controlType = getControlType(innerSchema)
	if (!controlType) {
		return null // Unsupported type
	}

	const control: ControlConfig = {
		type: controlType.type,
		name,
		label: formatLabel(name),
		description,
		defaultValue: defaultValue ?? controlType.defaultValue,
	}

	if (controlType.options) {
		control.options = controlType.options
	}

	return control
}

type UnwrapResult = {
	innerSchema: z.ZodType
	defaultValue: unknown
	description: string | undefined
}

/**
 * Unwrap ZodDefault, ZodOptional, and other wrapper types to get the inner schema.
 * Also extracts default value and description along the way.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Zod schema unwrapping requires nested type checks
function unwrapSchema(schema: z.ZodType): UnwrapResult {
	let current = schema
	let defaultValue: unknown
	let description: string | undefined

	// Extract description - Zod 4 uses a .description getter, Zod 3 uses _def.description
	description = getDescription(current)

	// Unwrap wrapper types - max 10 iterations to prevent infinite loops
	for (let i = 0; i < 10; i++) {
		const typeName = getTypeName(current)
		const innerDef = getZodDef(current)

		if (typeName === "ZodDefault") {
			if (innerDef?.defaultValue !== undefined) {
				defaultValue = typeof innerDef.defaultValue === "function" ? innerDef.defaultValue() : innerDef.defaultValue
			}
			if (innerDef?.innerType && typeof innerDef.innerType === "object") {
				current = innerDef.innerType as z.ZodType
			} else {
				break
			}
		} else if (typeName === "ZodOptional" || typeName === "ZodNullable") {
			if (innerDef?.innerType && typeof innerDef.innerType === "object") {
				current = innerDef.innerType as z.ZodType
			} else {
				break
			}
		} else {
			// Check for description on inner schemas too
			if (!description) {
				description = getDescription(current)
			}
			break
		}
	}

	return { innerSchema: current, defaultValue, description }
}

/**
 * Get the description from a Zod schema.
 * Works with both Zod 3 (_def.description) and Zod 4 (.description getter).
 */
function getDescription(schema: z.ZodType): string | undefined {
	// Zod 4 - has a .description getter property
	const zod4Description = (schema as unknown as { description?: string }).description
	if (zod4Description && typeof zod4Description === "string") {
		return zod4Description
	}

	// Zod 3 - stored in _def.description
	const def = getZodDef(schema)
	if (def?.description && typeof def.description === "string") {
		return def.description
	}

	return undefined
}

type ControlTypeResult = {
	type: ControlType
	defaultValue: unknown
	options?: string[]
}

/**
 * Determine the control type from a Zod schema type.
 */
function getControlType(schema: z.ZodType): ControlTypeResult | null {
	const typeName = getTypeName(schema)
	const def = getZodDef(schema)

	switch (typeName) {
		case "ZodString":
			return { type: "text", defaultValue: "" }

		case "ZodNumber":
			return { type: "number", defaultValue: 0 }

		case "ZodBoolean":
			return { type: "boolean", defaultValue: false }

		case "ZodEnum": {
			// Try to get values from def first, then from options property
			const values = def?.values ?? (schema as { options?: unknown }).options
			if (Array.isArray(values) && values.length > 0) {
				return {
					type: "select",
					defaultValue: values[0] as string,
					options: values as string[],
				}
			}
			return null
		}

		case "ZodLiteral": {
			const value = def?.value
			if (typeof value === "string") {
				return { type: "select", defaultValue: value, options: [value] }
			}
			if (typeof value === "boolean") {
				return { type: "boolean", defaultValue: value }
			}
			if (typeof value === "number") {
				return { type: "number", defaultValue: value }
			}
			return null
		}

		default:
			return null // Unsupported type
	}
}

/**
 * Get the type name from a Zod schema.
 * Works with both Zod 3 (_def.typeName) and Zod 4 (_zod.def.type) patterns.
 */
function getTypeName(schema: z.ZodType): string | undefined {
	// Zod 4 pattern - uses "type" instead of "typeName"
	const zod4Def = (schema as unknown as { _zod?: { def?: { type?: string; typeName?: string } } })._zod?.def
	if (zod4Def?.type) {
		// Zod 4 uses lowercase type names like "default", "string", "enum"
		// Convert to ZodXxx format for compatibility
		const type = zod4Def.type
		return `Zod${type.charAt(0).toUpperCase()}${type.slice(1)}`
	}
	if (zod4Def?.typeName) {
		return zod4Def.typeName
	}

	// Zod 3 pattern
	const zod3Def = (schema as unknown as { _def?: { typeName?: string } })._def
	if (zod3Def?.typeName) {
		return zod3Def.typeName
	}

	return undefined
}

/**
 * Get the definition object from a Zod schema.
 * Works with both Zod 3 and Zod 4 patterns.
 */
function getZodDef(schema: z.ZodType): Record<string, unknown> | undefined {
	// Zod 4 pattern
	const zod4Def = (schema as unknown as { _zod?: { def?: Record<string, unknown> } })._zod?.def
	if (zod4Def) {
		return zod4Def
	}

	// Zod 3 pattern
	const zod3Def = (schema as unknown as { _def?: Record<string, unknown> })._def
	if (zod3Def) {
		return zod3Def
	}

	return undefined
}

/**
 * Format a field name as a human-readable label.
 * Converts camelCase to Title Case with spaces.
 */
function formatLabel(name: string): string {
	// Split on camelCase boundaries
	const words = name.replace(CAMEL_CASE_REGEX, "$1 $2").split(WORD_SPLIT_REGEX)

	// Capitalize first letter of each word
	return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

/**
 * Get default values from a Zod object schema by parsing an empty object.
 * Fields without defaults will be undefined.
 */
export function getSchemaDefaults(schema: z.ZodObject<z.ZodRawShape>): Record<string, unknown> {
	try {
		// Parse empty object - Zod will apply all .default() values
		return schema.parse({}) as Record<string, unknown>
	} catch {
		// If parsing fails (required fields without defaults), build defaults manually
		const defaults: Record<string, unknown> = {}
		const controls = schemaToControls(schema)

		for (const control of controls) {
			defaults[control.name] = control.defaultValue
		}

		return defaults
	}
}

/** Maximum number of combinations before pagination kicks in */
const MAX_COMBINATIONS = 100

/**
 * Dimension metadata for matrix filtering and sorting.
 */
export type DimensionInfo = {
	/** Field name */
	name: string
	/** Human-readable label */
	label: string
	/** All possible values for this dimension */
	values: unknown[]
}

type FieldValues = {
	name: string
	values: unknown[]
}

/**
 * Extract all enumerable values for each field in a Zod object schema.
 * - Boolean: [true, false]
 * - Enum: all enum values
 * - Literal: [the literal value]
 * - String/Number: [default value] (not enumerable, use single default)
 */
export function getEnumerableValues(schema: z.ZodObject<z.ZodRawShape>): FieldValues[] {
	const result: FieldValues[] = []
	const shape = schema.shape

	for (const [name, fieldSchema] of Object.entries(shape)) {
		const values = extractFieldValues(name, fieldSchema as z.ZodType)
		if (values.length > 0) {
			result.push({ name, values })
		}
	}

	return result
}

/**
 * Extract all possible values for a single field.
 */
function extractFieldValues(_name: string, schema: z.ZodType): unknown[] {
	const { innerSchema, defaultValue } = unwrapSchema(schema)
	const typeName = getTypeName(innerSchema)
	const def = getZodDef(innerSchema)

	switch (typeName) {
		case "ZodBoolean":
			return [false, true]

		case "ZodEnum": {
			const values = def?.values ?? (innerSchema as { options?: unknown }).options
			if (Array.isArray(values) && values.length > 0) {
				return values as unknown[]
			}
			return []
		}

		case "ZodLiteral": {
			const value = def?.value
			if (value !== undefined) {
				return [value]
			}
			return []
		}

		case "ZodString":
			return [defaultValue ?? ""]

		case "ZodNumber":
			return [defaultValue ?? 0]

		default:
			// Unsupported type - use default if available
			if (defaultValue !== undefined) {
				return [defaultValue]
			}
			return []
	}
}

/**
 * Get dimension info from a Zod object schema for filtering and sorting.
 * Returns metadata about each enumerable dimension including label and possible values.
 */
export function getDimensions(schema: z.ZodObject<z.ZodRawShape>): DimensionInfo[] {
	const fieldValues = getEnumerableValues(schema)
	return fieldValues.map((field) => ({
		name: field.name,
		label: formatLabel(field.name),
		values: field.values,
	}))
}

/**
 * Generate all combinations of prop values from a Zod object schema.
 * Returns the Cartesian product of all enumerable field values.
 *
 * @param schema - A Zod object schema
 * @param limit - Maximum number of combinations to return (default: 100)
 * @returns Object with combinations array and metadata
 */
export function generateCombinations(
	schema: z.ZodObject<z.ZodRawShape>,
	limit = MAX_COMBINATIONS,
): {
	combinations: PropCombination[]
	total: number
	truncated: boolean
	dimensions: DimensionInfo[]
} {
	const fieldValues = getEnumerableValues(schema)
	const dimensions: DimensionInfo[] = fieldValues.map((field) => ({
		name: field.name,
		label: formatLabel(field.name),
		values: field.values,
	}))

	if (fieldValues.length === 0) {
		return {
			combinations: [{ values: {}, label: "(no props)" }],
			total: 1,
			truncated: false,
			dimensions: [],
		}
	}

	const total = fieldValues.reduce((acc, field) => acc * field.values.length, 1)
	const truncated = total > limit

	const combinations = buildCombinations(fieldValues, limit)
	return { combinations, total, truncated, dimensions }
}

/**
 * Build the Cartesian product of field values up to the given limit.
 */
function buildCombinations(fieldValues: FieldValues[], limit: number): PropCombination[] {
	const combinations: PropCombination[] = []
	const indices: number[] = new Array(fieldValues.length).fill(0)

	while (combinations.length < limit) {
		const combo = buildSingleCombination(fieldValues, indices)
		combinations.push(combo)

		if (!incrementIndices(fieldValues, indices)) {
			break
		}
	}

	return combinations
}

/**
 * Build a single combination from current indices.
 */
function buildSingleCombination(fieldValues: FieldValues[], indices: number[]): PropCombination {
	const values: Record<string, unknown> = {}
	const labelParts: string[] = []

	for (let i = 0; i < fieldValues.length; i++) {
		const field = fieldValues[i]
		if (field) {
			const idx = indices[i] ?? 0
			const value = field.values[idx]
			values[field.name] = value
			labelParts.push(formatValueLabel(field.name, value))
		}
	}

	return { values, label: labelParts.join(", ") }
}

/**
 * Increment indices array like a mixed-radix counter.
 * Returns false if we've wrapped around (all combinations generated).
 */
function incrementIndices(fieldValues: FieldValues[], indices: number[]): boolean {
	for (let i = fieldValues.length - 1; i >= 0; i--) {
		const field = fieldValues[i]
		if (!field) {
			return false
		}
		const currentIdx = indices[i] ?? 0
		const newIdx = currentIdx + 1
		indices[i] = newIdx
		if (newIdx < field.values.length) {
			return true
		}
		indices[i] = 0
	}
	return false
}

/**
 * Format a value for display in the matrix cell label.
 */
function formatValueLabel(name: string, value: unknown): string {
	if (typeof value === "boolean") {
		return value ? name : `!${name}`
	}
	if (typeof value === "string") {
		// Truncate long strings
		const maxLen = 15
		const display = value.length > maxLen ? `${value.slice(0, maxLen)}…` : value
		return `${display}`
	}
	if (typeof value === "number") {
		return String(value)
	}
	return String(value)
}
