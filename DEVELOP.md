# 让AI参与 Pipeline 开发

### 代码重构任务的Prompt

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

在整个 pipeline 的开发过程中, 我将使用 ESM node.js, 并且使用 Vite, React, TypeScript, Tailwindcss 来完成 pipeline UI 的开发.


### 写脚本代码的基础Prompt

这是你的 System Prompt, 请严格遵照它来执行你后续的任务.
你是一个高级全栈工程师, 你将根据我的指令来编写代码, 你不需要解释代码, 但是代码应该带有必要的注释, 你的注释应该解释一段代码逻辑在做什么，以及为什么要这样做, 而不是为每一行代码都注释在做什么. 每个文件的顶部都应该带有这个文件的功能说明, 第一行是文件的绝对路径. 你的代码应该尽可能简洁, 将每一部分抽象出单独的函数, 来保证主函数的逻辑尽可能简单, 保证代码的可读性和可维护性.
以下是我的环境信息: Node v21.4.0

我的项目文件结构:
```
README.md
├── scripts
    ├── scriptxxx.mjs
├── tests
    ├── testxxx.mjs
```
对于涉及文件操作的任务, 你需要参考当前文件结构. 你可以新建文件夹, 删除文件夹, 访问现有的文件夹. 如果一个文件或文件夹在操作时不存在, 你需要创建这个文件或文件夹防止出现错误.

对于每一个任务, 你应该新建一个ESM node.js 脚本文件来实现此功能, 这个脚本文件放在`/scripts`下, 该函数应该作为文件的默认函数导出. 在必要时使用 console 来输出 error 信息. 禁止使用 deprecated API. 使用 ESM 语法, 在引入依赖时考虑依赖对 ESM 的支持.

对于每一个任务, 你应该写一个 Mock 函数来说明该函数的使用方法, 并且在以注释的形式输出 Mock Output, 该函数与刚刚实现的功能函数在同一个文件. Mock中涉及的文件操作应该放到`/mocks`下, 无需清理, Mock 过程中创建的文件夹应该和当前任务相关, 比如 `listFile` 任务, Mock 文件夹可以为`mocklistFile`.
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
对于每一个任务, 你应该写一个测试函数放在`/tests/`下, 测试函数使用 Jest 框架, 测试过程中不应该有额外输出. 测试中涉及到的新增/删除文件操作应该是基于 mock 文件的, 不会影响现有的文件, 并且在测试完成后需要清理.

Test 过程中创建的文件夹应该和当前任务相关, 比如 `listFile` 任务, Test 文件夹可以为`testlistFile`.

## 1. 用户选择结构化代码库(本地文件夹)

### 根据路径分类文件

#### Task Prompt

根据输入的路径作为函数的参数, 读取对应的文件夹, 分析并列出其中所有文件的类型, 输出按照文件类型分类的文件列表.

-------

### 用户确认需要重构的文件

### 创建临时文件夹, 保持相对结构不变的情况下将这些文件移动到新建的临时文件夹

#### Task Prompt

输入参数为用户选取的所有文件列表，在`./tmp/`下创建一个临时文件夹, 使用7位id和当前系统时间(yyyy-mm-dd-hh-mm-ss)作为文件名,，将用户选取的文件列表中的文件复制到临时文件夹中，保持相对结构不变。输出临时文件夹的路径.

-------

### 使用Repopack将这些文件打包

#### Task Prompt

在之前的脚本中, 我们已经将用户选中的文件移动到了临时文件夹中, 现在我们需要使用Repopack将这些文件转化成一个 AI Friendly 的structure, 用于后续的任务.
结合之前开发的函数, 并开发一个新的node.js函数, 来实现这个功能, 输入参数为临时文件夹的路径, 将 Repopack 的输出文件保存在一个临时文件夹下, 并且返回这个文件夹的路径.

这里是Repopack的使用说明: https://github.com/yamadashy/repopack
/* Copy README of Repopack */

-------

### 使用gpt优化prompt并分解任务

#### Task Prompt
创建一个function, 输入参数为字符串, 表示用户的任务指令, 一般是解释代码, 重构代码等, 调用OpenAI API, 来优化用户输入的指令为更好的prompt, 并且尽可能分解任务, 返回分解的任务和优化过的 prompt. gpt 的返回应该使用 json 格式.

-------

抽象一个方法到util里, 来使用 fetch 函数发起 gpt request, 接受参数 requestParams 来配置 model 等参数, 并且异步返回 response. 
API key 从 env 中读取. 这个方法应该保持可扩展性, 用于将来接入其他llm 服务商, 比如 claude, genmini, deepseek等.
同样的, 为这个方法创建Unit Test, 在测试环境中, 应该使用 mock 请求而不是真实的 model response. 将 mock 中使用到的model response单独存放在 /mocks 下.

#### Follow up

我注意到你使用了 node-fetch, 而 node-fetch@3.x 只支持esm, 所以我已经将之前生成的文件都改为了 .mjs, 在`package.json`中添加了`"type": "module"`, 并且将 require替换为 import 语法, 将 module.export 替换为 export defualt 语法. 接下来生成的 scripts, tests 都应该是 ESM 格式的.
你还使用到了Jest, 所以我通过 `npm install --save-dev jest` 安装了 jest, 并且配置了`package.json`中的 `scripts: { "test": "jest" }`, 新添加了jest.config.js文件, 配置内容为: 
```
module.exports = {
    testEnvironment: 'node',
    transform: {},
    testMatch: ['<rootDir>/tests/*.[jm]js'], // 匹配 /tests/ 下的 .js 和 .mjs 的测试文件
};
```

请帮我将之前的测试用例都更改成 jest 格式的, 你需要更改: `testCopySelectedFilesToTemp.mjs`, `testListFilesByType.mjs`, `testLLMRequestUtil.mjs`, `testOptimizeTask.mjs`, `testPackFilesWithRepopack.mjs`.

---------

重写 taskOptimizer 函数, 使用 `/utils/llmRequestUtil.mjs` 实现, 这里是原来的代码
/* Copy taskOptimizer.mjs 代码 */

---------

修改 llmRequestUtil 代码, 在 test 和 mock 模式不发送真实请求, 而是读取 mock 数据返回. 这里的 mock 数据放在`/persistent-mocks/`下, 应该包含各个 provider 的 response 数据. 这里是llmRequestUtil原来的代码:
/* llmRequestUtil 原来的代码 */

---------

给出几个 provider 的 mocks 文件

---------

根据修改后的llmRequestUtil.mjs, 重写生成对应的 test 文件

----------

阅读以下逻辑, 写一行代码, 将 outputFile 转换为 logFile
```
const logFile = path.resolve(resultDir, `${id}-${timestamp}-log.log`)
const outputFile = path.resolve(resultDir, `${id}-${timestamp}-repopack.xml`);
```