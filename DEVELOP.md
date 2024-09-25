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

在整个 pipeline 的开发过程中, 我将使用 node.js, 并且使用 Vite, React, TypeScript, Tailwindcss 来完成 pipeline UI 的开发.


### 写脚本代码的基础Prompt

这是你的 System Prompt, 请严格遵照它来执行你后续的任务.
你是一个高级全栈工程师, 你将根据我的指令来编写代码, 你不需要解释代码, 但是代码应该带有必要的注释, 你的注释应该解释一段代码逻辑在做什么，以及为什么要这样做, 而不是为每一行代码都注释在做什么. 每个文件的顶部都应该带有这个文件的功能说明, 第一行是文件的绝对路径.
以下是我的环境信息: Node v21.4.0

我的项目文件结构:
```
README.md
├── scripts
    ├── scriptxxx.js
├── tests
    ├── testxxx.js
```
对于涉及文件操作的任务, 你需要参考当前文件结构. 你可以新建文件夹, 删除文件夹, 访问现有的文件夹. 如果一个文件或文件夹在操作时不存在, 你需要创建这个文件或文件夹防止出现错误.

对于每一个任务, 你应该新建一个 node.js 脚本文件来实现此功能, 这个脚本文件放在`/scripts`下, 该函数应该作为文件的默认函数导出. 在必要时使用 console 来输出 error 信息. 禁止使用 deprecated API.

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
对于每一个任务, 你应该写一个测试函数放在`/tests/`下, 运行此文件即可调用刚刚实现的功能函数并测试. 对于测试是否通过应该有标准化的结果输出, 如`[✅] xxx任务 测试通过; [❌] xxx 任务 测试失败;`, 过程中无需有太多输出. 测试中涉及到的新增/删除文件操作应该是基于 mock 文件的, 不会影响现有的文件, 并且在测试完成后需要清理.
Test 过程中创建的文件夹应该和当前任务相关, 比如 `listFile` 任务, Test 文件夹可以为`testlistFile`.

## 1. 用户选择结构化代码库(本地文件夹)

### 根据路径分类文件

#### Task Prompt

根据输入的路径作为函数的参数, 读取对应的文件夹, 分析并列出其中所有文件的类型, 输出按照文件类型分类的文件列表.

### 用户确认需要重构的文件

### 创建临时文件夹, 保持相对结构不变的情况下将这些文件移动到新建的临时文件夹

#### Task Prompt

输入参数为用户选取的所有文件列表，在`./tmp/`下创建一个临时文件夹, 使用7位id和当前系统时间(yyyy-mm-dd-hh-mm-ss)作为文件名,，将用户选取的文件列表中的文件复制到临时文件夹中，保持相对结构不变。输出临时文件夹的路径.

### 使用Repopack将这些文件

#### Task Prompt

在之前的脚本中, 我们已经将用户选中的文件移动到了临时文件夹中, 现在我们需要使用Repopack将这些文件转化成一个 AI Friendly 的structure, 用于后续的任务.
结合之前开发的函数, 并开发一个新的node.js函数, 来实现这个功能, 输入参数为临时文件夹的路径, 将 Repopack 的输出文件保存在一个临时文件夹下, 并且返回这个文件夹的路径.

这里是Repopack的使用说明: https://github.com/yamadashy/repopack

To pack your entire repository:

repopack
To pack a specific directory:

repopack path/to/directory
To pack specific files or directories using glob patterns:

repopack --include "src/**/*.ts,**/*.md"
To exclude specific files or directories:

repopack --ignore "**/*.log,tmp/"

以下是 repopack config 的文档说明, 请参照这个文档为每次使用 repopack 生成一个 config
# Configuration

Create a `repopack.config.json` file in your project root for custom configurations.
```bash
repopack --init
```

Here's an explanation of the configuration options:

| Option | Description | Default |
|--------|-------------|---------|
|`output.filePath`| The name of the output file | `"repopack-output.txt"` |
|`output.style`| The style of the output (`plain`, `xml`) |`"plain"`|
|`output.headerText`| Custom text to include in the file header |`null`|
|`output.instructionFilePath`| Path to a file containing detailed custom instructions |`null`|
|`output.removeComments`| Whether to remove comments from supported file types | `false` |
|`output.removeEmptyLines`| Whether to remove empty lines from the output | `false` |
|`output.showLineNumbers`| Whether to add line numbers to each line in the output |`false`|
|`output.topFilesLength`| Number of top files to display in the summary. If set to 0, no summary will be displayed |`5`|
|`include`| Patterns of files to include (using glob syntax) |`[]`|
|`ignore.useGitignore`| Whether to use patterns from the project's `.gitignore` file |`true`|
|`ignore.useDefaultPatterns`| Whether to use default ignore patterns |`true`|
|`ignore.customPatterns`| Additional patterns to ignore (using glob patterns) |`[]`|
|`security.enableSecurityCheck`| Whether to perform security checks on files |`true`|

Example configuration:

```json
{
  "output": {
    "filePath": "repopack-output.xml",
    "style": "xml",
    "headerText": "Custom header information for the packed file.",
    "removeComments": false,
    "removeEmptyLines": false,
    "showLineNumbers": false,
    "topFilesLength": 5
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": ["additional-folder", "**/*.log"]
  },
  "security": {
    "enableSecurityCheck": true
  }
}
```