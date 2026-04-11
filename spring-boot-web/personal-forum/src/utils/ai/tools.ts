
interface Properties {
  [key: string]: {
    type: String
    description: String
  }
}

interface Parameters {
  type: String
  properties?: Properties
  required?: String[]
}

interface Function {
  name: String
  description: String
  parameters?: Parameters
}

interface tool {
  type: String
  function: Function
}


export const tools: tool[] = [
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
  },
  {
    type: "function",
    function: {
      name: "get_time",
      description: "获取当前时间",
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
]