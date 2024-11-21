import {
  EditorSelection,
  StateCommand,
  Transaction,
  Text,
} from '@codemirror/state'
import { KeyBinding } from '@codemirror/view'

const insertUnderlineMarker: StateCommand = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    console.log(range.from, range.to)

    const checkBefore = () => {
      let index = 1
      let step = 0

      while (state.sliceDoc(range.from - index, range.from - step) === '~') {
        index += 1
        step += 1
      }

      return step % 2 !== 0
    }

    const checkAfter = () => {
      let index = 1
      let step = 0

      while (state.sliceDoc(range.to + step, range.to + index) === '~') {
        index += 1
        step += 1
      }

      return step % 2 !== 0
    }

    const isHasBefore = checkBefore()
    const isHasAfter = checkAfter()

    const changes = []

    changes.push(
      isHasBefore
        ? {
            from: range.from - 1,
            to: range.from,
            insert: Text.of(['']),
          }
        : {
            from: range.from,
            insert: Text.of(['~']),
          },
    )

    changes.push(
      isHasAfter
        ? {
            from: range.to,
            to: range.to + 1,
            insert: Text.of(['']),
          }
        : {
            from: range.to,
            insert: Text.of(['~']),
          },
    )

    const extendBefore = isHasBefore ? -1 : 1
    const extendAfter = isHasAfter ? -1 : 1

    return {
      changes,
      range: EditorSelection.range(
        range.from + extendBefore,
        range.to + extendAfter,
      ),
    }
  })

  dispatch(
    state.update(changes, {
      scrollIntoView: true,
      annotations: Transaction.userEvent.of('input'),
    }),
  )

  return true
}

export const underlineKeymap: KeyBinding[] = [
  {
    key: 'Mod-Alt-u',
    run: insertUnderlineMarker,
  },
]
