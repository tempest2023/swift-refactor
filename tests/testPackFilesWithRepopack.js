// /tests/testPackFilesWithRepopack.js
// 该文件的功能是先通过 copySelectedFilesToTemp 将文件复制到临时文件夹，然后再使用 packFilesWithRepopack 打包，并验证输出结果。

const fs = require('fs');
const path = require('path');
const packFilesWithRepopack = require('../scripts/packFilesWithRepopack');
const copySelectedFilesToTemp = require('../scripts/copySelectedFilesToTemp');

/**
 * 创建测试文件夹并生成一些测试文件
 * @param {string} folderPath - 测试文件夹路径
 */
function createTestEnvironment(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // 创建一些测试文件
  const files = ['test1.txt', 'subfolder/test2.js'];
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, `Content of ${file}`);
    console.log(`创建测试文件: ${filePath}`);
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

/**
 * 测试函数，验证 packFilesWithRepopack 是否正确执行
 */
function testPackFilesWithRepopack() {
  const testFolderPath = './mocks/testPackFiles'; // 测试文件夹路径

  // 创建测试环境
  createTestEnvironment(testFolderPath);

  // 使用 copySelectedFilesToTemp 模拟将文件复制到临时文件夹
  const tempFolder = copySelectedFilesToTemp([path.join(testFolderPath, 'test1.txt'), path.join(testFolderPath, 'subfolder/test2.js')]);

  // 调用功能函数打包临时文件夹
  const outputFilePath = packFilesWithRepopack(tempFolder);

  // 验证输出文件夹是否存在
  const result = fs.existsSync(outputFilePath);

  if (result) {
    console.log('[✅] packFilesWithRepopack 功能测试通过');
  } else {
    console.log('[❌] packFilesWithRepopack 功能测试失败');
  }

  // 清理测试环境
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }
  cleanTestEnvironment(tempFolder);
  cleanTestEnvironment(testFolderPath);
}

// 运行测试
testPackFilesWithRepopack();