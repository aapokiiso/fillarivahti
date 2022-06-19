import {
  MapIcon,
  ViewListIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/outline'

export const useSidebar = () => {
  const navigationItems = [
    { name: 'Map view', route: 'index', icon: MapIcon },
    { name: 'List view', route: 'list', icon: ViewListIcon },
    { name: 'About', route: 'about', icon: QuestionMarkCircleIcon },
  ]

  const route = useRoute()

  const navigation = computed(
    () => navigationItems
      .map(item => ({
        ...item,
        current: item.route === route.name,
      })),
  )

  const isSidebarOpen = useState<boolean>('isSidebarOpen', () => false)

  return { navigation, isSidebarOpen }
}
