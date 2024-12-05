'use client'

import { useState } from 'react'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Printer, Download, CreditCard } from 'lucide-react'
import { mockMember } from '@/data/mock'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import ButtonsNfc from './ButtonsNfc'

export default function MemberPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all')

  const filteredTreatments =
    selectedMonth === 'all'
      ? mockMember.traitements
      : mockMember.traitements.filter((t) => {
          const treatmentMonth = new Date(t.date).getMonth()
          return treatmentMonth === parseInt(selectedMonth)
        })

  return (
    <Layout>
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
              Gérer les données de ce membre
            </p>
          </div>
        </div>
        <div className='container mx-auto p-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {/* Left column: Member details */}
            <div className='md:col-span-1'>
              <Card>
                <CardHeader>
                  <CardTitle>Détails du Membre</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col items-center'>
                  <Avatar className='mb-4 h-32 w-32'>
                    <AvatarImage
                      src='https://i.pravatar.cc/128'
                      alt={mockMember.nom}
                    />
                    <AvatarFallback>
                      {mockMember.nom
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className='mb-2 text-2xl font-bold'>{mockMember.nom}</h2>
                  <Badge
                    variant={
                      mockMember.forfaitActif ? 'default' : 'destructive'
                    }
                  >
                    {mockMember.forfaitActif
                      ? 'Forfait Actif'
                      : 'Forfait Inactif'}
                  </Badge>
                  <div className='mt-4 text-center'>
                    <p>
                      <strong>ID:</strong> {mockMember.id}
                    </p>
                    <p>
                      <strong>Zone de Santé:</strong> {mockMember.zoneDeSanteId}
                    </p>
                    <p>
                      <strong>Hospitalisations restantes:</strong>{' '}
                      {mockMember.hospitalisationsRestantes}
                    </p>
                    <p>
                      <strong>Soins ambulatoires restants:</strong>{' '}
                      {mockMember.soinsAmbulatoiresRestants}
                    </p>
                    <p>
                      <strong>Membre depuis:</strong>{' '}
                      {format(new Date(mockMember.createdAt), 'dd MMMM yyyy', {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-center'>
                  <ButtonsNfc mockMember={mockMember} />
                </CardFooter>
              </Card>
            </div>

            {/* Right column: Payments and Treatments */}
            <div className='space-y-6 md:col-span-2'>
              {/* Payments Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Paiements</CardTitle>
                  <CardDescription>
                    Les 6 derniers paiements effectués
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMember.paiements.slice(-6).map((paiement, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {format(new Date(paiement.date), 'dd MMMM yyyy', {
                              locale: fr,
                            })}
                          </TableCell>
                          <TableCell>{paiement.montant}€</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Treatments Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Traitements</CardTitle>
                  <CardDescription>Historique des traitements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='mb-4'>
                    <Select onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder='Filtrer par mois' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Tous les mois</SelectItem>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {format(new Date(2023, i, 1), 'MMMM', {
                              locale: fr,
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTreatments.map((traitement) => (
                        <TableRow key={traitement.id}>
                          <TableCell>
                            {format(new Date(traitement.date), 'dd MMMM yyyy', {
                              locale: fr,
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                traitement.type === 'hospitalisation'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {traitement.type === 'hospitalisation'
                                ? 'Hospitalisation'
                                : 'Ambulatoire'}
                            </Badge>
                          </TableCell>
                          <TableCell>{traitement.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}
