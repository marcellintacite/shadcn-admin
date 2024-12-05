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
import { zoneDeSanteSchema, ZoneDeSanteSchemaType } from '@/types/zod'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/data/axiosget'

interface AddZoneDeSanteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (zoneDeSanteData: ZoneDeSanteSchemaType) => void
}

export function AddZoneDeSanteModal({
  isOpen,
  onClose,
  onSubmit,
}: AddZoneDeSanteModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ZoneDeSanteSchemaType>({
    resolver: zodResolver(zoneDeSanteSchema),
    defaultValues: {
      nom: '',
      responsable: undefined,
    },
  })

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
  const onSubmitForm = (data: ZoneDeSanteSchemaType) => {
    onSubmit(data)
    onClose()
  }

  if (isLoading) {
    return <p>Chargement en cours</p>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='nom'>Nom de la Zone</Label>
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
              <Label htmlFor='responsable'>Responsable</Label>
              <Controller
                name='responsable'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionnez un responsable' />
                    </SelectTrigger>
                    <SelectContent>
                      {usersData &&
                        usersData.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.nom}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.responsable && (
                <p className='text-sm text-red-500'>
                  {errors.responsable.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Ajouter la Zone de Santé</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
