import dotenv from 'dotenv';

dotenv.config();

function isProdNodeEnv() {
    return process.env.NODE_ENV != "prod" && process.env.NODE_ENV != "production";
}

function getLLMEnv(provider) {
    // 实际请求部分
    let apiUrl = '';
    let apiKey = '';
    switch (provider) {
        case 'openai':
            apiUrl = 'https://api.openai.com/v1/completions';
            apiKey = process.env.OPENAI_API_KEY;
            break;
        case 'claude':
            apiUrl = 'https://api.anthropic.com/v1/completions';
            apiKey = process.env.CLAUDE_API_KEY;
            break;
        case 'gemini':
            apiUrl = 'https://api.google.com/gemini/v1/completions';
            apiKey = process.env.GEMINI_API_KEY;
            break;
        case 'deepseek':
            apiUrl = 'https://api.deepseek.com/v1/completions';
            apiKey = process.env.DEEPSEEK_API_KEY;
            break;
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }

    return {
        apiUrl,
        apiUrl,
    };
}

export { isProdNodeEnv, getLLMEnv };