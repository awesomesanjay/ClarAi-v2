/**
 * Selects the best model based on the intent complexity and type.
 */
export function selectModel(intent) {
    // Simple heuristic for now
    const complexTypes = ['pitch_deck_content', 'business_plan', 'technical_analysis'];

    if (complexTypes.includes(intent.task_type) || intent.tone === 'professional') {
        return 'gpt-4o'; // Or 'claude-3-5-sonnet' equivalent
    }

    return 'gpt-4o-mini'; // Faster, cheaper for simple tasks
}

/**
 * Constructs a highly structured system prompt to ensure CLARITY.
 */
export function constructSystemPrompt(intent) {
    return `You are ClarAI, a clarity-first AI assistant.
Your goal is to satisfy the user's intent with a single, high-quality output.

INTENT OBJECT:
${JSON.stringify(intent, null, 2)}

INSTRUCTIONS:
1. Act as an expert compatible with the defined 'audience' and 'tone'.
2. Strictly follow the 'output_format'.
3. Do NOT ask clarifying questions. You must make the best assumption based on the context provided.
4. Do NOT verify or explain your reasoning unless asked.
5. Provide ONLY the final deliverable.

FORMATTING RULES:
- Use Markdown for structure.
- Be concise if length is 'short'.
- Be comprehensive if length is 'detailed'.
`;
}
