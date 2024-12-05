import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/custom/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { getMembres } from '@/data/axiosget'

// Type definitions
interface TraitementForm {
  membreId: number | null
  type: 'hospitalisation' | 'ambulatoire' | ''
  date: string
  description: string
}

interface Membre {
  id: number
  nom: string
  forfaitActif: boolean
  hospitalisationsRestantes: number
  soinsAmbulatoiresRestants: number
  traitements: TraitementForm[]
}

const MembersTreatmentPage: React.FC = ({}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TraitementForm>({
    defaultValues: {
      membreId: null,
      type: '',
      date: '',
      description: '',
    },
  })

  const onSubmit = (data: TraitementForm) => {
    console.log(data)
  }
  const { data: membres, isLoading } = useQuery({
    queryKey: ['membres'],
    queryFn: getMembres,
  })

  if (isLoading) return <p>Loading...</p>

  const selectedMembreId = watch('membreId')
  const selectedMembre = membres!.find((m) => m.id === selectedMembreId)

  const handleFormSubmit = (data: TraitementForm) => {
    onSubmit(data)
    reset()
  }

  return (
    <div className='mx-auto max-w-4xl p-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-bold'>
            Ajouter un Traitement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
            {/* Select Member */}
            <div>
              <Label htmlFor='membre'>Sélectionner un Membre</Label>
              <Controller
                name='membreId'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionnez un membre' />
                    </SelectTrigger>
                    <SelectContent>
                      {membres!.map((membre) => (
                        <SelectItem
                          key={membre.id}
                          value={membre.id.toString()}
                        >
                          {membre.nom} (
                          {membre.forfaitActif ? 'Actif' : 'Inactif'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.membreId && (
                <p className='text-sm text-red-500'>Sélectionnez un membre.</p>
              )}
            </div>

            {/* Treatment Type */}
            <div>
              <Label htmlFor='type'>Type de Traitement</Label>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionnez un type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='hospitalisation'>
                        Hospitalisation
                      </SelectItem>
                      <SelectItem value='ambulatoire'>Ambulatoire</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className='text-sm text-red-500'>
                  Sélectionnez un type de traitement.
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <Label htmlFor='date'>Date du Traitement</Label>
              <Controller
                name='date'
                control={control}
                render={({ field }) => (
                  <Input id='date' type='date' {...field} />
                )}
              />
              {errors.date && (
                <p className='text-sm text-red-500'>Entrez une date valide.</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor='description'>Description</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Textarea id='description' rows={3} {...field} />
                )}
              />
              {errors.description && (
                <p className='text-sm text-red-500'>
                  Ajoutez une description du traitement.
                </p>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className='space-x-2'>
          <Button onClick={handleSubmit(handleFormSubmit)}>Ajouter</Button>
          <Button variant='ghost' onClick={() => reset()}>
            Annuler
          </Button>
        </CardFooter>
      </Card>

      {/* Selected Member Details */}
      {selectedMembre && (
        <div className='mt-6'>
          <h3 className='text-xl font-semibold'>Détails du Membre</h3>
          <p>
            <strong>Nom:</strong> {selectedMembre.nom}
          </p>
          <p>
            <strong>Hospitalisations Restantes:</strong>{' '}
            {selectedMembre.hospitalisationsRestantes}
          </p>
          <p>
            <strong>Soins Ambulatoires Restants:</strong>{' '}
            {selectedMembre.soinsAmbulatoiresRestants}
          </p>
        </div>
      )}
    </div>
  )
}

export default MembersTreatmentPage
