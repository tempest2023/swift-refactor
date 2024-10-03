// /utils/llmRequestUtil.mjs
// 该文件的功能是提供一个可扩展的 LLM 请求工具，支持通过 fetch 函数发送请求，并根据不同的 LLM 服务商配置请求。
// 当前支持 OpenAI 的 GPT 模型，未来可扩展为其他 LLM 服务商，如 Claude、Gemini、DeepSeek 等。
// 在测试和 Mock 环境下，不发送真实请求，而是从 /persistent-mocks/ 读取 mock 数据。

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { getLLMEnv } from './envInfo.mjs'

dotenv.config(); // 读取 .env 文件中的环境变量

/**
 * 从 persistent-mocks 目录中加载 mock 数据
 * @param {string} provider - 服务商名称，如 "openai", "claude", "gemini", "deepseek" 等。
 * @returns {object} - 返回模拟的响应数据
 */
function loadMockData(provider) {
  const mockFilePath = path.resolve(`./persistent-mocks/${provider}MockResponse.json`);
  if (fs.existsSync(mockFilePath)) {
    const mockData = fs.readFileSync(mockFilePath, 'utf-8');
    return JSON.parse(mockData);
  } else {
    throw new Error(`Mock data for provider ${provider} not found.`);
  }
}

/**
 * LLM 请求工具函数，支持多种模型服务商。
 * 在测试和 Mock 环境下，读取 mock 数据，而不发送真实请求。
 * @param {object} requestParams - 请求参数，包括模型配置、prompt 等。
 * @param {string} provider - 服务商名称，如 "openai", "claude", "gemini", "deepseek" 等。
 * @returns {object} - 返回异步请求的响应结果。
 */
async function sendLLMRequest(requestParams, provider = 'openai') {
  const isTestOrMock = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'mock';

  // 在 test 和 mock 模式下，直接返回 mock 数据
  if (isTestOrMock) {
    return loadMockData(provider);
  }

  // 实际请求部分
  let { apiUrl, apiKey } = getLLMEnv(provider)

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
