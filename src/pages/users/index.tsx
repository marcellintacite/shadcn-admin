import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { addUser, getUsers } from '@/data/axiosget'
import { Button } from '@/components/custom/button'
import { useState } from 'react'
import { AddUserModal } from './components/add-user-modal'
import { UserSchemaType } from '@/types/zod'
import { toast } from '@/components/ui/use-toast'
import { Utilisateur } from '@/types'

export default function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
  const queryClient = useQueryClient()
  const handleSubmit = async (data: UserSchemaType) => {
    try {
      addUser(data)
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
      toast({
        title: 'Utilisateur ajouté',
        description: `L'utilisateur ${data.nom} a été ajouté avec succès`,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description:
          "Une erreur s'est produite lors de l'ajout de l'utilisateur",
      })
    }
  }

  const [open, setOpen] = useState(false)

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Bienvenue encorre une fois
            </h2>
            <p className='text-muted-foreground'>
              Gérer les utilisateurs de votre application
            </p>
          </div>
          <Button onClick={() => setOpen(true)}>Ajouter un utilisateur</Button>
          <AddUserModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
          />
        </div>

        {isLoading ? (
          <div>
            <p>Chargement en cours...</p>
          </div>
        ) : (
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <DataTable data={data as Utilisateur[]} columns={columns} />
          </div>
        )}
      </Layout.Body>
    </Layout>
  )
}
