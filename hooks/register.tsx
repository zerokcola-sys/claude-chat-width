import type { EngineInterface, RenderElement, RenderInput, Register } from 'claude-code'

// ── 기본 폭: 이 숫자만 바꾸면 기본값 변경 ───────────────────────────
const DEFAULT_PX = 720
// 앱은 폭을 "글자 칸(cell)" 단위로 받음 (1칸 ≈ 본문 글꼴의 "0" 한 글자 폭).
// 실제 폭이 목표보다 넓게 보이면 이 값을 키우고, 좁게 보이면 줄이면 됨.
const PX_PER_CELL = 8.5
const MIN_PX = 400
const MAX_PX = 2000
const KEY = 'maxWidthPx'

async function widthPx($: EngineInterface): Promise<number> {
  const saved = await $.store.get(KEY)
  return typeof saved === 'number' && saved >= 0 ? saved : DEFAULT_PX
}

type Row = 'AssistantMessage' | 'UserMessage' | 'ToolUse'

// 메시지 한 줄(row)을 폭 제한 + 가운데 정렬 박스로 감쌈 (데스크톱/웹 앱만)
async function frame(
  $: EngineInterface,
  e: RenderInput<Row, 'desktop'>,
  row: RenderElement,
): Promise<RenderElement> {
  const px = await widthPx($) // store 구독 → /chat-width 변경 즉시 재렌더
  if (px === 0) return row

  // 앱 원래의 메시지 행은 width를 직접 못 받으므로,
  // 남는 폭을 좌우 여백(padding)으로 나눠 가운데 정렬
  const room = e.viewport?.columns
  if (room === undefined) return row
  const cells = Math.round(px / PX_PER_CELL)
  const side = Math.max(0, Math.floor((room - cells) / 2))
  if (side === 0) return row

  const { Box } = $.ui.resolve(e)
  return (
    <Box flexDirection="column" paddingLeft={side} paddingRight={side}>
      {row}
    </Box>
  )
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'chat-width',
      description: '채팅 최대 폭(px): /chat-width 800 · reset · off',
    })
    return next(e)
  })

  on('command.run', { command: 'chat-width' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase().replace(/px$/, '')

    if (arg === '') {
      const px = await widthPx($)
      return { text: px === 0 ? '채팅 폭 제한: 꺼짐' : `현재 채팅 최대 폭: ${px}px (기본 ${DEFAULT_PX}px)` }
    }
    if (arg === 'reset') {
      await $.store.set(KEY, DEFAULT_PX)
      return { text: `채팅 최대 폭 → 기본값 ${DEFAULT_PX}px` }
    }
    if (arg === 'off') {
      await $.store.set(KEY, 0)
      return { text: '채팅 폭 제한 해제 (앱 기본 폭)' }
    }

    const px = Math.round(Number(arg))
    if (!Number.isFinite(px) || px < MIN_PX || px > MAX_PX) {
      return { text: `${MIN_PX}~${MAX_PX} 사이 숫자 필요. 예: /chat-width 800` }
    }
    await $.store.set(KEY, px)
    return { text: `채팅 최대 폭 → ${px}px` }
  })

  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) =>
    e.surface === 'desktop' ? frame($, e, await next(e)) : next(e),
  )
  on('ui.render', { component: 'UserMessage' }, async ($, e, next) =>
    e.surface === 'desktop' ? frame($, e, await next(e)) : next(e),
  )
  on('ui.render', { component: 'ToolUse' }, async ($, e, next) =>
    e.surface === 'desktop' ? frame($, e, await next(e)) : next(e),
  )
}
