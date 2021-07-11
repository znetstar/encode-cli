import {expect, test} from '@oclif/test'

describe('deserializeObject', () => {
  test
  .stdout()
  .command(['deserializeObject'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['deserializeObject', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
