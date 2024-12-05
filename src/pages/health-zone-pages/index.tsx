import { useState } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getOneZoneDeSante, getZonesDeSante } from '@/data/axiosget'

import { ZoneDeSanteSchemaType } from '@/types/zod'
import { ZoneDeSante } from '@/types'
import axiosInstance from '@/data/axios'
import { toast } from '@/components/ui/use-toast'
import { useNavigate, useParams } from 'react-router-dom'

export default function HealthzoneDetails() {
  const queryClient = useQueryClient()
  const [sort, setSort] = useState('ascending')
  const [appType, setAppType] = useState('all')
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['zones'],
    queryFn: () => getOneZoneDeSante(id as string),
  })

  if (isLoading) {
    return <p>Chargement ...</p>
  }

  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className='flex w-full items-center justify-between'>
          <Search />
          <div className='flex items-center space-x-4'>
            <ThemeSwitch />
            <UserNav />
          </div>
        </div>
      </Layout.Header>

      {/* ===== Content ===== */}
      <Layout.Body className='flex flex-col'>
        <div className='flex justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Titre - {data?.nom}
            </h1>
            <p className='text-muted-foreground'>
              Gestion de la zone {data?.nom}
            </p>
          </div>
        </div>

        <Separator className='mt-3 shadow' />
      </Layout.Body>
    </Layout>
  )
}
