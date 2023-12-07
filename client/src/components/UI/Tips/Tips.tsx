import { useEffect, useState } from 'react'

type TipsProps = {
    onTipChange: (tip: number) => void
}
export const Tips = ({ onTipChange }: TipsProps) => {
    const [customTip, setCustomTip] = useState('')
    const [selectedTip, setSelectedTip] = useState('')

    const handleCustomTipChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setCustomTip(event.target.value)
        setSelectedTip('')
    }

    const handleTipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTip(event.target.value)
        setCustomTip('')
    }
    useEffect(() => {
        if (selectedTip) {
            onTipChange(Number(selectedTip))
        } else if (customTip) {
            onTipChange(Number(customTip))
        } else {
            onTipChange(0)
        }
    }, [selectedTip, customTip, onTipChange])
    const defaultTips = [50, 100, 150]
    return (
        <>
            <h2>Хотите оставить чаевые?</h2>
            <form
                className={
                    'flex max-w-sm flex-col gap-3 rounded-3xl border-2 border-primary-700 p-5 text-primary-700'
                }>
                <div className={'flex justify-between gap-3'}>
                    {defaultTips.map((tip) => {
                        return (
                            <label
                                key={tip}
                                className={`cursor-pointer rounded-2xl border-[1px] border-primary-700 p-5 text-center shadow transition-colors ${
                                    selectedTip === tip.toString()
                                        ? 'bg-primary-700 text-primary-50 hover:bg-primary-800'
                                        : 'hover:bg-primary-50/50'
                                }`}>
                                <input
                                    className={'appearance-none'}
                                    type={'radio'}
                                    name={'tip'}
                                    value={tip}
                                    onChange={handleTipChange}
                                    checked={selectedTip === tip.toString()}
                                />
                                {tip}₽
                            </label>
                        )
                    })}
                </div>

                <input
                    className={
                        'no-ring w-full rounded-2xl border-[1px] border-primary-700 bg-transparent px-4 py-2 placeholder-primary-500 shadow transition-colors hover:bg-primary-50/50'
                    }
                    type="number"
                    name="customTip"
                    value={customTip}
                    placeholder={'Введите свою сумму...'}
                    onChange={handleCustomTipChange}
                />
                <label
                    className={`cursor-pointer rounded-2xl border-[1px] border-primary-700 px-4 py-2 text-center shadow transition-colors ${
                        selectedTip === '0'
                            ? 'bg-primary-700 text-primary-50 hover:bg-primary-800'
                            : 'hover:bg-primary-50/50'
                    }`}>
                    <input
                        className={'appearance-none'}
                        type={'radio'}
                        name={'tip'}
                        value={'0'}
                        onChange={handleTipChange}
                        checked={selectedTip === '0'}
                    />
                    Не оставлять{''}
                </label>
            </form>
        </>
    )
}
