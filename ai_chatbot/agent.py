import os
from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
from dotenv import load_dotenv

# Reuse your REST bot’s logic
from chatbot.handlers import handle_chat

load_dotenv()

AGENT_NAME  = os.getenv("AGENT_NAME", "job_chat_agent")
AGENT_SEED  = os.getenv("AGENT_SEED")  # if None, uAgents will still run but address changes per run
MAILBOX_URL = os.getenv("MAILBOX_URL", "https://agentverse.ai")
MAILBOX_KEY = os.getenv("MAILBOX_KEY")  # optional but recommended for judging

# --- Chat message schemas ---
class ChatMessage(Model):
    text: str

class ChatReply(Model):
    text: str
    
public_ep = os.getenv("AGENT_PUBLIC_ENDPOINT")
endpoints = [public_ep] if public_ep else ["http://127.0.0.1:8000"]

# Create agent (enable mailbox if key provided)
agent = Agent(
    name=AGENT_NAME,
    seed=AGENT_SEED,
    endpoint=endpoints,
    mailbox=MAILBOX_URL if MAILBOX_KEY else None,
)

@agent.on_event("startup")
async def on_start(ctx: Context):
    try:
        await fund_agent_if_low(agent.wallet.address())
    except Exception:
        pass

    if MAILBOX_KEY:
        # uAgents reads this var for mailbox auth
        os.environ["UAGENTS_MAILBOX_KEY"] = MAILBOX_KEY
        ctx.logger.info("Mailbox enabled; your agent is discoverable on Agentverse.")
    ctx.logger.info(f"Agent address: {agent.address}")

@agent.on_message(model=ChatMessage, replies=ChatReply)
async def on_chat(ctx: Context, sender: str, msg: ChatMessage):
    """
    Fetch.ai Chat Protocol-style handler.
    Reuses handle_chat() so behavior matches /chat.
    """
    user_text = (msg.text or "").strip()
    result = handle_chat(user_text)
    reply_text = result.message + "\n\n(Use our web app to view the job list panel.)"
    await ctx.send(sender, ChatReply(text=reply_text))


if __name__ == "__main__":
    agent.run()