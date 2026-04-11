const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "获取指定城市的天气信息",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: 'string',
            description: '城市名称，例如：北京、上海'
          }
        },
        required: ['city']
      }
    }
  }
]


module.exports = tools