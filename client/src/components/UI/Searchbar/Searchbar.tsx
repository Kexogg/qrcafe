import { SearchRounded } from '@mui/icons-material'

type SearchbarProps = {
    setSearchTerm: (term: string) => void
}

export const Searchbar = ({ setSearchTerm }: SearchbarProps) => {
    return (
        <search className={'my-5'}>
            <form
                className={
                    'mx-5 flex h-8 w-auto   max-w-md items-center justify-between border-b-2 border-primary-700 px-3 text-primary-700'
                }>
                <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type={'text'}
                    placeholder={'Поиск'}
                    className={
                        'h-full w-full bg-transparent placeholder-primary-500 outline-none'
                    }
                />
                <SearchRounded />
            </form>
        </search>
    )
}
