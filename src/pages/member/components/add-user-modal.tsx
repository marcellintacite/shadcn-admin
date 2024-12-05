import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { getZonesDeSante } from '@/data/axiosget'

// Define the Membre form type based on the provided interface
export interface MembreForm {
  nom: string
  forfaitActif: boolean
  hospitalisationsRestantes: number
  soinsAmbulatoiresRestants: number
  zoneDeSanteId: number | null // Can initially be null until selected
  paiements: never[] // Default to an empty array
}

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (membreData: MembreForm) => void
}

export function AddMemberModal({
  isOpen,
  onClose,
  onSubmit,
}: AddMemberModalProps) {
  const { data: zonesData } = useQuery({
    queryKey: ['zones'],
    queryFn: getZonesDeSante,
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MembreForm>({
    defaultValues: {
      nom: '',
      forfaitActif: false, // Default to inactive
      hospitalisationsRestantes: 0,
      soinsAmbulatoiresRestants: 0,
      zoneDeSanteId: null,
      paiements: [],
    },
  })

  const onSubmitForm = (data: MembreForm) => {
    onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Ajouter un Membre</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className='grid gap-4 py-4'>
            {/* Nom */}
            <div className='grid gap-2'>
              <Label htmlFor='nom'>Nom</Label>
              <Controller
                name='nom'
                control={control}
                render={({ field }) => <Input id='nom' {...field} />}
              />
              {errors.nom && (
                <p className='text-sm text-red-500'>{errors.nom.message}</p>
              )}
            </div>

            {/* Forfait Actif */}
            <div className='grid gap-2'>
              <Label htmlFor='forfaitActif'>Forfait Actif</Label>
              <Controller
                name='forfaitActif'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez l'état du forfait" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='true'>Actif</SelectItem>
                      <SelectItem value='false'>Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.forfaitActif && (
                <p className='text-sm text-red-500'>
                  {errors.forfaitActif.message}
                </p>
              )}
            </div>

            {/* Zone de Santé */}
            <div className='grid gap-2'>
              <Label htmlFor='zoneDeSanteId'>Zone de Santé</Label>
              <Controller
                name='zoneDeSanteId'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionnez une zone de santé' />
                    </SelectTrigger>
                    <SelectContent>
                      {zonesData &&
                        zonesData.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id.toString()}>
                            {zone.nom}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.zoneDeSanteId && (
                <p className='text-sm text-red-500'>
                  {errors.zoneDeSanteId.message}
                </p>
              )}
            </div>

            {/* Hospitalisations Restantes */}
            <div className='grid gap-2'>
              <Label htmlFor='hospitalisationsRestantes'>
                Hospitalisations Restantes
              </Label>
              <Controller
                name='hospitalisationsRestantes'
                control={control}
                render={({ field }) => (
                  <Input
                    id='hospitalisationsRestantes'
                    type='number'
                    {...field}
                  />
                )}
              />
              {errors.hospitalisationsRestantes && (
                <p className='text-sm text-red-500'>
                  {errors.hospitalisationsRestantes.message}
                </p>
              )}
            </div>

            {/* Soins Ambulatoires Restants */}
            <div className='grid gap-2'>
              <Label htmlFor='soinsAmbulatoiresRestants'>
                Soins Ambulatoires Restants
              </Label>
              <Controller
                name='soinsAmbulatoiresRestants'
                control={control}
                render={({ field }) => (
                  <Input
                    id='soinsAmbulatoiresRestants'
                    type='number'
                    {...field}
                  />
                )}
              />
              {errors.soinsAmbulatoiresRestants && (
                <p className='text-sm text-red-500'>
                  {errors.soinsAmbulatoiresRestants.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Ajouter le Membre</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
