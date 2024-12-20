"use client"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { isValidGameId, validateCreateGame } from './util/landingPageHelper';
import { useRouter } from "next/navigation";

const InputWithButton = dynamic(() => import('@/components/ui/InputWithButton').then((mod) => mod.default), { ssr: false });
const MenuTank = dynamic(() => import('@/components/canvas/MenuTank').then((mod) => mod.MenuTank), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})


const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })


export default function Page() {
  const router = useRouter();

  const handleJoinGame = async (gameId: string) => {
    if (!isValidGameId(gameId)) {
      alert("Please Enter A Valid Game Id"); //TODO Make error nicer
    }
    router.push(`/${gameId}`);
    router.refresh();
  }

  const handleCreateGame = async () => {
    try {
      const redirect = await validateCreateGame();
      router.push(redirect);
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 overflow-hidden">
        {/* Left side: Tank view */}
        <div className="flex h-1/2 w-full md:h-full md:w-1/2 items-center justify-center">
          <div className="flex h-4/5 w-full items-center justify-center">
            <View className="flex h-full w-full items-center justify-center">
              <Suspense fallback={null}>
                <MenuTank scale={8} position={[0, -0.4, -1]} />
                <Common />
              </Suspense>
            </View>
          </div>
        </div>

        {/* Right side: Game options */}
        <div className="flex h-1/2 w-full flex-col items-center justify-center md:h-full md:w-1/2 p-4 md:p-8 lg:p-12">
          <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-bold text-gray-700">
            Wu Tanks
          </h1>
          <div className="mb-6 w-full md:w-2/4 lg:w-1/2">
            <InputWithButton
              onSubmit={handleJoinGame}
              placeholder="Enter Game ID"
              buttonText="Join Game"
            />
          </div>
          <p className="my-4 text-base md:text-lg lg:text-4xl font-medium text-gray-500">
            or
          </p>
          <button
            onClick={handleCreateGame}
            className="rounded-md bg-green-700 px-5 py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 text-sm md:text-base lg:text-lg text-white shadow-md hover:bg-gray-800  transition-transform transform hover:scale-105"
          >
            New Game
          </button>
        </div>
      </div>
    </>
  )
}
