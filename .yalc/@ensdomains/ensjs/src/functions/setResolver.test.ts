import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { hexEncodeName } from '../utils/hexEncodedName'

let ENSInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider

beforeAll(async () => {
  ;({ ENSInstance, revert, provider } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('setResolver', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a transaction to the registry and set successfully', async () => {
    const tx = await ENSInstance.setResolver('test123.eth', {
      contract: 'registry',
      resolver: '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC',
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ENSInstance.contracts!.getUniversalResolver()!
    const [result] = await universalResolver.findResolver(
      hexEncodeName('test123.eth'),
    )
    expect(result).toBe('0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC')
  })
  it('should return a transaction to the namewrapper and set successfully', async () => {
    const tx = await ENSInstance.setResolver('wrapped.eth', {
      contract: 'nameWrapper',
      resolver: '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC',
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ENSInstance.contracts!.getUniversalResolver()!
    const [result] = await universalResolver.findResolver(
      hexEncodeName('wrapped.eth'),
    )
    expect(result).toBe('0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC')
  })
})
