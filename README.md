<!-- Hero Image -->
<p align="center">
  <img src="https://mintcdn.com/clawdhub/FaXdIfo7gPK_jSWb/assets/openclaw-logo-text.png?w=1650&fit=max&auto=format&n=FaXdIfo7gPK_jSWb&q=85&s=e82a8bd9b834bec4f6e97303deb1735b" alt="OpenClaw AI Platform" width="800" />
</p>

# OpenClaw Model List

A simple and public list of **all AI models supported by OpenClaw**.

- **Total models:** 689  
- **Purpose:** Help developers quickly choose the right model  
- **Source of truth:** `openclaw_models.json`

---

## Model JSON Schema (Simple)

Every model in OpenClaw follows this structure:

```json
{
  "id": "unique-model-id",
  "name": "human readable name",
  "provider": "model provider",
  "contextWindow": 200000,
  "reasoning": false,
  "input": ["text", "image"]
}
````

### What each field means

| Field           | Meaning                      |
| --------------- | ---------------------------- |
| `id`            | Model identifier used in API |
| `name`          | Display name                 |
| `provider`      | Hosting platform             |
| `contextWindow` | Maximum tokens               |
| `reasoning`     | Advanced reasoning support   |
| `input`         | Supported input types        |

---

## How to Choose a Model (Quick Guide)

* **Fast chat apps:** small, non-reasoning models
* **Large documents:** high context window (100k+)
* **Images + text:** models with `image` input
* **Agents / planning:** models with `reasoning: true`

---

## Common Use Cases

* Chatbots
* Customer support
* Fast API responses
* Multimodal prompts
* Production chat systems
* Summarization
* SaaS integrations
* High-traffic applications

---

## Official Showcase

See OpenClaw in action:
👉 [https://openclaw.ai/showcase](https://openclaw.ai/showcase)

---

## Notes

* Model availability depends on the provider
* Context window is the maximum supported tokens
* Input types must match model capability

---