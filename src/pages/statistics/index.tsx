'use client'

import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserNav } from '@/components/user-nav'
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
  LineChart,
  Line,
} from 'recharts'

// Mock data
const paymentData = [
  { annee: 2020, montant: 5000 },
  { annee: 2021, montant: 7000 },
  { annee: 2022, montant: 9000 },
  { annee: 2023, montant: 12000 },
]

const treatmentData = [
  { type: 'hospitalisation', count: 150 },
  { type: 'ambulatoire', count: 300 },
]

const memberActivityData = [
  { status: 'Actif', count: 800 },
  { status: 'Inactif', count: 200 },
]

const treatmentTrendData = [
  { mois: 'Jan', hospitalisations: 20, ambulatoires: 50 },
  { mois: 'Fév', hospitalisations: 25, ambulatoires: 55 },
  { mois: 'Mar', hospitalisations: 30, ambulatoires: 60 },
  { mois: 'Avr', hospitalisations: 22, ambulatoires: 58 },
  { mois: 'Mai', hospitalisations: 28, ambulatoires: 62 },
  { mois: 'Juin', hospitalisations: 35, ambulatoires: 70 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function StatisticsPage() {
  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className='flex w-full items-center justify-between'>
          <Search />
          <div className='flex items-center space-x-4'>
            <ThemeSwitch />
            <UserNav />
          </div>
        </div>
      </Layout.Header>
      <Layout.Body className='flex flex-col'>
        <div className='flex justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Statistique</h1>
            <p className='text-muted-foreground'>
              Mutuel de santé de la République Démocratique du Congo
            </p>
          </div>
        </div>
        <div className='container mx-auto p-4'>
          <Tabs defaultValue='overview' className='space-y-4'>
            <TabsList>
              <TabsTrigger value='overview'>Vue d'ensemble</TabsTrigger>
              <TabsTrigger value='payments'>Paiements</TabsTrigger>
              <TabsTrigger value='treatments'>Traitements</TabsTrigger>
              <TabsTrigger value='members'>Membres</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Paiements Annuels</CardTitle>
                    <CardDescription>
                      Montant total des paiements par année
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <BarChart data={paymentData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='annee' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='montant' fill='#8884d8' />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des Traitements</CardTitle>
                    <CardDescription>
                      Hospitalisations vs Soins Ambulatoires
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <PieChart>
                        <Pie
                          data={treatmentData}
                          cx='50%'
                          cy='50%'
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill='#8884d8'
                          dataKey='count'
                        >
                          {treatmentData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='payments'>
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Paiements Annuels</CardTitle>
                  <CardDescription>
                    Montant total des paiements par année
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={400}>
                    <BarChart data={paymentData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='annee' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey='montant' fill='#8884d8' />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='treatments'>
              <Card>
                <CardHeader>
                  <CardTitle>Tendances des Traitements</CardTitle>
                  <CardDescription>
                    Évolution des hospitalisations et soins ambulatoires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={treatmentTrendData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='mois' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type='monotone'
                        dataKey='hospitalisations'
                        stroke='#8884d8'
                      />
                      <Line
                        type='monotone'
                        dataKey='ambulatoires'
                        stroke='#82ca9d'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='members'>
              <Card>
                <CardHeader>
                  <CardTitle>Activité des Membres</CardTitle>
                  <CardDescription>
                    Répartition des membres actifs et inactifs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={400}>
                    <PieChart>
                      <Pie
                        data={memberActivityData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={150}
                        fill='#8884d8'
                        dataKey='count'
                      >
                        {memberActivityData.map((entry, index) => (
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout.Body>
    </Layout>
  )
}
