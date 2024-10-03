// /scripts/copySelectedFilesToTemp.js
// 该文件的功能是根据用户选取的文件列表，在 ./tmp/ 下创建一个临时文件夹，将这些文件复制到临时文件夹中，保持相对路径结构不变。
// 临时文件夹的名称由7位ID和当前系统时间（yyyy-mm-dd-hh-mm-ss）构成。

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * 复制用户选取的文件列表到临时文件夹，保持相对路径不变
 * @param {string[]} fileList - 用户选取的文件列表，文件的绝对路径
 * @returns {string} - 临时文件夹的路径
 */
function copySelectedFilesToTemp(fileList) {
  // 创建 ./tmp 目录，如果不存在则创建
  const tmpDir = './tmp';
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  // 生成唯一ID和当前时间作为临时文件夹名
  const id = crypto.randomBytes(4).toString('hex'); // 生成7位ID
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // 格式化时间
  const tempFolder = path.join(tmpDir, `${id}-${timestamp}`);
  
  // 创建临时文件夹
  fs.mkdirSync(tempFolder, { recursive: true });

  // 获取文件所在的根目录，即选取的所有文件的公共父级目录
  const commonDir = path.dirname(fileList[0]);

  // 遍历文件列表并将其复制到临时文件夹中，保持相对路径结构
  fileList.forEach((filePath) => {
    try {
      const relativePath = path.relative(commonDir, filePath); // 计算相对于共同根目录的相对路径
      const destinationPath = path.join(tempFolder, relativePath); // 生成目标路径
      const destinationDir = path.dirname(destinationPath); // 生成目标目录

      // 创建目标文件夹（如果不存在）
      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
      }

      // 复制文件到目标目录
      fs.copyFileSync(filePath, destinationPath);
    } catch (error) {
      console.error(`复制文件时出错: ${filePath} -> ${error.message}`);
    }
  });

  return tempFolder; // 返回临时文件夹路径
}

export default copySelectedFilesToTemp;