import {
    ChangeEvent,
    KeyboardEvent,
    ClipboardEvent,
    useCallback,
    useMemo,
    useRef,
    MutableRefObject,
} from 'react'

type CodeInputProps = {
    length: number
    verifyCode: (code: string) => void
}

export const CodeInputForm = ({ length, verifyCode }: CodeInputProps) => {
    const modifierKeysPressed: MutableRefObject<string[]> = useRef([])
    const modifierKeys = useMemo(() => ['Control', 'Shift', 'Alt', 'Meta'], [])
    const allowedKeys = useMemo(
        () => [...modifierKeys, 'Enter', 'Tab'],
        [modifierKeys],
    )
    const getNextInput = useCallback(
        (input: HTMLInputElement, reverse: boolean) => {
            return document.getElementById(
                'code_input_' +
                    (parseInt(input.id.slice(-1)) + (reverse ? -1 : 1)),
            )
        },
        [],
    )

    const onInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const input = e.target
            if (input.value.length > 1) {
                input.value = input.value.slice(0, 1)
            }
            if (input.value.length === 1) {
                const nextInput = getNextInput(input, false)
                if (nextInput) {
                    nextInput.focus()
                }
            }
            //call function if all inputs are filled
            const inputs = document.getElementsByClassName('code_input')
            if (
                [...inputs].every(
                    (input) => (input as HTMLInputElement).value.length === 1,
                )
            ) {
                const code = [...inputs]
                    .map((input) => (input as HTMLInputElement).value)
                    .join('')
                verifyCode(code)
            }
        },
        [getNextInput, verifyCode],
    )
    const onInputKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (modifierKeys.includes(e.key)) {
                modifierKeysPressed.current = [
                    ...modifierKeysPressed.current,
                    e.key,
                ]
            }
            if (e.key === 'Backspace') {
                const input = e.target as HTMLInputElement
                if (input.value.length === 0) {
                    const prevInput = getNextInput(input, true)
                    if (prevInput) {
                        prevInput.focus()
                    }
                } else {
                    input.value = ''
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const input = e.target as HTMLInputElement
                const nextInput = getNextInput(input, e.key === 'ArrowLeft')
                if (nextInput) {
                    nextInput.focus()
                }
            } else if (e.key === 'Escape') {
                e.preventDefault()
                ;(e.target as HTMLInputElement).blur()
            } else if (
                isNaN(Number(e.key)) &&
                !allowedKeys.includes(e.key) &&
                modifierKeysPressed.current.length === 0
            ) {
                e.preventDefault()
            }
        },
        [allowedKeys, getNextInput, modifierKeys],
    )
    const onInputPaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        const boxes = document.getElementsByClassName('code_input')
        let i = 0
        for (const char of text) {
            if (i >= boxes.length) break
            ;(boxes[i] as HTMLInputElement).value = char
            i++
        }
    }, [])
    const onInputKeyUp = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (modifierKeys.includes(e.key)) {
                modifierKeysPressed.current =
                    modifierKeysPressed.current.filter((key) => key !== e.key)
            }
        },
        [modifierKeys],
    )

    return (
        <div className={'flex w-full gap-2 text-4xl sm:gap-3 sm:text-5xl'}>
            {[...Array(length)].map((_, i) => (
                <input
                    key={'bid' + i}
                    type={'number'}
                    id={'code_input_' + i}
                    required={true}
                    className={
                        'code_input no-ring aspect-[3/4] min-w-0 rounded-3xl border-2 border-primary-400 bg-transparent text-center placeholder-primary-400 transition-colors valid:bg-primary-500 focus:border-primary-200'
                    }
                    maxLength={1}
                    minLength={1}
                    max={9}
                    min={0}
                    placeholder={(i + 1).toString()}
                    onChange={onInputChange}
                    onPaste={onInputPaste}
                    onKeyDown={onInputKeyDown}
                    onKeyUp={onInputKeyUp}
                />
            ))}
        </div>
    )
}
