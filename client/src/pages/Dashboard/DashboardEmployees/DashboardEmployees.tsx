import { deleteEmployee, getEmployees } from '../../../api/api.ts'
import { useNavigate } from 'react-router-dom'
import { DashboardPageTemplate } from '../DashboardPageTemplate/DashboardPageTemplate.tsx'

export const DashboardEmployees = () => {
    const navigate = useNavigate()
    return (
        <DashboardPageTemplate
            pageTitle={'Сотрудники'}
            getItems={getEmployees}
            deleteItem={deleteEmployee}
            createItem={async () => navigate('edit')}
            tableColumns={[
                { name: 'Полное имя', key: 'fullName' },
                { name: 'Логин', key: 'login' },
                {
                    name: 'Должность',
                    key: 'role',
                    func: (param) =>
                        param == '0' ? 'Администратор' : 'Официант',
                },
                {
                    name: 'Картинка',
                    key: 'imageUrl',
                },
                {
                    name: 'Статус',
                    key: 'available',
                    func: (param) => (param ? 'На смене' : 'Не на смене'),
                },
            ]}
            onTableRowEdit={(row) => navigate(`edit/${row.id}`)}
        />
    )
}
