// Everything an editor works on, in one hook: the sign and its updates, the card holders
// (built-in and this browser's own), the saved-signs archive and the sign's content, which the
// preview, both exporters and the appearance panel all read.

import { useMemo } from 'react'
import { useCardHolders } from './hooks/useCardHolders.js'
import { useSignState } from './hooks/useSignState.js'
import { useSignArchive } from './hooks/useSignArchive.js'
import { buildSignContent } from './sign/signContent.js'

/**
 * @param {object} [options]
 * @param {object} [options.productionArchive]  The host's own archive of signs, offered in the
 *   saved-signs navigator and browser (UNBCDoor's transcribed print files).
 * @param {object} [options.initialSignData]  Fields for the first sign (departmentSelection()).
 */
export const useDoorSign = ({ productionArchive = null, initialSignData = {} } = {}) => {
  const [signData, setSignData] = useSignState(initialSignData)
  const holders = useCardHolders()
  const archiveState = useSignArchive(signData, setSignData, { productionArchive })
  const signContent = useMemo(
    () => buildSignContent(signData, { cardHolders: holders.cardHolders }),
    [signData, holders.cardHolders]
  )
  const updateSignData = (updates) => setSignData(prev => ({ ...prev, ...updates }))
  return { signData, setSignData, updateSignData, signContent, archiveState, ...holders }
}
