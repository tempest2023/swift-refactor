// /scripts/taskOptimizer.js
// 该文件的功能是调用 OpenAI API 使用 gpt-3.5 模型优化用户输入的任务，并将任务划分成子任务，返回 JSON 格式的结果。
// 在 Mock 和 Test 时，使用模拟的 API 请求，而不是实际请求。

import { axios } from 'axios';

/**
 * 模拟 OpenAI API 调用，在测试和 Mock 环境下使用。
 * @param {string} userTask - 用户输入的任务
 * @returns {object} - 模拟返回的子任务 JSON
 */
function mockOpenAIAPI(userTask) {
  return {
    originalTask: userTask,
    optimizedPrompt: `Optimized: ${userTask}`,
    subtasks: [
      { id: 1, task: `Analyze the current ${userTask}` },
      { id: 2, task: `Identify areas for refactoring in ${userTask}` },
      { id: 3, task: `Refactor the identified areas using best practices` },
      { id: 4, task: `Test and validate the refactored ${userTask}` }
    ]
  };
}

/**
 * 实际调用 OpenAI API 来优化用户输入的任务并划分子任务
 * @param {string} userTask - 用户输入的任务
 * @returns {object} - 返回任务划分后的 JSON 格式的结果
 */
async function optimizeTask(userTask) {
  const isTestOrMock = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'mock';

  if (isTestOrMock) {
    // 使用模拟的 API 调用
    return mockOpenAIAPI(userTask);
  }

  // 实际 OpenAI API 调用部分（如果非 Mock 或 Test 环境）
  const apiKey = process.env.OPENAI_API_KEY; // 从环境变量中获取 API 密钥
  if (!apiKey) {
    throw new Error('OpenAI API Key is missing. Please set the OPENAI_API_KEY environment variable.');
  }

  const prompt = `Optimize and break down the following task into subtasks: ${userTask}`;

  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'gpt-3.5-turbo',
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const completionText = response.data.choices[0].text.trim();

  // 假设 GPT 的响应会输出优化后的任务和子任务列表
  return {
    originalTask: userTask,
    optimizedPrompt: completionText,
    subtasks: [
      { id: 1, task: `Step 1: ${completionText}` },
      { id: 2, task: `Step 2: Review and refine ${completionText}` },
      { id: 3, task: `Step 3: Implement ${completionText}` },
      { id: 4, task: `Step 4: Test and validate changes` }
    ]
  };
}

/**
 * Mock 函数，模拟任务优化及划分子任务的过程
 */
function mockOptimizeTask() {
  const userTask = '使用Swift重构代码'; // 模拟的用户任务

  const result = optimizeTask(userTask);

  console.log('Mock Output:', result);
}

// 取消注释以运行 mock 函数
// mockOptimizeTask();

export default optimizeTask;
