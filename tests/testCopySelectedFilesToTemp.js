// /tests/testCopySelectedFilesToTemp.js
// 该文件的功能是测试 copySelectedFilesToTemp.js 文件中的功能函数，验证文件是否正确复制到临时文件夹中，并清理测试环境。

const fs = require('fs');
const path = require('path');
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
 * 测试函数，验证 copySelectedFilesToTemp 是否正确执行
 */
function testCopySelectedFilesToTemp() {
  const testFolderPath = './mocks/testCopyFilesToTemp'; // 测试文件夹路径

  // 创建测试环境
  createTestEnvironment(testFolderPath);

  const fileList = [
    path.join(testFolderPath, 'test1.txt'),
    path.join(testFolderPath, 'subfolder/test2.js')
  ];

  // 调用功能函数
  const tempFolderPath = copySelectedFilesToTemp(fileList);

  // 验证文件是否复制成功
  const result = fs.existsSync(tempFolderPath) && fs.existsSync(path.join(tempFolderPath, 'test1.txt')) && fs.existsSync(path.join(tempFolderPath, 'subfolder/test2.js'));

  if (result) {
    console.log('[✅] copySelectedFilesToTemp 功能测试通过');
  } else {
    console.log('[❌] copySelectedFilesToTemp 功能测试失败');
  }

  // 清理测试环境
  cleanTestEnvironment(tempFolderPath);
  cleanTestEnvironment(testFolderPath);
}

// 运行测试
testCopySelectedFilesToTemp();
