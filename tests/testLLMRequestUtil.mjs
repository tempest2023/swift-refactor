// /tests/testLLMRequestUtil.js
// 单元测试文件，用于测试 llmRequestUtil.js 中的 sendLLMRequest 函数。
// 在测试环境中使用 mock 请求，而不实际发起 API 调用。

import sendLLMRequest from '../utils/llmRequestUtil.mjs';
import mockOpenAIResponse from '../mocks/mockLLMResponse.mjs';

import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn()); // Mock fetch 函数

/**
 * 测试 OpenAI 的请求，并使用 Mock 响应。
 */
async function testLLMRequest() {
  // 设置测试环境变量
  process.env.NODE_ENV = 'test';

  // 配置 Mock 的 fetch 请求
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockOpenAIResponse
  });

  // 定义请求参数
  const requestParams = {
    model: 'gpt-3.5-turbo',
    prompt: 'Test OpenAI completion request',
    max_tokens: 300,
    temperature: 0.7
  };

  // 调用函数并捕获结果
  try {
    const result = await sendLLMRequest(requestParams, 'openai');

    // 验证结果
    if (result && result.choices && result.choices.length > 0) {
      console.log('[✅] LLM 请求测试通过:', result.choices[0].text);
    } else {
      console.error('[❌] LLM 请求测试失败');
    }
  } catch (error) {
    console.error('[❌] 发生错误:', error.message);
  }
}

// 运行测试
testLLMRequest();
