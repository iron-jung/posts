import { ExtendedRecordMap } from 'notion-types'
import {
  parsePageId,
  getCanonicalPageId as getCanonicalPageIdImpl,
  uuidToId,
  getBlockTitle
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return null
  }

  const block = recordMap.block[pageId]?.value

  const override = inversePageUrlOverrides[cleanPageId]

  if (override) {
    return override
  } else {
    if (block) {
      const title = normalizeTitle(getBlockTitle(block, recordMap))
      if (title) {
        return title
      }
      return uuidToId(pageId)
    } else {
      return getCanonicalPageIdImpl(pageId, recordMap, {
        uuid
      })
    }
  }
}

export const normalizeTitle = (title: string | null): string => {
  return (
    (title || '')
      .replace(/ /g, '-')
      // [한글주소지원] 대/소문자 영문/숫자가 아닌 경우 문자열 제거됨
      // .replace(/[^a-zA-Z0-9-]/g, '')
      .replace(/--/g, '-')
      .replace(/-$/, '')
      .replace(/^-/, '')
      .trim()
    // [한글주소지원] 소문자화 불필요
    // .toLowerCase()
  )
}
