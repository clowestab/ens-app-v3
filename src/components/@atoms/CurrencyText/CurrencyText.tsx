import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type Props = {
  eth?: bigint
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: bigint
  currency: CurrencyDisplay
}

export const CurrencyText = ({ eth, bufferPercentage = 100n, currency = 'eth' }: Props) => {
  const { data: ethPrice, isLoading } = useEthPrice()

  if (isLoading || !eth || !ethPrice) return null

  if (currency === 'eth') {
    return <>{makeDisplay({ value: (eth * bufferPercentage) / 100n, symbol: 'eth' })}</>
  }
  return <>{makeDisplay({ value: (eth * ethPrice) / BigInt(1e8), symbol: currency })}</>
}
