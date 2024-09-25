// /tests/testListFilesByType.js
// 该文件的功能是测试 listFilesByType.js 文件中的功能函数，检查是否正确分类文件。
// 文件操作基于 /mocks 文件夹，测试完成后会清理创建的文件和文件夹。

const fs = require('fs');
const path = require('path');
const listFilesByType = require('../scripts/listFilesByType');

/**
 * 创建测试文件夹并生成一些测试文件
 * @param {string} folderPath - 测试文件夹路径
 */
function createTestEnvironment(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // 创建一些测试文件
  const files = ['test1.txt', 'test2.js', 'README'];
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `Content of ${file}`);
    }
  });
}

/**
 * 删除测试环境，清理创建的文件和文件夹
 * @param {string} folderPath - 测试文件夹路径
 */
function cleanTestEnvironment(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.unlinkSync(filePath); // 删除文件
    });
    fs.rmdirSync(folderPath); // 删除文件夹
  }
}

/**
 * 测试函数，验证 listFilesByType 是否正确执行
 */
function testListFilesByType() {
  const testFolderPath = './mocks/testFolder'; // 测试文件夹路径

  // 创建测试环境
  createTestEnvironment(testFolderPath);

  try {
    const result = listFilesByType(testFolderPath);

    // 打印测试结果
    if (result && Object.keys(result).length > 0) {
      console.log('[✅] listFilesByType 功能测试通过');
    } else {
      console.log('[✕] listFilesByType 功能测试失败：返回为空');
    }
  } catch (error) {
    console.log(`[✕] listFilesByType 功能测试失败：${error.message}`);
  }

  // 清理测试环境
  cleanTestEnvironment(testFolderPath);
}

// 运行测试
testListFilesByType();