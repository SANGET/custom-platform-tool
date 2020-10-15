import codeEngine from '@engine/lowCode'

describe('低代码引擎', () => {
  it('解析code', async () => {
    expect(codeEngine("A + B"))
  })
})
