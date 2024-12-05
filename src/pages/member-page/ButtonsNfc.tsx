import { Button } from '@/components/custom/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreditCard, Download, Printer } from 'lucide-react'
import React from 'react'

type Props = {
  mockMember: any
}

export default function ButtonsNfc({ mockMember }: Props) {
  const [scanedData, setScanedData] = React.useState('')
  const handleScan = async () => {
    if ('NDEFReader' in window) {
      try {
        const ndef = new NDEFReader()
        await ndef.scan()
        console.log('> Scan started')

        ndef.addEventListener('readingerror', () => {
          console.log(
            'Argh! Cannot read data from the NFC tag. Try another one?'
          )
        })

        ndef.addEventListener('reading', ({ message, serialNumber }) => {
          console.log(`> Serial Number: ${serialNumber}`)
          setScanedData(message.records)
          console.log(`> Records: (${message.records.length})`)
        })
      } catch (error) {
        console.log('Argh! ' + error)
      }
    } else {
      alert("NFC n'est pas supporté sur cet appareil.")
    }
  }

  const handleWrite = async () => {
    if ('NDEFReader' in window) {
      try {
        const ndef = new NDEFReader()
        await ndef.write('Hello world!')
        alert('> Message written')
      } catch (error) {
        console.log('Argh! ' + error)
      }
    } else {
      alert("NFC n'est pas supporté sur cet appareil.")
    }
  }
  return (
    <div className='flex items-center justify-center'>
      <Button onClick={handleWrite}>Ecrire la carte</Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <CreditCard className='mr-2 h-4 w-4' />
            Générer la carte
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Carte de Membre</DialogTitle>
            <DialogDescription>
              Voici la carte de membre de Vous pouvez l'imprimer ou la
              télécharger.
            </DialogDescription>
          </DialogHeader>
          <div className='rounded-lg bg-primary p-6 text-primary-foreground shadow-lg'>
            <h3 className='mb-2 text-2xl font-bold'>test</h3>
            <p>
              <strong>ID:</strong> test
            </p>
            <p>
              <strong>Zone de Santé:</strong> {mockMember.zoneDeSanteId}
            </p>
            <p>
              <strong>Statut:</strong>{' '}
              {mockMember.forfaitActif ? 'Actif' : 'Inactif'}
            </p>
          </div>
          <div className='mt-4 flex justify-end space-x-2'>
            <Button variant='outline'>
              <Printer className='mr-2 h-4 w-4' />
              Imprimer
            </Button>
            <Button>
              <Download className='mr-2 h-4 w-4' />
              Télécharger
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button onClick={handleScan}>Lire la carte</Button>
    </div>
  )
}
