import { ArrowBackRounded } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

type PageTitleProps = {
    title: string
}

export const PageTitle = ({ title }: PageTitleProps) => {
    const navigate = useNavigate()
    return (
        <div className={'flex items-center gap-5 text-accent-800'}>
            <button onClick={() => navigate(-1)}>
                <ArrowBackRounded fontSize={'large'} />
            </button>
            <h1>{title}</h1>
        </div>
    )
}
