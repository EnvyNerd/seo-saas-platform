from app.services.gemini_service import generate_content_with_fallback

class ChatAgent:
    """
    A general-purpose AI assistant that maintains conversation history.
    """
    def __init__(self):
        self.history = []

    def clear_history(self):
        self.history = []

    def ask(self, prompt: str) -> str:
        """
        Sends a prompt to the AI with full conversation context.
        """
        # Build context from history
        context = ""
        if self.history:
            context = "Conversation History:\n"
            for msg in self.history[-10:]: # Keep last 10 exchanges for context
                context += f"{msg['role'].upper()}: {msg['content']}\n"
            context += "\n"

        full_prompt = f"""
        Act as a helpful, versatile, and highly intelligent AI assistant.
        You are part of the SEO SaaS Platform, but you can help with any task including coding, 
        writing, analysis, and general knowledge.

        {context}
        USER: {prompt}
        ASSISTANT:
        """

        response = generate_content_with_fallback(full_prompt)
        
        # Save to history
        self.history.append({"role": "user", "content": prompt})
        self.history.append({"role": "assistant", "content": response})
        
        return response

# Singleton instance for the session
chat_agent = ChatAgent()
