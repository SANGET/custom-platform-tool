const componentRef = {
  inputRef: (
    <input type="text"/>
  )
}

const render = (config) => {
  return (
    <div class="flex alignItems-center">
      <div>
        <div>
          <div>
            {{config.inputRef}}
          </div>
        </div>
      </div>
    </div>
  )
}

const domAST = {
  child: [
    {
      type: 'container',
      layout: {
        type: 'flex',
        alignItems: 'center'
      },
      body: [
        {
          type: 'container',
          body: [
            {

            }
          ]
        }
      ]
    }
  ]
}