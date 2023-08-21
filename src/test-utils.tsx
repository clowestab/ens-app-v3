/* eslint-disable import/no-extraneous-dependencies */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RenderOptions, render } from '@testing-library/react'
import { RenderHookOptions, renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import { MockConnector } from '@wagmi/core/connectors/mock'
import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { WagmiConfig, createConfig } from 'wagmi'

import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'

import { DeepPartial } from './types'

window.scroll = jest.fn()

jest.mock('@app/hooks/useRegistrationReducer', () => jest.fn(() => ({ item: { stepIndex: 0 } })))
jest.mock('@app/hooks/useChainId', () => ({ useChainId: () => 1 }))

export const mockUseAccountReturnValue = { address: '0x123' }

jest.mock('wagmi', () => {
  const {
    useQuery,
    useQueryClient,
    useInfiniteQuery,
    useMutation,
    createConfig: _createConfig,
    WagmiConfig: _WagmiConfig,
  } = jest.requireActual('wagmi')

  return {
    useQuery,
    useQueryClient,
    useInfiniteQuery,
    useMutation,
    createConfig: _createConfig,
    WagmiConfig: _WagmiConfig,
    useAccount: jest.fn(() => mockUseAccountReturnValue),
    useBalance: jest.fn(() => ({ data: { value: { lt: () => false } } })),
    useNetwork: jest.fn(() => ({ chainId: 1 })),
    useFeeData: jest.fn(),
    useProvider: jest.fn(() => ({
      providerConfigs: [{ provider: { send: jest.fn(() => ({ gasUsed: 0, accessList: [] })) } }],
    })),
    useSigner: jest.fn(),
    useSignTypedData: jest.fn(),
    useBlockNumber: jest.fn(),
    useSendTransaction: jest.fn(),
    configureChains: jest.fn(() => ({})),
  }
})

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string, opts: any) => {
      const optsTxt = opts?.value || opts?.count || ''
      return [value, ...(optsTxt ? [optsTxt] : [])].join('.')
    },
    i18n: {
      isInitialized: true,
    },
  }),
  Trans: ({ i18nKey, values }: { i18nKey: string; values: string[] }) =>
    `${i18nKey} ${values ? Object.values(values).join(', ') : ''}`,
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
})

beforeEach(() => queryClient.clear())

const privateKeyAccount = privateKeyToAccount(
  // eslint-disable-next-line no-restricted-syntax
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)
const publicClient = createPublicClient({ transport: http('http://mock.local'), chain: mainnet })

const wagmiConfig = createConfig({
  connectors: [
    new MockConnector({
      options: {
        walletClient: createWalletClient({
          account: privateKeyAccount,
          transport: http('http://mock.local'),
        }),
      },
    }) as any,
  ],
  publicClient: () => publicClient,
})

jest.mock('@app/utils/query', () => ({
  wagmiConfigWithRefetch: wagmiConfig,
}))

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          {children}
        </ThemeProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>,
) => renderHook(callback, { wrapper: AllTheProviders as any, ...options })

export type PartialMockedFunction<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => DeepPartial<ReturnType<T>>

export const mockFunction = <T extends (...args: any) => any>(func: T) =>
  func as unknown as jest.MockedFunction<PartialMockedFunction<T>>

export * from '@testing-library/react'
export { customRender as render, customRenderHook as renderHook, userEvent }
