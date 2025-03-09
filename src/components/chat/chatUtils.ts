
export interface N8nChatResponse {
  index?: number;
  message?: {
    role?: string;
    content?: string;
    refusal?: null | string;
  };
  logprobs?: null | any;
  finish_reason?: string;
  output?: string;
  reply?: string;
  [key: string]: any;
}

export const extractResponseText = (data: any): string => {
  console.log("Processing response data:", data);
  
  // New format: {"index":0,"message":{"role":"assistant","content":"Hello!"},"logprobs":null,"finish_reason":"stop"}
  if (data && data.message && data.message.content) {
    return data.message.content;
  }
  
  // Check if the response follows the original expected format with an array
  if (Array.isArray(data) && data.length > 0) {
    if (data[0]?.output) {
      return data[0].output;
    }
    if (data[0]?.message?.content) {
      return data[0].message.content;
    }
  }
  
  // Handle case where data is an N8nChatResponse object (original format)
  const responseData = data as N8nChatResponse;
  if (responseData.output) return responseData.output;
  if (responseData.reply) return responseData.reply;
  if (responseData.message && typeof responseData.message === 'string' && 
      responseData.message !== "Workflow was started") {
    return responseData.message;
  }
  
  // Fallback response
  return "I received your message, but I'm not sure how to respond to it. Please try again or ask something else.";
};
