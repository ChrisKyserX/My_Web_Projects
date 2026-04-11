
interface Properties {
  [key: string]: {
    type: String
    description: String
  }
}

interface Parameters {
  type: String
  properties: Properties
  required: String[]
}

interface Function {
  name: String
  description: String
  parameters: Parameters
}

export interface tool {
  type: String
  function: Function
}
