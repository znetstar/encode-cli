import {expect, test} from '@oclif/test'

describe('serializeObject', () => {
  test
  .stdout()
  .command(['serializeObject'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['serializeObject', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
