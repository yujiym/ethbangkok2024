import { useLocation, useNavigate, useRouteLoaderData } from '@remix-run/react'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { isLoadingAtom, userAtom } from '~/atoms'
import Loading from '~/components/Loading'
import { generateManifest } from '~/lib/utils'
import type { RootLoaderData } from '~/types'

export default function AppHandler() {
  const { isConnected, isConnecting, address } = useAccount()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isLoading = useAtomValue(isLoadingAtom)
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    if (pathname !== '/' && !isConnected) {
      navigate('/')
    }
    if (pathname === '/' && isConnected && address) {
      navigate('/home')
    }
    // if (isConnected && address && !user.subname) {
    //   getSubname(address).then((subname) => {
    //     setUser((prev) => ({ ...prev, subname }))
    //     if (!subname) {
    //       navigate('/start')
    //     } else if (pathname === '/') {
    //       navigate('/home')
    //     }
    //   })
    // }
  }, [isConnected, address, navigate, pathname])

  const ld = useRouteLoaderData('root') as RootLoaderData

  useEffect(() => {
    const manifestElement = document.getElementById('manifest')
    const manifestString = JSON.stringify({
      ...generateManifest(ld),
      start_url: `${window.location.origin}/home`
    })
    manifestElement?.setAttribute(
      'href',
      `data:application/json;charset=utf-8,${encodeURIComponent(manifestString)}`
    )
  }, [ld])

  return isLoading || isConnecting ? <Loading /> : null
}
