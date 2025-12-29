import { NextResponse } from 'next/server';
import { parseIntent } from '@/lib/intent';
import { selectModel, constructSystemPrompt } from '@/lib/orchestrator';
import { generateContent } from '@/lib/llm';

export async function POST(request) {
    try {
        const body = await request.json();

        // 1. Intent Parsing
        const intent = parseIntent(body);

        // 2. Model Routing
        const model = selectModel(intent);

        // 3. Prompt Orchestration
        const systemPrompt = constructSystemPrompt(intent);
        const userMessage = intent.context + (intent.additional_context ? `\n\nAdditional Context: ${intent.additional_context}` : "");

        // 4. AI Execution
        const result = await generateContent(model, systemPrompt, userMessage);

        return NextResponse.json({
            success: true,
            data: result,
            meta: {
                model_used: model,
                intent_detected: intent.task_type
            }
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
