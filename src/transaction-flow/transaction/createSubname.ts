import type { TFunction } from 'react-i18next'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { createSubname } from '@ensdomains/ensjs/wallet'

type Data = {
  parent: string
  label: string
  contract: 'nameWrapper' | 'registry'
}

const displayItems = (
  { parent, label }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: parent,
    type: 'name',
  },
  {
    label: 'action',
    value: t(`transaction.description.createSubname`),
  },
  {
    label: 'subname',
    value: `${label}.${parent}`,
    type: 'name',
  },
]

const transaction = async ({ walletClient, data }: TransactionFunctionParameters<Data>) =>
  createSubname.makeFunctionData(walletClient, {
    name: `${data.label}.${data.parent}`,
    owner: walletClient.account.address,
    contract: data.contract,
  })

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
