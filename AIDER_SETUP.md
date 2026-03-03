# Aider LLM Configuration Guide

Aider needs an LLM API key to work. Here are your options:

## Option 1: OpenRouter (Recommended - Free Tier Available)

1. Create free account at https://openrouter.ai
2. Get API key from settings
3. Configure aider:

```bash
# On your EC2 server
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com

# Set environment variable
export OPENROUTER_API_KEY=your_key_here

# Or create config file
mkdir -p ~/.config/aider
cat > ~/.config/aider/.aider.conf.yml << 'EOF'
openrouter-api-key: your_key_here
model: openrouter/anthropic/claude-3.5-sonnet
EOF
```

## Option 2: Anthropic Claude (Direct)

1. Get API key from https://console.anthropic.com
2. Configure:

```bash
export ANTHROPIC_API_KEY=your_key_here

# Or in config
cat > ~/.config/aider/.aider.conf.yml << 'EOF'
anthropic-api-key: your_key_here
model: claude-3-5-sonnet-20241022
EOF
```

## Option 3: OpenAI GPT-4

```bash
export OPENAI_API_KEY=your_key_here

# Or in config
cat > ~/.config/aider/.aider.conf.yml << 'EOF'
openai-api-key: your_key_here
model: gpt-4o
EOF
```

## Option 4: Local LLM (Ollama) - FREE, No API Key!

Since you already have Ollama installed on your EC2 server:

```bash
# Pull a good coding model
ollama pull codellama:34b

# Configure aider to use local model
cat > ~/.config/aider/.aider.conf.yml << 'EOF'
model: ollama/codellama:34b
EOF
```

**Note**: Local models are slower but completely free and private!

## Quick Start Script

Create this helper script on your server:

```bash
cat > ~/techpartner/scripts/setup-aider-llm.sh << 'EOF'
#!/bin/bash
echo "Setting up Aider LLM configuration..."

mkdir -p ~/.config/aider

echo "Choose LLM provider:"
echo "1) OpenRouter (free tier available)"
echo "2) Anthropic Claude"
echo "3) OpenAI GPT-4"
echo "4) Local Ollama (FREE, no API key)"
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    read -p "Enter OpenRouter API key: " key
    cat > ~/.config/aider/.aider.conf.yml << EOL
openrouter-api-key: $key
model: openrouter/anthropic/claude-3.5-sonnet
EOL
    echo "✅ OpenRouter configured"
    ;;
  2)
    read -p "Enter Anthropic API key: " key
    cat > ~/.config/aider/.aider.conf.yml << EOL
anthropic-api-key: $key
model: claude-3-5-sonnet-20241022
EOL
    echo "✅ Anthropic configured"
    ;;
  3)
    read -p "Enter OpenAI API key: " key
    cat > ~/.config/aider/.aider.conf.yml << EOL
openai-api-key: $key
model: gpt-4o
EOL
    echo "✅ OpenAI configured"
    ;;
  4)
    echo "Checking Ollama..."
    if ! command -v ollama &> /dev/null; then
      echo "❌ Ollama not found. Install with: curl -fsSL https://ollama.com/install.sh | sh"
      exit 1
    fi
    echo "Pulling codellama:34b (this may take a while)..."
    ollama pull codellama:34b
    cat > ~/.config/aider/.aider.conf.yml << EOL
model: ollama/codellama:34b
EOL
    echo "✅ Local Ollama configured"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "You can now run: /home/ubuntu/.local/bin/aider"
EOF

chmod +x ~/techpartner/scripts/setup-aider-llm.sh
```

## Usage After Setup

```bash
# SSH to server
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com

# Run setup (first time only)
~/techpartner/scripts/setup-aider-llm.sh

# Then use aider
cd ~/techpartner
/home/ubuntu/.local/bin/aider client/components/SEO.tsx

# Or use the task runner
./scripts/run-aider-task.sh 3
```

## Recommended: Use Ollama (Free & Private)

Since you already have Ollama on your server, this is the best option:

```bash
# 1. SSH to server
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com

# 2. Pull a coding model
ollama pull codellama:34b

# 3. Configure aider
mkdir -p ~/.config/aider
cat > ~/.config/aider/.aider.conf.yml << 'EOF'
model: ollama/codellama:34b
EOF

# 4. Start using aider
cd ~/techpartner
/home/ubuntu/.local/bin/aider client/components/SEO.tsx
```

## Model Recommendations

| Model | Quality | Speed | Cost | Best For |
|-------|---------|-------|------|----------|
| Claude 3.5 Sonnet | ⭐⭐⭐⭐⭐ | Fast | $$$ | Complex tasks |
| GPT-4o | ⭐⭐⭐⭐⭐ | Fast | $$$ | General coding |
| CodeLlama 34B | ⭐⭐⭐⭐ | Slow | Free | Simple tasks, budget |
| DeepSeek Coder | ⭐⭐⭐⭐ | Medium | Free | Good balance |

## Troubleshooting

**"No LLM model was specified"**
→ Run the setup script above

**"API key invalid"**
→ Check your API key and quota

**"Ollama connection refused"**
→ Make sure Ollama is running: `ollama serve`

**Slow responses with local model**
→ Use smaller model: `ollama pull codellama:7b`
