# ai_chatbot/combined_bureau_test.py
import os
from dotenv import load_dotenv
from uagents import Agent, Bureau, Context, Model
from chatbot.handlers import handle_chat

load_dotenv()

class ChatMessage(Model): text: str
class ChatReply(Model):   text: str

chatbot = Agent(name="job_chat_agent", seed=os.getenv("AGENT_SEED"), endpoint=["http://127.0.0.1:8000"])

@chatbot.on_message(model=ChatMessage, replies=ChatReply)
async def on_chat(ctx: Context, sender: str, msg: ChatMessage):
    res = handle_chat((msg.text or "").strip())
    await ctx.send(sender, ChatReply(text=res.message))

pinger = Agent(name="pinger", seed="pinger-seed-dev")

@pinger.on_event("startup")
async def ping(ctx: Context):
    await ctx.send(chatbot.address, ChatMessage(text="Hello! Find React jobs under $800"))

@pinger.on_message(model=ChatReply)
async def got(ctx: Context, sender: str, msg: ChatReply):
    print("REPLY:", msg.text)
    await ctx.stop()

if __name__ == "__main__":
    Bureau(endpoint="http://127.0.0.1:8000").add(chatbot).add(pinger).run()
