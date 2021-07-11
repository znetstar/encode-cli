import {expect, test} from '@oclif/test'

describe('resizeimage', () => {
  test
  .stdout()
  .command(['resizeimage'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['resizeimage', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
