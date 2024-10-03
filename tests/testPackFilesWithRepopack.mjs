// /tests/testPackFilesWithRepopack.mjs
// 该文件的功能是通过 copySelectedFilesToTemp 将文件复制到临时文件夹，然后再使用 packFilesWithRepopack 打包，并验证输出结果。

import fs from 'fs';
import path from 'path';
import packFilesWithRepopack from '../scripts/packFilesWithRepopack.mjs';
import copySelectedFilesToTemp from '../scripts/copySelectedFilesToTemp.mjs';

/**
 * 创建测试文件夹并生成一些测试文件
 * @param {string} folderPath - 测试文件夹路径
 */
function createTestEnvironment(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // 创建一些测试文件
  const files = ['packfileWithRepopack_test1.txt', 'packfileWithRepopack_subfolder/packfileWithRepopack_test2.js'];
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, `Test balabala, balabala, \n balabala \n balabala`);
  });
}

/**
 * 清理测试环境，删除临时文件夹及其内容
 * @param {string} folderPath - 测试文件夹路径
 */
function cleanTestEnvironment(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        cleanTestEnvironment(filePath); // 递归删除子文件夹
      } else {
        fs.unlinkSync(filePath); // 删除文件
      }
    });
    fs.rmdirSync(folderPath); // 删除文件夹
  }
}

describe('packFilesWithRepopack', () => {
  const testFolderPath = './mocks/testPackFiles'; // 测试文件夹路径
  let tempFolder = '';
  let outputFilePath = '';

  beforeAll(() => {
    // 创建测试环境
    createTestEnvironment(testFolderPath);

    // 使用 copySelectedFilesToTemp 模拟将文件复制到临时文件夹
    tempFolder = copySelectedFilesToTemp([path.join(testFolderPath, 'packfileWithRepopack_test1.txt'), path.join(testFolderPath, 'packfileWithRepopack_subfolder/packfileWithRepopack_test2.js')]);

    // 调用功能函数打包临时文件夹
    outputFilePath = packFilesWithRepopack(tempFolder);
  });

  afterAll(() => {
    // 清理输出文件
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }

    // 清理 log 文件
    const logFilePath = outputFilePath.replace('-repopack.xml', '-log.log');
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
    }

    // 清理 config file
    const configFilePath = "./results/repopack.config.json";
    if (fs.existsSync(configFilePath)) {
      fs.unlinkSync(configFilePath);
    }
  
    // 清理测试文件夹
    cleanTestEnvironment(tempFolder);
    cleanTestEnvironment(testFolderPath);
  });

  test('should pack files and output to result folder', () => {
    // 验证打包结果文件是否存在
    const result = fs.existsSync(outputFilePath);
    expect(result).toBe(true);
  });
});
