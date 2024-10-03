// /scripts/listFilesByType.js
// 该文件的功能是根据输入的路径读取文件夹中的所有文件，并根据文件类型分类输出文件列表。
// 如果文件夹不存在，则会报错而不是创建文件夹。

import fs from 'fs';
import path from 'path';

/**
 * 根据输入的路径，列出文件夹中所有文件的类型，并返回按类型分类的文件列表
 * 如果文件夹不存在，不会创建文件夹，返回错误
 * @param {string} folderPath - 要分析的文件夹路径
 * @returns {object} - 按文件类型分类的文件列表
 */
function listFilesByType(folderPath) {
  // 如果文件夹不存在，抛出错误
  if (!fs.existsSync(folderPath)) {
    throw new Error(`文件夹 ${folderPath} 不存在.`);
  }

  const filesByType = {};

  // 读取文件夹内容
  const files = fs.readdirSync(folderPath);

  // 遍历每个文件或子文件夹
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      // 获取文件扩展名
      const ext = path.extname(file) || 'unknown';

      // 如果该扩展名尚未在结果中出现，初始化一个空数组
      if (!filesByType[ext]) {
        filesByType[ext] = [];
      }

      // 将文件路径加入该扩展名的数组
      filesByType[ext].push(file);
    }
  });

  return filesByType;
}

/**
 * Mock 函数，模拟函数调用及输出
 * 文件会被创建在 /mocks 目录下，无需清理
 */
function mockListFilesByType() {
  const mockFolderPath = './mocks/mockFolder'; // 模拟文件夹路径

  // 检查 /mocks 目录并创建 mock 文件夹
  if (!fs.existsSync('./mocks')) {
    fs.mkdirSync('./mocks', { recursive: true });
  }

  // 创建模拟文件夹和文件
  if (!fs.existsSync(mockFolderPath)) {
    fs.mkdirSync(mockFolderPath);
    fs.writeFileSync(`${mockFolderPath}/file1.txt`, 'This is a mock .txt file');
    fs.writeFileSync(`${mockFolderPath}/script1.js`, 'This is a mock .js file');
  }

  // 调用功能函数
  const result = listFilesByType(mockFolderPath);

  // 使用 console 输出 Mock Output
  console.log(result);
}

// 取消注释以运行 mock 函数
// mockListFilesByType();
// Mock Output:
/*
{
  ".txt": ["file1.txt"],
  ".js": ["script1.js"]
}
*/

export default listFilesByType;
