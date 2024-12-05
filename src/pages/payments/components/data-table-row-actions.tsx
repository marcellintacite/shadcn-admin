import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { userSchema } from '@/types/zod'
import axiosInstance from '@/data/axios'
import { toast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const queryClient = useQueryClient()
  const handleRemoveUser = async () => {
    if (confirm('Voulez-vous supprimer cet utilisateur ?')) {
      try {
        console.log(row)
        const res = await axiosInstance.delete(
          // @ts-ignore
          `/utilisateurs/${row.original?.id}`
        )
        queryClient.invalidateQueries({
          queryKey: ['users'],
        })

        toast({
          title: 'Succès',
          description: "L'utilisateur a été supprimé avec succès",
        })
      } catch (error) {
        toast({
          title: 'Error',
          description:
            "Il y a eu une erreur lors de la suppression de l'utilisateur",
        })
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRemoveUser}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
