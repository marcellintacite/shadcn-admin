import { Membre, StructureSanitaire, Utilisateur, ZoneDeSante } from '@/types'
import axiosInstance from './axios'
import { UserSchemaType } from '@/types/zod'

export const getUsers = async (): Promise<Utilisateur[]> => {
  const response = await axiosInstance.get('/utilisateurs')
  return response.data
}

export const getZonesDeSante = async (): Promise<ZoneDeSante[]> => {
  const response = await axiosInstance.get('/zonesDeSante')
  return response.data
}

export const getStructuresSanitaires = async (): Promise<
  StructureSanitaire[]
> => {
  const response = await axiosInstance.get('/structuresSanitaires')
  return response.data
}

export const addUser = async (data: UserSchemaType): Promise<Utilisateur> => {
  const user: Utilisateur = {
    ...data,
    id: Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const response = await axiosInstance.post('/utilisateurs', user)
  return response.data
}

export const getOneZoneDeSante = async (id: string): Promise<ZoneDeSante> => {
  const response = await axiosInstance.get(`/zonesDeSante/${id}`)
  return response.data
}

export const getMembres = async (): Promise<Membre[]> => {
  const response = await axiosInstance.get('/membres')
  return response.data
}

export async function fetchPaymentsWithUserDetails() {
  try {
    // Fetch membres and zonesDeSante from the JSON Server
    const membres = await getMembres()
    const zonesDeSante = await getZonesDeSante()

    // Create a map of zoneDeSanteId to zone name for easy lookup
    const zoneMap: { [key: number]: string } = zonesDeSante.reduce(
      (acc, zone) => {
        // @ts-ignore
        acc[zone.id] = zone.nom
        return acc
      },
      {}
    )

    // Transform the data to include zone name
    const paymentsWithDetails = membres.flatMap((membre) =>
      membre.paiements.map((paiement) => ({
        nom: membre.nom,
        zoneDeSanteId: membre.zoneDeSanteId,
        zoneDeSanteNom: zoneMap[membre.zoneDeSanteId], // Look up zone name from zoneMap
        forfaitActif: membre.forfaitActif,
        hospitalisationsRestantes: membre.hospitalisationsRestantes,
        soinsAmbulatoiresRestants: membre.soinsAmbulatoiresRestants,
        paiementAnnee: paiement.annee,
        paiementMontant: paiement.montant,
        paiementDate: paiement.date,
        paiementCreatedAt: paiement.createdAt,
        paiementUpdatedAt: paiement.updatedAt,
      }))
    )

    // Display the result
    return paymentsWithDetails
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
