// /tests/testListFilesByType.mjs
// 该文件的功能是测试 listFilesByType 函数，验证文件是否按类型正确分类。

import listFilesByType from '../scripts/listFilesByType.mjs';
import fs from 'fs';
import path from 'path';

describe('listFilesByType', () => {
  const testFolderPath = './mocks/testListFilesByType';

  beforeAll(() => {
    // 创建测试环境
    if (!fs.existsSync(testFolderPath)) {
      fs.mkdirSync(testFolderPath, { recursive: true });
      fs.writeFileSync(path.join(testFolderPath, 'test1.txt'), 'File 1 content');
      fs.writeFileSync(path.join(testFolderPath, 'test2.js'), 'File 2 content');
      fs.writeFileSync(path.join(testFolderPath, 'README'), 'File 3 content');
    }
  });

  afterAll(() => {
    // 清理测试环境
    fs.rmSync(testFolderPath, { recursive: true, force: true });
  });

  test('should list files by their type', () => {
    const result = listFilesByType(testFolderPath);
    expect(result['.txt']).toContain('test1.txt');
    expect(result['.js']).toContain('test2.js');
    expect(result['unknown']).toContain('README');
  });
});
