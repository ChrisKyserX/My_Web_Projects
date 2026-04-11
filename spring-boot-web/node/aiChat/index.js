const app = require('express').Router();
const OpenAI = require('openai');

// 初始化 OpenAI（支持其他 LLM）
const openai = new OpenAI({
  apiKey: process.env.BAILIAN_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

// 测试连接
async function testConnection() {
  try {
    const models = await openai.models.list();
    console.log("✅ 阿里百炼连接成功！");
    console.log(
      "📋 可用模型:",
      models.data
        .slice(0, 5)
        .map((m) => m.id)
        .join(", "),
    );
    return true;
  } catch (error) {
    console.error("❌ 连接失败:", error.message);
    console.log("💡 请检查:");
    console.log("   1. API Key 是否正确");
    console.log("   2. BASE_URL 是否设置正确");
    console.log("   3. 网络是否能访问阿里云");
    return false;
  }
}

testConnection()


// ========== 4. LLM 对话接口（支持 Function Calling）==========

app.post("/aiChat", async (req, res) => {
  try {
    // 校验API Key是否设置
    if(!process.env.BAILIAN_API_KEY){
      return res.status(500).json({
        success: false,
        message: "API Key 未设置",
      });
    }
    // 接收参数
    const { messages, model = "qwen3.6-plus", tools } = req.body;
    // 第一次调用 相当于第一次意图识别
    let response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      tools: tools,
      tool_choice: "auto", // 让 LLM 自动决定是否调用函数
      temperature: 0.7, // 控制输出的随机性/创造性 范围 0-2
      max_tokens: 300, // 控制输出的最大token长度   1 token ≈ 0.75 个英文单词 ≈ 0.5 个中文字符
      // top_p: 0.9,  // 核采样 范围 0-1 从概率总和 90% 的候选词中选 全部候选（默认） 一般只调 temperature 或 top_p 中的一个，不同时用
      // frequency_penalty: 0.5  // 频率惩罚 范围 -2 到 2  正值（0.5-2）：惩罚重复词，鼓励用新词 负值（-0.5到-2）：鼓励重复  默认 0：不惩罚
      // presence_penalty: 0.5  // 存在惩罚 范围 -2 到 2 鼓励讨论新话题
      // stop: [], // 停止序列 遇到指定字符串时停止输出
      stream: false, // 流失输出
    });
    res.json({
      success: true,
      choices: response.choices,
      message: response.choices[0].message.content,
      functionCalls: response.choices[0].message.tool_calls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


app.post("/aiChatSSE", async (req, res) => {
  try {
    // 校验API Key是否设置
    if(!process.env.BAILIAN_API_KEY){
      return res.status(500).json({
        success: false,
        message: "API Key 未设置",
      });
    }
    // 接收参数
    const { messages, model = "qwen3.6-plus", tools } = req.body;
    // 第一次调用 相当于第一次意图识别
    let stream = await openai.chat.completions.create({
      model: model,
      messages: messages,
      tools: tools,
      tool_choice: "auto", // 让 LLM 自动决定是否调用函数
      temperature: 0.7, // 控制输出的随机性/创造性 范围 0-2
      max_tokens: 300, // 控制输出的最大token长度   1 token ≈ 0.75 个英文单词 ≈ 0.5 个中文字符
      // top_p: 0.9,  // 核采样 范围 0-1 从概率总和 90% 的候选词中选 全部候选（默认） 一般只调 temperature 或 top_p 中的一个，不同时用
      // frequency_penalty: 0.5  // 频率惩罚 范围 -2 到 2  正值（0.5-2）：惩罚重复词，鼓励用新词 负值（-0.5到-2）：鼓励重复  默认 0：不惩罚
      // presence_penalty: 0.5  // 存在惩罚 范围 -2 到 2 鼓励讨论新话题
      // stop: [], // 停止序列 遇到指定字符串时停止输出
      stream: true, // 流失输出
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta
      if (content && (content.content || content.reasoning_content || content.tool_calls)) {
        res.write(`data: ${JSON.stringify(content)}\n\n`);
      }
    }
    
    res.write(`data: ${JSON.stringify({done:true})}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});




  // try {
  //   const { messages, model = "qwen3.6-plus" } = req.body;

  //   // 第一次调用：让 LLM 决定是否需要调用函数
  //   let response = await openai.chat.completions.create({
  //     model: model,
  //     messages: messages,
  //     tools: tools,
  //     tool_choice: "auto", // 让 LLM 自动决定是否调用函数
  //     temperature: 0.7,
  //   });

  //   const responseMessage = response.choices[0].message;
  //   const toolCalls = responseMessage.tool_calls;

  //   // 如果 LLM 决定调用函数
  //   if (toolCalls && toolCalls.length > 0) {
  //     console.log(`🤖 LLM 决定调用 ${toolCalls.length} 个函数`);

  //     // 执行所有函数调用
  //     const functionResults = [];
  //     for (const toolCall of toolCalls) {
  //       const result = await executeFunctionCall(toolCall.function);
  //       functionResults.push({
  //         tool_call_id: toolCall.id,
  //         role: "tool",
  //         content: JSON.stringify(result),
  //       });
  //     }

  //     // 第二次调用：将函数执行结果返回给 LLM
  //     const secondResponse = await openai.chat.completions.create({
  //       model: model,
  //       messages: [...messages, responseMessage, ...functionResults],
  //       tools: tools,
  //     });

  //     const finalMessage = secondResponse.choices[0].message.content;
  //     res.json({
  //       success: true,
  //       message: finalMessage,
  //       functionCalls: toolCalls.map((tc) => ({
  //         name: tc.function.name,
  //         arguments: tc.function.arguments,
  //       })),
  //       timestamp: new Date().toISOString(),
  //     });
  //   } else {
  //     // 不需要调用函数，直接返回
  //     res.json({
  //       success: true,
  //       message: responseMessage.content,
  //       functionCalls: [],
  //       timestamp: new Date().toISOString(),
  //     });
  //   }
  // } catch (error) {
  //   console.error("LLM 调用错误:", error);
  //   res.status(500).json({
  //     success: false,
  //     error: error.message,
  //   });
  // }




module.exports=app;