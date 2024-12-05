import { useLocation } from 'react-router-dom'

export default function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    // Ensure nav always starts with '/'
    const normalizedNav = nav.startsWith('/') ? nav : `/${nav}`

    // Exact match for root or check if pathname starts with normalizedNav
    return (
      pathname === normalizedNav || pathname.startsWith(normalizedNav + '/')
    )
  }

  return { checkActiveNav }
}
