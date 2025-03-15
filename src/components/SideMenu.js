import { memo } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'

// components
import { useComponent } from '@components'
const {
  BaseIcon,
  BaseButton,
  BaseImage,
  BaseDiv
} = useComponent()

// hooks
import { useAuth } from '@hooks'

// images
import { images } from '@assets/images'

// composable
import { menuList } from '@composable/menu'

function SideMenu ({ goto, activeScreen, setActiveScreen }) {
  const { logout } = useAuth()

  return (
    <BaseDiv styles="w-[80] h-full flex flex-col pt-[20] pb-[40] items-center gap-[40]">
      <BaseImage
        src={images.logo}
        styles="w-[60] h-[20] mb-[10]"
      />

      {
        menuList.map((item, i) => (
          <BaseButton
            key={i}
            styles={`flex items-center justify-center w-[30] h-[30] br-[5] ${activeScreen === item.path ? 'bw-[2] bc-[#2cb6dd]' : ''} ${i === (menuList.length-1) ? 'mt-[auto]' : ''}`}
            action={() => {
              if (item.path === 'logout') {
                return logout(() => {
                  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                  goto({ parent: 'root', child: 'auth' })
                })
              }

              setActiveScreen(item.path)
              goto({ parent: 'dashboard', child: item.path })
            }}
          >
            <BaseIcon
              type={item.type}
              name={item.name}
              size={item.size}
              color="#2cb6dd"
            />
          </BaseButton>
        ))
      }

      
    </BaseDiv>
  )
} 

export default memo(SideMenu)