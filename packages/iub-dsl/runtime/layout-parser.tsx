const domAST = {
  type: 'content',
  child: [
    {
      type: 'container',
      body: [
        {
          type: 'container',
          props: {
          },
          body: [
            {
              type: 'component',
              component: {
                type: 'Input'
              }
            },
            {
              type: 'component',
              component: {
                type: 'Input'
              }
            },
          ]
        }
      ]
    }
  ]
};

const res = (
  <div>
    <div class="flex">
      {{ Input }}
      {{ Input }}
    </div>
    <div class="flex">
      {{ Input }}
      {{ Input }}
    </div>
  </div>
);
