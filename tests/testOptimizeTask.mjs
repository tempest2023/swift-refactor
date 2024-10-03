// /tests/testOptimizeTask.js
// 该文件的功能是测试 taskOptimizer.js 中的 optimizeTask 函数，通过模拟 API 请求，验证任务是否被正确优化和划分子任务。

import optimizeTask from '../scripts/taskOptimizer.mjs';

/**
 * 测试函数，验证任务优化和子任务划分是否正确
 */
async function testOptimizeTask() {
  const userTask = '使用Swift重构代码'; // 模拟用户输入的任务

  // 设置环境为测试模式，确保使用 Mock API
  process.env.NODE_ENV = 'test';

  const result = await optimizeTask(userTask);

  // 验证结果是否包含优化的任务和子任务
  if (result && result.optimizedPrompt && result.subtasks && result.subtasks.length > 0) {
    console.log('[✅] 任务优化和划分测试通过');
  } else {
    console.error('[❌] 任务优化和划分测试失败');
  }
}

// 运行测试
testOptimizeTask();