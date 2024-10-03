// /utils/llmRequestUtil.js
// 该文件的功能是提供一个可扩展的 LLM 请求工具，支持通过 fetch 函数发送请求，并根据不同的 LLM 服务商配置请求。
// 当前支持 OpenAI 的 GPT 模型，未来可扩展为其他 LLM 服务商，如 Claude、Gemini、DeepSeek 等。

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // 读取 .env 文件中的环境变量

/**
 * LLM 请求工具函数，支持多种模型服务商。
 * @param {object} requestParams - 请求参数，包括模型配置、prompt 等。
 * @param {string} provider - 服务商名称，如 "openai", "claude", "gemini", "deepseek" 等。
 * @returns {object} - 返回异步请求的响应结果。
 */
async function sendLLMRequest(requestParams, provider = 'openai') {
  let apiUrl = '';
  let apiKey = '';

  // 根据不同的服务商设置对应的 API URL 和 API 密钥
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

  if (!apiKey) {
    throw new Error(`API key for ${provider} is missing. Please set it in the environment variables.`);
  }

  // 构建请求头和 body
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    model: requestParams.model || 'gpt-3.5-turbo',
    prompt: requestParams.prompt,
    max_tokens: requestParams.max_tokens || 300,
    temperature: requestParams.temperature || 0.7,
  });

  // 发起 fetch 请求
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Request failed');
    }

    return result;
  } catch (error) {
    console.error(`Error during LLM request: ${error.message}`);
    throw error;
  }
}

export default sendLLMRequest;
