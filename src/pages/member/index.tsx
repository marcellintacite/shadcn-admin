import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addUser,
  fetchPaymentsWithUserDetails,
  getMembres,
  getUsers,
} from '@/data/axiosget'
import { Button } from '@/components/custom/button'
import { useState } from 'react'
import { AddMemberModal } from './components/add-user-modal'
import { UserSchemaType } from '@/types/zod'
import { toast } from '@/components/ui/use-toast'
import { IconPrinter } from '@tabler/icons-react'
import { Membre } from '@/types'

export type Payments = {
  nom: string
  zoneDeSanteId: string
  zoneDeSanteNom: string // Look up zone name from zoneMap
  forfaitActif: boolean
  hospitalisationsRestantes: number
  soinsAmbulatoiresRestants: number
  paiementAnnee: number
  paiementMontant: number
  paiementDate: string
  paiementCreatedAt: string
  paiementUpdatedAt: string
}

export default function Payments() {
  const { data, isLoading } = useQuery({
    queryKey: ['membres'],
    queryFn: getMembres,
  })
  console.log(data)
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)

  // @ts-ignore
  const handleSubmit = (data) => {
    console.log(data)
  }

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
              Gérer les membres de votre zone
            </p>
          </div>
          <Button onClick={() => setOpen(true)}>
            Ajouter <IconPrinter />
          </Button>

          <AddMemberModal
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
            {/* @ts-ignore */}
            <DataTable data={data as Membre[]} columns={columns} />
          </div>
        )}
      </Layout.Body>
    </Layout>
  )
}
