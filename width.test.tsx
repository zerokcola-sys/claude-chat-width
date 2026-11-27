import { expect, test } from 'claude-code/testing'

const ROW = { plugin: 'chat-width', component: 'AssistantMessage' } as const
const props = { text: '안녕', isFirstOfReply: true }
const viewport = { columns: 160, rows: 50 }

test('desktop rows get side padding (centered ~720px column)', async ($, on) => {
  on('store.get', () => ({ value: undefined }))
  const ui = await $.ui.mount({ ...ROW, surface: 'desktop', props, viewport })
  const box = JSON.stringify(await ui.find({ type: 'Box' }))
  expect(box).toContain('"paddingLeft":37') // (160 - round(720/8.5)) / 2
  await ui.unmount()
})

test('terminal rows are untouched', async $ => {
  const ui = await $.ui.mount({ ...ROW, surface: 'terminal', props, viewport })
  expect(JSON.stringify((await ui.find({ type: 'Box' })) ?? null)).not.toContain('paddingLeft')
  await ui.unmount()
})
