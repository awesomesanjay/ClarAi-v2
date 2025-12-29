export function parseIntent(data) {
  // Validate required fields
  if (!data.primaryRequest) {
    throw new Error("Primary request is missing");
  }

  // Determine task type based on output format and content
  // In a real generic parser, this might use an LLM, but here we can map directly from the dropdowns
  let taskType = "general_writing";
  
  if (data.outputType === 'email') taskType = "email_writing";
  if (data.outputType === 'pitch') taskType = "pitch_deck_content";
  if (data.outputType === 'summary') taskType = "summarization";
  if (data.outputType === 'linkedin' || data.outputType === 'tweet') taskType = "social_media";

  return {
    task_type: taskType,
    output_format: data.outputType || "text",
    audience: data.targetAudience || "general",
    tone: data.tone || "neutral",
    length: data.desiredLength || "medium",
    context: data.primaryRequest,
    constraints: data.constraints || [], // Assuming array of strings
    additional_context: data.additionalContext || ""
  };
}
