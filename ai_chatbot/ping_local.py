# ping_local.py
import os
from uagents import Agent, Bureau, Context, Model

# Force the bureau port via env (some uAgents builds prefer env)
os.environ["UAGENTS_ENDPOINT"] = "http://127.0.0.1:8091"

# >>> replace with YOUR chatbot agent address <<<
TARGET = "agent1q0fuktxn9tk0ncaef3fj8z8348cwtdss9qrechaw90ky3q2kcsn5g0egwz5"

# Message schemas must match your chatbot agent
class ChatMessage(Model):
    text: str

class ChatReply(Model):
    text: str

# Minimal pinger agent
pinger = Agent(name="pinger", seed="pinger-seed-dev")

@pinger.on_event("startup")
async def send_first(ctx: Context):
    ctx.logger.info(f"Sending message to {TARGET} ...")
    await ctx.send(TARGET, ChatMessage(text="Hello! Find remote Java jobs under $1000"))

@pinger.on_message(model=ChatReply)
async def got_reply(ctx: Context, sender: str, msg: ChatReply):
    ctx.logger.info(f"Reply from {sender}: {msg.text!r}")
    # stop after first reply
    try:
        await ctx.stop()
    except Exception:
        pass

if __name__ == "__main__":
    # ALSO pass endpoint here (belt & suspenders)
    bureau = Bureau(endpoint="http://127.0.0.1:8091")
    bureau.add(pinger)
    bureau.run()  # no port kwarg in newer uAgents
