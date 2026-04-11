// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const os = require('os');
const bodyParser = require('body-parser')

// 前端给
// // llm工具包
// const tools = require('./Tools/index.js');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// 允许所有跨域请求
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// 引入自写模块 start
const jsList = [
  './aiChat/index.js',
]
for (let i = 0; i < jsList.length; i++){
  app.use(require(jsList[i]))
}


// 启动服务器
app.listen(PORT, async () => {
  console.log(`✅ 服务器运行在: http://localhost:${PORT}`);
  console.log(`📋 可用接口:`);
  // 测试连接
  // await testConnection();
  console.log(`   POST /api/chat - LLM 对话（支持 Function Calling）`);
  //   console.log(`   GET  /api/test-env - 测试环境变量`)
  //   console.log(`\n🎯 示例问题:`)
  //   console.log(`   - "我的用户名是什么？"`)
  //   console.log(`   - "告诉我系统信息"`)
  //   console.log(`   - "当前环境变量PATH是什么？"`)
  //   console.log(`   - "我的电脑有多少内存？"`)
});
