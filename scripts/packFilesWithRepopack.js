// /scripts/packFilesWithRepopack.js
// 该文件的功能是动态生成一个 repopack.config.json 文件并调用 Repopack 工具对给定的临时文件夹进行打包，
// 将结果保存到一个文件中，并返回这个文件的路径。

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const copySelectedFilesToTemp = require('./copySelectedFilesToTemp');

/**
 * 动态生成 repopack.config.json 配置文件，用于优化代码重构
 * @param {string} configFolderPath - 存放配置文件的文件夹路径(相对路径)
 * @param {string} outputFilePath - 打包输出的文件绝对路径
 * @returns {string} - 返回配置文件的完整路径
 */
function generateRepopackConfig(configFolderPath, outputFilePath) {
  const config = {
    "output": {
      "filePath": outputFilePath, // 输出绝对路径, 防止生成在根目录下
      "style": "xml", // 输出为 xml 格式
      "headerText": "This file is generated for code refactor and optimization.", // 自定义文件头信息
      "removeComments": true, // 移除注释，减少干扰
      "removeEmptyLines": true, // 移除空行，使代码更紧凑
      "showLineNumbers": false, // 不显示行号
      "topFilesLength": 0 // 显示文件总结的文件数
    },
    "include": ["**/*"], // 包含所有文件
    "ignore": {
      "useGitignore": true, // 使用 .gitignore 中的规则
      "useDefaultPatterns": true, // 使用默认的忽略模式
      "customPatterns": [
        "**/*.log", 
        "tmp/", 
        "node_modules/", 
        "package-lock.json", 
        "yarn.lock",
        "Pods/",                // CocoaPods 依赖
        "Podfile.lock",          // CocoaPods 锁文件
        "*.xcworkspace",         // Xcode 工作区文件
        "*.xcuserdata",          // Xcode 用户数据
        "*.xcshareddata",        // Xcode 共享数据
        "*.xcodeproj/xcuserdata/", // Xcode 项目用户数据
        "DerivedData/",          // Xcode 派生数据
        "*.o",                   // 编译输出的目标文件
        "*.a",                   // 静态库
        "*.dSYM",                // 调试符号文件
        ".build/",               // Swift Package Manager 的构建目录
        "Carthage/",             // Carthage 依赖
        "*.log",                 // 日志文件
        ".DS_Store",             // macOS 系统自动生成的文件
        "test-reports/",         // 测试报告
        "*.plist",               // Info.plist 配置文件
        "fastlane/Report.xml",   // Fastlane 的报告文件
        "fastlane/report.xml",
        "fastlane/Preview.html"
      ] // 自定义忽略模式
    },
    "security": {
      "enableSecurityCheck": true // 启用安全检查
    }
  };

  // 确保配置文件夹存在
  if (!fs.existsSync(configFolderPath)) {
    fs.mkdirSync(configFolderPath, { recursive: true });
  }

  const configFilePath = path.join(configFolderPath, 'repopack.config.json');

  // 写入配置文件
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

  return configFilePath;
}

/**
 * 使用 Repopack 工具打包临时文件夹，将结果保存在一个文件中。
 * @param {string} sourceFolderPath - 要打包的临时文件夹路径
 * @returns {string} - 保存打包结果的文件路径
 */
function packFilesWithRepopack(sourceFolderPath) {
  // 确保源文件夹存在
  if (!fs.existsSync(sourceFolderPath)) {
    throw new Error(`源文件夹 ${sourceFolderPath} 不存在`);
  }

  // 创建 ./result 目录（如果不存在）
  const resultDir = './results';
  if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir);
  }

  // 生成唯一ID和当前时间作为输出文件名
  const id = crypto.randomBytes(4).toString('hex');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outputFile = path.resolve(resultDir, `${id}-${timestamp}-repopack.xml`);

  // 生成 Repopack 配置文件
  const configFilePath = generateRepopackConfig(resultDir, outputFile);

  // 使用 child_process.execSync 调用 repopack 对源文件夹进行打包，不需要 --output 参数
  try {
    const command = `npx repopack ${sourceFolderPath} --config ${configFilePath}`;
    console.log(`[🚀]运行命令: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`运行 Repopack 失败: ${error.message}`);
    throw error;
  }

  return outputFile; // 返回保存打包结果的文件路径
}

/**
 * Mock 函数，模拟先复制文件到临时文件夹，然后再使用 Repopack 打包
 */
function mockPackFilesWithRepopack() {
  const mockFolderPath = './mocks/mockPackFiles'; // 模拟文件夹路径

  // 创建模拟文件
  if (!fs.existsSync(mockFolderPath)) {
    fs.mkdirSync(mockFolderPath, { recursive: true });
    fs.writeFileSync(`${mockFolderPath}/file1.txt`, 'This is a mock .txt file');
    fs.mkdirSync(`${mockFolderPath}/subfolder`);
    fs.writeFileSync(`${mockFolderPath}/subfolder/file2.js`, 'This is a mock .js file');
  }

  // 使用 copySelectedFilesToTemp 模拟将文件复制到临时文件夹
  const tempFolder = copySelectedFilesToTemp([path.join(mockFolderPath, 'file1.txt'), path.join(mockFolderPath, 'subfolder/file2.js')]);

  // 调用功能函数打包临时文件夹
  const outputFilePath = packFilesWithRepopack(tempFolder);

  // 输出打包结果文件路径
  console.log(`Repopack 输出文件路径: ${outputFilePath}`);
}

// 取消注释以运行 mock 函数
// mockPackFilesWithRepopack();
// Mock Output:
/*
创建输出临时文件: ./tmp/7f12eac-2024-09-25-12-30-45-repopack.txt
运行命令: npx repopack ./tmp/7f12eac-2024-09-25-12-30-45 --config ./tmp/repopack.config.json --output ./tmp/7f12eac-2024-09-25-12-30-45-repopack.txt
Repopack 输出文件路径: ./tmp/7f12eac-2024-09-25-12-30-45-repopack.txt
*/

module.exports = packFilesWithRepopack;
