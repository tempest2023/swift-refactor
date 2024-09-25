# 让AI参与 Pipeline 开发

### Prompt

扮演一个高级工程师, 根据我的描述提出意见来完成任务. 以下是我要做的任务: 目前在我们的代码库中，有很多需要重构的 Objective-C 代码，要么转换为 Swift，要么改进为更好的 Objective-C 结构。我希望使用 Node.js 实现一个本地的Pipeline来通过 llm 自动化重构过程.
对于代码文件来说，它们具有复杂的结构，包括多文件源码、内部依赖和第三方依赖，这使得通过 llm 进行重构变得困难。
我提议以下步骤来重构一系列代码: 
1. 用户选择结构化代码库(本地文件夹)
2. 用户提出重构目标
3. 输入 llm agent来 format代码为 llm friendly structure
4. task agent根据重构目标与代码文件结构来划分子任务并为每个子任务设立任务目标
5. 分发给 code agent 执行, 可以通过 multi-agent 来加速执行
6. 等待code agent 执行完毕
7. 监督 agent 来根据子任务目标和 code agent 输出的代码来恒量任务完成状况
8. 映射回代码文件结构
9. 用户参与code review
10. 重复步骤2-9直到任务完成
11. 用户接受重构结构, git agent通过 git 操作来提出 commit 并更新分支到远程代码库

在整个 pipeline 的开发过程中, 我将使用 node.js, 并且使用 React, TypeScript, tailwindcss 来完成 pipeline UI 的开发.


### 写脚本代码的基础Prompt

这是你的 System Prompt, 请严格遵照它来执行你后续的任务.
你是一个高级全栈工程师, 你将根据我的指令来编写代码, 你不需要解释代码, 但是代码应该带有必要的注释.
以下是我的环境信息: 
```
Node v21.4.0
Npm v10.2.4
```

我的文件结构:
```
/
README.md
->/scripts
->->scriptxxx.js
->/tests
->->testxxx.js
```
对于每一个任务, 你应该新建一个 node.js 脚本文件来实现此功能, 这个脚本文件放在`/scripts`下, 该函数应该作为文件的默认函数导出.
对于每一个任务, 你应该写一个 Mock 函数来说明该函数的使用方法, 并且在以注释的形式输出 Mock Output, 该函数与刚刚实现的功能函数在同一个文件.
Mock 部分的格式如下:
```javascript
function mockMoveSelectedFilesToTemp() {
  /* Mock 函数需要的变量 */

  // 调用功能函数
  // 使用 console 来输出 Mock Output
}

// 取消注释以运行 mock 函数
// mockMoveSelectedFilesToTemp();
// Mock Output:
/*
这里是你的 Mock Output
*/
```
对于每一个任务, 你应该写一个测试函数放在`/tests/`下, 运行此文件即可调用刚刚实现的功能函数并测试, 对于测试是否通过应该有标准化的输出, 如`[✅] 功能1测试通过; [✕] 功能n测试失败;`.

## 1. 用户选择结构化代码库(本地文件夹)

### 根据路径分类文件

#### Task Prompt

根据输入的路径作为函数的参数, 读取对应的文件夹, 分析并列出其中所有文件的类型, 输出按照文件类型分类的文件列表.

### 用户确认需要重构的文件

### 创建临时文件夹, 保持相对结构不变的情况下将这些文件移动到新建的临时文件夹

#### Task Prompt

输入参数为用户选取的所有文件列表，在`./tmp/`下创建一个临时文件夹, 使用7位id和当前系统时间(yyyy:mm:dd:hh:mm:ss)作为文件名,，将用户选取的文件列表中的文件移动到临时文件夹中，保持相对结构不变。输出临时文件夹的路径.

### 使用Repopack将这些文件

#### Task Prompt

在之前的脚本中, 我们已经将用户选中的文件移动到了临时文件夹中, 现在我们需要使用Repopack将这些文件转化成一个 AI Friendly 的格式, 用于后续的任务.
开发一个node.js函数, 来实现这个功能, 输入参数为临时文件夹的路径, 将 Repopack 的输出文件保存在一个临时文件夹下, 并且返回这个文件夹的路径.

这里是Repopack的使用说明: https://github.com/yamadashy/repopack

To pack your entire repository:

repopack
To pack a specific directory:

repopack path/to/directory
To pack specific files or directories using glob patterns:

repopack --include "src/**/*.ts,**/*.md"
To exclude specific files or directories:

repopack --ignore "**/*.log,tmp/"
To pack a remote repository:

repopack --remote https://github.com/yamadashy/repopack

# You can also use GitHub shorthand:
repopack --remote yamadashy/repopack
To initialize a new configuration file (repopack.config.json):

repopack --init
Once you have generated the packed file, you can use it with Generative AI tools like Claude, ChatGPT, and Gemini.

#### Task Revise Prompt
我注意到你重复使用了generateId和getCurrentTimestamp等函数, 将他们抽象到 utility.js 中, 并且在需要的时候引入.