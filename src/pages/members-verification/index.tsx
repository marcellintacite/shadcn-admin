'use client'

import { useState, useEffect } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, CreditCard, QrCode, Search } from 'lucide-react'
import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Search as SearchComponent } from '@/components/search'
import NFCApp from '../dashboard/NfcApp'

// Mock data for demonstration
const mockMembers = [
  {
    id: 1,
    nom: 'Jean Dupont',
    forfaitActif: true,
    hospitalisationsRestantes: 3,
    soinsAmbulatoiresRestants: 5,
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    nom: 'Marie Martin',
    forfaitActif: false,
    hospitalisationsRestantes: 1,
    soinsAmbulatoiresRestants: 2,
    image: 'https://i.pravatar.cc/150?img=2',
  },
]

export default function MemberVerificationPage() {
  const [verificationMethod, setVerificationMethod] = useState<
    'nfc' | 'qr' | 'id'
  >('nfc')
  const [memberId, setMemberId] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifiedMember, setVerifiedMember] = useState<
    (typeof mockMembers)[0] | null
  >(null)
  const [error, setError] = useState('')
  const [isNfcSupported, setIsNfcSupported] = useState(false)

  useEffect(() => {
    // Check if NFC is supported
    if ('NDEFReader' in window) {
      setIsNfcSupported(true)
    }
  }, [])

  const handleVerification = (id: string) => {
    setIsVerifying(true)
    setError('')
    setVerifiedMember(null)

    // Simulate verification process
    setTimeout(() => {
      const foundMember = mockMembers.find((m) => m.id.toString() === id)
      if (foundMember) {
        setVerifiedMember(foundMember)
      } else {
        setError("Membre non trouvé. Veuillez vérifier l'ID et réessayer.")
      }
      setIsVerifying(false)
    }, 1500)
  }

  const handleNfcScan = async () => {
    if (!isNfcSupported) {
      setError("NFC n'est pas supporté sur cet appareil.")
      return
    }

    try {
      const ndef = new (window as any).NDEFReader()
      await ndef.scan()
      ndef.onreading = (event: any) => {
        const decoder = new TextDecoder()
        for (const record of event.message.records) {
          if (record.recordType === 'text') {
            const id = decoder.decode(record.data)
            handleVerification(id)
          }
        }
      }
    } catch (error) {
      console.error(error)
      setError('Erreur lors de la lecture NFC. Veuillez réessayer.')
    }
  }

  const renderVerificationInput = () => {
    switch (verificationMethod) {
      case 'nfc':
        return (
          <div className='text-center'>
            <CreditCard className='mx-auto mb-4 h-16 w-16 text-primary' />
            <p>Approchez la carte NFC du lecteur</p>
            <Button
              onClick={handleNfcScan}
              className='mt-4'
              disabled={!isNfcSupported}
            >
              Activer le lecteur NFC
            </Button>
          </div>
        )
      case 'qr':
        return (
          <div className='mx-auto w-full max-w-sm'>
            <Scanner
              onScan={(result) => {
                result.map((res) => {
                  if (result) {
                    handleVerification(res.rawValue)
                  }
                })
              }}
              constraints={{ facingMode: 'environment' }}
            />
          </div>
        )
      case 'id':
        return (
          <div className='flex items-center space-x-2'>
            <Input
              type='text'
              placeholder="Entrez l'ID du membre"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
            <Button
              onClick={() => handleVerification(memberId)}
              disabled={isVerifying || !memberId}
            >
              {isVerifying ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Search className='mr-2 h-4 w-4' />
              )}
              Vérifier
            </Button>
          </div>
        )
    }
  }

  return (
    <Layout>
      <Layout.Header sticky>
        <SearchComponent />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        {/* <NFCApp /> */}
        <div className='container mx-auto p-6'>
          <h1 className='mb-6 text-3xl font-bold'>Vérification des Membres</h1>
          <Card className='mx-auto w-full max-w-2xl'>
            <CardHeader>
              <CardTitle>Vérifier un Membre</CardTitle>
              <CardDescription>
                Utilisez une carte NFC, un code QR ou l'ID du membre pour la
                vérification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={verificationMethod}
                onValueChange={(value) =>
                  setVerificationMethod(value as 'nfc' | 'qr' | 'id')
                }
              >
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='nfc'>NFC</TabsTrigger>
                  <TabsTrigger value='qr'>QR Code</TabsTrigger>
                  <TabsTrigger value='id'>ID Manuel</TabsTrigger>
                </TabsList>
                <TabsContent value='nfc' className='mt-4'>
                  {renderVerificationInput()}
                </TabsContent>
                <TabsContent value='qr' className='mt-4'>
                  {renderVerificationInput()}
                </TabsContent>
                <TabsContent value='id' className='mt-4'>
                  {renderVerificationInput()}
                </TabsContent>
              </Tabs>

              {error && <p className='mt-4 text-red-500'>{error}</p>}

              {verifiedMember && (
                <Card className='mt-6 overflow-hidden'>
                  <div className='relative h-32 bg-gradient-to-r from-blue-500 to-purple-500'>
                    <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent'></div>
                  </div>
                  <CardContent className='relative pt-0'>
                    <div className='-mt-12 mb-4 flex items-end'>
                      <Avatar className='h-24 w-24 border-4 border-background'>
                        <AvatarImage
                          src={verifiedMember.image}
                          alt={verifiedMember.nom}
                        />
                        <AvatarFallback>
                          {verifiedMember.nom
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className='mb-2 ml-4'>
                        <h2 className='text-2xl font-bold text-white'>
                          {verifiedMember.nom}
                        </h2>
                        <Badge
                          variant={
                            verifiedMember.forfaitActif
                              ? 'default'
                              : 'destructive'
                          }
                          className='mt-1'
                        >
                          {verifiedMember.forfaitActif
                            ? 'Forfait Actif'
                            : 'Forfait Inactif'}
                        </Badge>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <p>
                        <strong>ID:</strong> {verifiedMember.id}
                      </p>
                      <p>
                        <strong>Hospitalisations restantes:</strong>{' '}
                        {verifiedMember.hospitalisationsRestantes}
                      </p>
                      <p>
                        <strong>Soins ambulatoires restants:</strong>{' '}
                        {verifiedMember.soinsAmbulatoiresRestants}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout.Body>
    </Layout>
  )
}
