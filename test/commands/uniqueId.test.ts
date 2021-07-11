import {expect, test} from '@oclif/test'

describe('uniqueId', () => {
  test
  .stdout()
  .command(['uniqueId'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['uniqueId', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
