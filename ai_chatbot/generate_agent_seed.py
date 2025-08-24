# tools/make_seed.py (run once locally)
from uagents import Agent
a = Agent(name="temp")
print("AGENT_SEED=", a.seed)  # keep secret!
print("AGENT_ADDRESS=", a.address)  # keep secret!

