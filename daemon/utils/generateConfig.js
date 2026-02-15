const modelProviderMap = {
    "openai": "openai/gpt-5.1-codex",
    "google": "google/gemini-2.5-flash",
    "anthropic": "anthropic/claude-sonnet-4-5",
    "openrouter": "openrouter/anthropic/claude-sonnet-4-5",
    "moonshot": "moonshot/kimi-k2.5",
    "kimi": "kimi-coding/kimi-k2-thinking",
    "zai": "zai/glm-5",
    "minimax": "minimax/MiniMax-M2.1",
    "synthetic": "synthetic/hf:MiniMaxAI/MiniMax-M2.1",
    "opencode": "opencode/claude-opus-4-6",
    "vercel-ai-gateway": "vercel-ai-gateway/anthropic/claude-opus-4.6"
};

const channelTemplates = {
    "slack-http": {
        enabled: true,
        mode: "http",
        botToken: "xoxb-...",
        signingSecret: "your-signing-secret",
        webhookPath: "/slack/events",
    },
    "slack-socket": {
        enabled: true,
        mode: "socket",
        appToken: "xapp-...",
        botToken: "xoxb-...",
    },
    "discord": {
        enabled: true,
        token: "YOUR_BOT_TOKEN",
    },
    "telegram": {
        enabled: true,
        botToken: "123:abc",
        dmPolicy: "pairing",
        groups: { "*": { requireMention: true } },
    },
    "whatsapp": {
        dmPolicy: "pairing",
        allowFrom: ["+15551234567"],
        groupPolicy: "allowlist",
        groupAllowFrom: ["+15551234567"],
    }
};

export function generateConfig(selectedProviders, selectedChannels) {
    const selectedModelIds = selectedProviders.map(p => modelProviderMap[p]).filter(Boolean);
    const primaryModel = selectedModelIds[0] || "";
    const modelsObj = {};
    selectedModelIds.forEach(id => {
        modelsObj[id] = {};   
    });
    const channelsObj = {};
    selectedChannels.forEach(ch => {
        if (channelTemplates[ch]) {
            const finalKey = ch.startsWith("slack") ? "slack" : ch;
            channelsObj[finalKey] = channelTemplates[ch];
        }
    });
    
    const agentsConfig =
    {
        "defaults": {
            "model": {
                "primary": primaryModel,
            },
            "models": modelsObj,
    }
};

return {
    primaryModel,
    models: modelsObj,
    channels: channelsObj,
    agentsConfig
};
}

// --- Example Usage ---
// Pass "slack-http" or "slack-socket" depending on user choice
// const myProviders = ["openrouter", "openai"];
// const myChannels = ["slack-http", "telegram"];

// const config = generateConfig(myProviders, myChannels);

// console.log(config.channels);
// console.log(config.agentsConfig);
