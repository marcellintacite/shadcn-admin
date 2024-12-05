import { z } from 'zod'

export const userSchema = z
  .object({
    nom: z.string().min(1, { message: 'Le nom est requis' }),
    email: z.string().email({ message: 'Email invalide' }),
    motDePasse: z.string().min(6, {
      message: 'Le mot de passe doit contenir au moins 6 caractères',
    }),
    role: z.enum(['admin_global', 'admin_zone', 'agent_structure']),
    zoneDeSanteId: z.number().optional(),
    structureSanitaireId: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'admin_zone' && !data.zoneDeSanteId) {
        return false
      }
      if (data.role === 'agent_structure' && !data.structureSanitaireId) {
        return false
      }
      return true
    },
    {
      message:
        'Veuillez sélectionner une zone de santé ou une structure sanitaire selon le rôle',
      path: ['zoneDeSanteId', 'structureSanitaireId'],
    }
  )

export type UserSchemaType = z.infer<typeof userSchema>

export const zoneDeSanteSchema = z.object({
  nom: z.string().min(1, { message: 'Le nom de la zone est requis' }),
  responsable: z.number({ required_error: 'Le responsable est requis' }),
  // These fields are included in the schema but won't be in the form as per the request
  structuresSanitaires: z.array(z.number()).optional(),
  membres: z.array(z.number()).optional(),
})

export type ZoneDeSanteSchemaType = z.infer<typeof zoneDeSanteSchema>
