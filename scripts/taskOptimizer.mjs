// /scripts/taskOptimizer.mjs
// 该文件的功能是调用 /utils/llmRequestUtil.mjs 中的函数，使用 gpt-3.5 模型优化用户输入的任务，并将任务划分成子任务，返回 JSON 格式的结果。
// 在 Mock 和 Test 时，使用模拟的 API 请求，而不是实际请求。

import sendLLMRequest from '../utils/llmRequestUtil.mjs';
import { isProdNodeEnv } from '../utils/envInfo.mjs';

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
 * 调用 LLM API 来优化用户输入的任务并划分子任务
 * @param {string} userTask - 用户输入的任务
 * @returns {object} - 返回任务划分后的 JSON 格式的结果
 */
async function optimizeTask(userTask) {
  const isTestOrMock = !isProdNodeEnv();

  if (isTestOrMock) {
    // 使用模拟的 API 调用
    return mockOpenAIAPI(userTask);
  }

  // 调用 LLM 请求工具函数
  const requestParams = {
    model: 'gpt-3.5-turbo',
    prompt: `Optimize and break down the following task into subtasks: ${userTask}`,
    max_tokens: 300,
    temperature: 0.7,
  };

  try {
    const response = await sendLLMRequest(requestParams, 'openai');
    const completionText = response.choices[0].text.trim();

    // 返回任务划分后的 JSON 结果
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
  } catch (error) {
    console.error(`Error optimizing task: ${error.message}`);
    throw error;
  }
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
mockOptimizeTask();

export default optimizeTask;
