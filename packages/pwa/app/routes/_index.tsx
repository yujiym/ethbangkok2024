import { usePwa } from '@dotmind/react-use-pwa'
import { HandTap } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { useConnect } from 'wagmi'
import { loaderDataAtom } from '~/atoms'
import PWAInstallPrompt from '~/components/PWAInstallPrompt'
import IconKon from '~/components/icon/kon'
import { SITE_URL } from '~/lib/const'

export const loader = async () => {
  return { bodyClass: 'bg-main text-main-fg' }
}

export default function Home() {
  const { connectors, connectAsync } = useConnect()
  const { isStandalone } = usePwa()
  const ld = useAtomValue(loaderDataAtom)

  const login = async () => {
    await connectAsync({ connector: connectors[0] })
  }

  return (
    <div className="wrapper flex min-h-screen items-center justify-center">
      <div className="-mt-32 flex flex-col items-center justify-center space-y-8 text-center">
        {ld?.appConfig?.icons?.logo ? (
          <img
            src={ld?.appConfig?.icons?.logo}
            className="mb-8 max-h-48 max-w-48 rounded-full"
            alt={ld?.appConfig?.name ?? ''}
          />
        ) : (
          <IconKon size={198} className="mb-8" />
        )}
        <h1 className="font-bold text-6xl">{ld?.appConfig?.name ?? 'Kon community'}</h1>
        {ld?.appConfig?.description && <p className="text-2xl">{ld?.appConfig?.description}</p>}
      </div>
      <footer className="fixed right-0 bottom-0 left-0 mx-auto max-w-[420px] px-6 py-6">
        {process.env.NODE_ENV === 'development' || isStandalone ? (
          <button type="button" onClick={login} className="btn-main w-full bg-main-fg text-main text-xl">
            <HandTap size={28} className="-ml-4 mr-3" />
            Start
          </button>
        ) : (
          <PWAInstallPrompt className="btn-main w-full" />
        )}
        <BuildWith />
      </footer>
    </div>
  )
}

const BuildWith = () => (
  <div className="mt-6 text-center font-mono text-sm">
    <a href={SITE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center">
      Build with <IconKon size={28} className="-mt-0.5 ml-1" /> <strong>KON</strong>
    </a>
  </div>
)
