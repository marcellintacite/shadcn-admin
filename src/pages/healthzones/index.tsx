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
import { getZonesDeSante } from '@/data/axiosget'
import { AddZoneDeSanteModal } from './add-zone'
import { ZoneDeSanteSchemaType } from '@/types/zod'
import { ZoneDeSante } from '@/types'
import axiosInstance from '@/data/axios'
import { toast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'

export default function Healthzone() {
  const queryClient = useQueryClient()
  const [sort, setSort] = useState('ascending')
  const [appType, setAppType] = useState('all')
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigation = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['zones'],
    queryFn: getZonesDeSante,
  })

  if (isLoading) {
    return <p>Chargement ...</p>
  }

  const filteredApps =
    !isLoading &&
    data &&
    data
      .sort((a, b) =>
        sort === 'ascending'
          ? a.nom.localeCompare(b.nom)
          : b.nom.localeCompare(a.nom)
      )
      .filter((app) =>
        appType === 'connected'
          ? app.responsable
          : appType === 'notConnected'
            ? !app.responsable
            : true
      )
      .filter((app) => app.nom.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSubmit = async (data: ZoneDeSanteSchemaType) => {
    console.log(data)
    // @ts-ignore
    const newdata: ZoneDeSante = {
      ...data,
      createdAt: new Date().toLocaleDateString(),
      // numeric id
      id: data.nom.length + Math.floor(Math.random() * 1000),
      updatedAt: new Date().toLocaleDateString(),
    }

    try {
      const res = await axiosInstance.post('/zonesDeSante', newdata)
      console.log(res)
      toast({
        title: 'Zone de santé ajoutée',
        description: 'La zone de santé a été créée avec succès',
      })
      queryClient.invalidateQueries({
        queryKey: ['zones'],
      })
    } catch (error) {}
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
              Zones de santé
            </h1>
            <p className='text-muted-foreground'>Gestion des zones de santé</p>
          </div>
          <Button onClick={() => setOpen(true)}>Ajouter une zone</Button>
          <AddZoneDeSanteModal
            onSubmit={handleSubmit}
            onClose={() => setOpen(false)}
            isOpen={open}
          />
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter zone...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredApps &&
            filteredApps.map((app) => (
              <li
                key={app.id}
                className='rounded-lg border p-4 hover:shadow-md'
              >
                <div className='mb-8 flex items-center justify-between'>
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='lucide lucide-hospital'
                    >
                      <path d='M12 6v4' />
                      <path d='M14 14h-4' />
                      <path d='M14 18h-4' />
                      <path d='M14 8h-4' />
                      <path d='M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2' />
                      <path d='M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18' />
                    </svg>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className={`${app.responsable ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                    onClick={() =>
                      navigation(`/dashboard/health-zone/${app.id}`)
                    }
                  >
                    Visiter
                  </Button>
                </div>
                <div>
                  <h2 className='mb-1 font-semibold'>{app.nom}</h2>
                  <p className='line-clamp-2 text-gray-500'>{app.createdAt}</p>
                </div>
              </li>
            ))}
        </ul>
      </Layout.Body>
    </Layout>
  )
}
