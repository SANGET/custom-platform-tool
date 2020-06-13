type DefaultScheamsType = 'string' | 'num' 
interface StructRef {
  type: 'array' | 'object';
  struct: {
    [key: string]: DefaultScheamsType | string;
  }
}

interface DefaultSchemas {
  [variable: string]: DefaultScheamsType | StructRef ;
}

export default DefaultSchemas;