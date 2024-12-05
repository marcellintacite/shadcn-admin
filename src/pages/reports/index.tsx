import { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/custom/button'
import { Loader2, Printer } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Types pour les rapports
type RapportType =
  | 'paiements'
  | 'traitements'
  | 'membres'
  | 'structures'
  | 'zones'

// Données simulées pour les graphiques
const mockData = {
  paiements: [
    { mois: 'Jan', montant: 4000 },
    { mois: 'Fév', montant: 3000 },
    { mois: 'Mar', montant: 5000 },
    { mois: 'Avr', montant: 4500 },
    { mois: 'Mai', montant: 6000 },
    { mois: 'Juin', montant: 5500 },
  ],
  traitements: [
    { name: 'Hospitalisations', value: 400 },
    { name: 'Soins ambulatoires', value: 300 },
  ],
  membres: [
    { status: 'Actifs', value: 1500 },
    { status: 'Inactifs', value: 200 },
  ],
  structures: [
    { type: 'Hôpitaux', nombre: 20 },
    { type: 'Cliniques', nombre: 50 },
    { type: 'Dispensaires', nombre: 30 },
  ],
  zones: [
    { region: 'Nord', nombreZones: 3 },
    { region: 'Sud', nombreZones: 2 },
    { region: 'Est', nombreZones: 2 },
    { region: 'Ouest', nombreZones: 3 },
  ],
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

// Fonction simulée pour générer un rapport
const genererRapport = async (type: RapportType): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  switch (type) {
    case 'paiements':
      return "Rapport des paiements : Le total des paiements pour les 6 premiers mois de l'année s'élève à 28,000€. On observe une tendance à la hausse, avec un pic en mai."
    case 'traitements':
      return 'Rapport des traitements : 400 hospitalisations et 300 soins ambulatoires ont été effectués cette année. Les hospitalisations représentent 57% des traitements.'
    case 'membres':
      return "Rapport des membres : Sur un total de 1700 membres, 1500 sont actifs (88%) et 200 sont inactifs (12%). Le taux d'activité est très élevé."
    case 'structures':
      return 'Rapport des structures sanitaires : 20 hôpitaux, 50 cliniques et 30 dispensaires sont actuellement en service. Les cliniques représentent la majorité des structures.'
    case 'zones':
      return 'Rapport des zones de santé : 10 zones sont réparties sur 4 régions. La région Nord et Ouest ont le plus grand nombre de zones (3 chacune).'
    default:
      return 'Type de rapport non reconnu'
  }
}

export default function RapportsPage() {
  const [typeRapport, setTypeRapport] = useState<RapportType | ''>('')
  const [rapportContent, setRapportContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const rapportRef = useRef<HTMLDivElement>(null)

  const handleGenerateReport = async () => {
    if (!typeRapport) return

    setIsLoading(true)
    try {
      const rapport = await genererRapport(typeRapport)
      setRapportContent(rapport)
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error)
      setRapportContent(
        'Une erreur est survenue lors de la génération du rapport.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    const printContent = rapportRef.current
    if (printContent) {
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContent.innerHTML
      window.print()
      document.body.innerHTML = originalContents
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-3xl font-bold'>Génération de Rapports</h1>

      <Card className='mx-auto mb-6 w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>Sélectionnez le type de rapport</CardTitle>
          <CardDescription>
            Choisissez le type de données que vous souhaitez analyser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={(value) => setTypeRapport(value as RapportType)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Type de rapport' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='paiements'>Rapport des paiements</SelectItem>
              <SelectItem value='traitements'>
                Rapport des traitements
              </SelectItem>
              <SelectItem value='membres'>Rapport des membres</SelectItem>
              <SelectItem value='structures'>
                Rapport des structures sanitaires
              </SelectItem>
              <SelectItem value='zones'>Rapport des zones de santé</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            onClick={handleGenerateReport}
            disabled={!typeRapport || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Génération en cours...
              </>
            ) : (
              'Générer le rapport'
            )}
          </Button>
        </CardFooter>
      </Card>

      {rapportContent && (
        <Card className='mx-auto mt-6 w-full max-w-4xl' ref={rapportRef}>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Résultat du Rapport</CardTitle>
            <Button onClick={handlePrint} variant='outline'>
              <Printer className='mr-2 h-4 w-4' />
              Imprimer
            </Button>
          </CardHeader>
          <CardContent>
            <p className='mb-4'>{rapportContent}</p>

            {typeRapport === 'paiements' && (
              <div className='mb-4'>
                <h3 className='mb-2 text-lg font-semibold'>
                  Évolution des paiements
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={mockData.paiements}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='mois' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='montant' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {typeRapport === 'traitements' && (
              <div className='mb-4'>
                <h3 className='mb-2 text-lg font-semibold'>
                  Répartition des traitements
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={mockData.traitements}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {mockData.traitements.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {typeRapport === 'membres' && (
              <div className='mb-4'>
                <h3 className='mb-2 text-lg font-semibold'>
                  Statut des membres
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={mockData.membres}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {mockData.membres.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {typeRapport === 'structures' && (
              <div className='mb-4'>
                <h3 className='mb-2 text-lg font-semibold'>
                  Répartition des structures sanitaires
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={mockData.structures}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='type' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='nombre' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {typeRapport === 'zones' && (
              <div className='mb-4'>
                <h3 className='mb-2 text-lg font-semibold'>
                  Répartition des zones par région
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={mockData.zones}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='region' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='nombreZones' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className='mt-4'>
              <h3 className='mb-2 text-lg font-semibold'>Conclusion</h3>
              <p>
                {typeRapport === 'paiements' &&
                  "Les paiements montrent une tendance à la hausse, ce qui est un signe positif pour la santé financière de l'organisation. Il serait judicieux de maintenir cette dynamique et d'analyser les facteurs de croissance pour les mois à venir."}
                {typeRapport === 'traitements' &&
                  "La répartition entre hospitalisations et soins ambulatoires est relativement équilibrée. Il pourrait être intéressant d'explorer des moyens d'optimiser les soins ambulatoires pour réduire la charge sur les services d'hospitalisation."}
                {typeRapport === 'membres' &&
                  "Le taux élevé de membres actifs est très encourageant. Il serait bénéfique de mettre en place des stratégies pour maintenir ce niveau d'engagement et potentiellement réactiver les membres inactifs."}
                {typeRapport === 'structures' &&
                  "La prédominance des cliniques dans notre réseau offre une bonne couverture pour les soins de base. Il pourrait être utile d'évaluer si la répartition actuelle répond efficacement aux besoins de santé de la population."}
                {typeRapport === 'zones' &&
                  "La répartition des zones de santé semble équilibrée entre les régions. Il serait pertinent d'évaluer si cette distribution correspond aux densités de population et aux besoins spécifiques de chaque région."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
