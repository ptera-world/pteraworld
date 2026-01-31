Orchestration hub for Claude Code agents. Spawns agents via the Agent SDK, tracks status, exposes HTTP API + WebSocket for real-time updates. Designed for phone access over Tailscale.

## What it is

Solves the "multiple terminal windows" problem. POST to `/agents` with a working directory and prompt to spawn a new agent. GET `/agents` to see status and recent output. WebSocket at `/ws` for real-time streaming. Send follow-up messages to running agents via `/agents/:id/message`.

Each agent runs in its own working directory with its own CLAUDE.md context. Mobile-friendly reference UI included.

Built with Bun, @anthropic-ai/claude-agent-sdk, Zod v4, and web-push for mobile notifications.

## What it isn't

- Not swarm intelligence or hive mind orchestration
- Not dozens of specialized agents
- Just HTTP glue for checking on a few agents from your phone
