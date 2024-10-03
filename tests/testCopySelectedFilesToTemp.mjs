// /tests/testCopySelectedFilesToTemp.mjs
// 该文件的功能是测试 copySelectedFilesToTemp 函数，验证文件是否正确复制到临时文件夹。

import copySelectedFilesToTemp from '../scripts/copySelectedFilesToTemp.mjs';
import fs from 'fs';
import path from 'path';

describe('copySelectedFilesToTemp', () => {
  const testFolderPath = './mocks/testCopyFilesToTemp';
  let tempFolder = '';

  beforeAll(() => {
    // 创建测试环境
    if (!fs.existsSync(testFolderPath)) {
      fs.mkdirSync(testFolderPath, { recursive: true });
      fs.writeFileSync(path.join(testFolderPath, 'test1.txt'), 'File 1 content');
      fs.mkdirSync(path.join(testFolderPath, 'subfolder'), { recursive: true });
      fs.writeFileSync(path.join(testFolderPath, 'subfolder', 'test2.js'), '// File 2 content');
      fs.writeFileSync(path.join(testFolderPath, 'subfolder', 'test3.py'), '#File 3 content');
      fs.writeFileSync(path.join(testFolderPath, 'subfolder', 'test4.js'), '// File 4 content');
    }
  });

  afterAll(() => {
    // 清理临时文件夹和测试文件
    if (tempFolder && fs.existsSync(tempFolder)) {
      fs.rmSync(tempFolder, { recursive: true, force: true });
    }
    if (fs.existsSync(testFolderPath)) {
      fs.rmSync(testFolderPath, { recursive: true, force: true });
    }
  });

  test('should copy selected files to a temp directory', () => {
    const filesToCopy = [
      path.join(testFolderPath, 'test1.txt'),
      path.join(testFolderPath, 'subfolder', 'test2.js'),
    ];

    // 执行文件复制，并保存返回的临时文件夹路径
    tempFolder = copySelectedFilesToTemp(filesToCopy);

    // 验证临时文件夹是否存在
    expect(fs.existsSync(tempFolder)).toBe(true);
    expect(fs.existsSync(path.join(tempFolder, 'test1.txt'))).toBe(true);
    expect(fs.existsSync(path.join(tempFolder, 'subfolder', 'test2.js'))).toBe(true);

    // 确保其他未复制的文件不存在于临时文件夹
    expect(fs.existsSync(path.join(tempFolder, 'subfolder', 'test3.py'))).toBe(false);
    expect(fs.existsSync(path.join(tempFolder, 'subfolder', 'test4.js'))).toBe(false);
  });
});
