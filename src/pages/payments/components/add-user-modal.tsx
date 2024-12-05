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
import { userSchema, UserSchemaType } from '../../../types/zod'
import { useQuery } from '@tanstack/react-query'
import { getStructuresSanitaires, getZonesDeSante } from '@/data/axiosget'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: UserSchemaType) => void
}

export function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
  const { data: structuresData, isLoading } = useQuery({
    queryKey: ['structures'],
    queryFn: getStructuresSanitaires,
  })
  const { data: zonesData } = useQuery({
    queryKey: ['zones'],
    queryFn: getZonesDeSante,
  })
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nom: '',
      email: '',
      motDePasse: '',
      role: 'agent_structure',
    },
  })

  const role = watch('role')

  const onSubmitForm = (data: UserSchemaType) => {
    onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className='grid gap-4 py-4'>
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
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <Input id='email' type='email' {...field} />
                )}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='motDePasse'>Mot de passe</Label>
              <Controller
                name='motDePasse'
                control={control}
                render={({ field }) => (
                  <Input id='motDePasse' type='password' {...field} />
                )}
              />
              {errors.motDePasse && (
                <p className='text-sm text-red-500'>
                  {errors.motDePasse.message}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='role'>Rôle</Label>
              <Controller
                name='role'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionnez un rôle' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='admin_global'>Admin Global</SelectItem>
                      <SelectItem value='admin_zone'>Admin Zone</SelectItem>
                      <SelectItem value='agent_structure'>
                        Agent Structure
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className='text-sm text-red-500'>{errors.role.message}</p>
              )}
            </div>
            {role === 'admin_zone' && (
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
                            <SelectItem
                              key={zone.id}
                              value={zone.id.toString()}
                            >
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
            )}
            {role === 'agent_structure' && (
              <div className='grid gap-2'>
                <Label htmlFor='structureSanitaireId'>
                  Structure Sanitaire
                </Label>
                <Controller
                  name='structureSanitaireId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Sélectionnez une structure sanitaire' />
                      </SelectTrigger>
                      <SelectContent>
                        {structuresData &&
                          structuresData.map((structure) => (
                            <SelectItem
                              key={structure.id}
                              value={structure.id.toString()}
                            >
                              {structure.nom}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.structureSanitaireId && (
                  <p className='text-sm text-red-500'>
                    {errors.structureSanitaireId.message}
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type='submit'>Ajouter l'utilisateur</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
