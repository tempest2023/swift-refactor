// /tests/testLLMRequestUtil.mjs
// 该文件的功能是测试 llmRequestUtil.mjs 中的 sendLLMRequest 函数，
// 在测试和 Mock 环境下从 /persistent-mocks 读取 mock 数据，而不是发送真实请求。

import sendLLMRequest from '../utils/llmRequestUtil.mjs';
import fs from 'fs';
import path from 'path';

describe('sendLLMRequest', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test'; // 设置为测试环境
  });

  /**
   * 测试 OpenAI 模拟数据
   */
  test('should return mock response for OpenAI provider', async () => {
    const mockFilePath = path.resolve('./persistent-mocks/openaiMockResponse.json');
    const mockData = JSON.parse(fs.readFileSync(mockFilePath, 'utf-8'));

    const requestParams = {
      model: 'gpt-3.5-turbo',
      prompt: 'Test OpenAI completion request',
      max_tokens: 300,
      temperature: 0.7,
    };

    const result = await sendLLMRequest(requestParams, 'openai');

    // 验证结果是否与 mock 数据匹配
    expect(result).toEqual(mockData);
    expect(result.choices[0].text).toBe('This is a mock response from OpenAI\'s GPT model for testing purposes.');
  });

  /**
   * 测试 Claude 模拟数据
   */
  test('should return mock response for Claude provider', async () => {
    const mockFilePath = path.resolve('./persistent-mocks/claudeMockResponse.json');
    const mockData = JSON.parse(fs.readFileSync(mockFilePath, 'utf-8'));

    const requestParams = {
      model: 'claude-2.0',
      prompt: 'Test Claude completion request',
      max_tokens: 300,
      temperature: 0.7,
    };

    const result = await sendLLMRequest(requestParams, 'claude');

    // 验证结果是否与 mock 数据匹配
    expect(result).toEqual(mockData);
    expect(result.choices[0].text).toBe('This is a mock response from Claude model for testing purposes.');
  });

  /**
   * 测试 Gemini 模拟数据
   */
  test('should return mock response for Gemini provider', async () => {
    const mockFilePath = path.resolve('./persistent-mocks/geminiMockResponse.json');
    const mockData = JSON.parse(fs.readFileSync(mockFilePath, 'utf-8'));

    const requestParams = {
      model: 'gemini-1.0',
      prompt: 'Test Gemini completion request',
      max_tokens: 300,
      temperature: 0.7,
    };

    const result = await sendLLMRequest(requestParams, 'gemini');

    // 验证结果是否与 mock 数据匹配
    expect(result).toEqual(mockData);
    expect(result.choices[0].text).toBe('This is a mock response from Google\'s Gemini model for testing purposes.');
  });

  /**
   * 测试 DeepSeek 模拟数据
   */
  test('should return mock response for DeepSeek provider', async () => {
    const mockFilePath = path.resolve('./persistent-mocks/deepseekMockResponse.json');
    const mockData = JSON.parse(fs.readFileSync(mockFilePath, 'utf-8'));

    const requestParams = {
      model: 'deepseek-1.0',
      prompt: 'Test DeepSeek completion request',
      max_tokens: 300,
      temperature: 0.7,
    };

    const result = await sendLLMRequest(requestParams, 'deepseek');

    // 验证结果是否与 mock 数据匹配
    expect(result).toEqual(mockData);
    expect(result.choices[0].text).toBe('This is a mock response from DeepSeek model for testing purposes.');
  });
});
