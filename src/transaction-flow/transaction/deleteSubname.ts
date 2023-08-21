import type { TFunction } from 'react-i18next'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'
import { deleteSubname } from '@ensdomains/ensjs/wallet'

type Data = {
  name: string
  contract: 'nameWrapper' | 'registry'
  method?: 'setSubnodeOwner' | 'setRecord'
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'subname',
    value: name,
    type: 'subname',
  },
  {
    label: 'action',
    value: t(`transaction.description.deleteSubname`),
  },
  {
    label: 'info',
    value: [t('action.delete'), name],
    type: 'list',
  },
]

const transaction = async ({ walletClient, data }: TransactionFunctionParameters<Data>) =>
  deleteSubname.makeFunctionData(walletClient, {
    name: data.name,
    contract: data.contract,
    asOwner: data.method === 'setRecord',
  })

export default {
  displayItems,
  transaction,
} satisfies Transaction<Data>
