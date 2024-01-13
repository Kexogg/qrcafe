import { useParams } from 'react-router-dom'
import {
    createEmployee,
    getEmployeeById,
    updateEmployee,
} from '../../../api/api.ts'

import { DashboardEditorTemplate } from '../DashboardEditorTemplate/DashboardEditorTemplate.tsx'

export const DashboardEmployeeEditor = () => {
    const params = useParams()
    return (
        <DashboardEditorTemplate
            createItem={createEmployee}
            updateItem={updateEmployee}
            pageTitle={'Редактор сотрудника'}
            getItem={getEmployeeById}
            properties={[
                {
                    name: 'Полное имя',
                    key: 'fullName',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'Логин',
                    key: 'login',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'Пароль',
                    key: 'password',
                    type: 'password',
                },
                {
                    name: 'Роль',
                    key: 'role',
                    type: 'dropdown',
                    required: true,
                    options: [
                        {
                            name: 'Официант',
                            value: '1',
                        },
                        {
                            name: 'Администратор',
                            value: '0',
                        },
                    ],
                },
                {
                    name: 'На смене',
                    key: 'available',
                    type: 'checkbox',
                },
                {
                    name: 'Картинка',
                    key: 'imageUrl',
                    type: 'image',
                },
            ]}
            id={params.id}
        />
    )
}
