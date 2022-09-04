import {
  MapIcon,
  ViewListIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/outline'

import { useLocaleRoute } from '#i18n'

export const useSidebar = () => {
  const navigationItems = [
    { i18nLabel: 'sidebar.item.listView', route: 'list', icon: ViewListIcon },
    { i18nLabel: 'sidebar.item.mapView', route: 'map', icon: MapIcon },
    { i18nLabel: 'sidebar.item.about', route: 'about', icon: QuestionMarkCircleIcon },
  ]

  const route = useRoute()
  const localeRoute = useLocaleRoute()

  const navigation = computed(
    () => navigationItems
      .map((item) => {
        const { name: routeLocaleName } = localeRoute({ name: item.route })

        return {
          ...item,
          current: routeLocaleName === route.name,
        }
      }),
  )

  const isSidebarOpen = useState<boolean>('isSidebarOpen', () => false)

  return { navigation, isSidebarOpen }
}
