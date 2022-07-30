import { Ref } from 'nuxt/dist/app/compat/capi'
import { AsyncData, UseFetchOptions } from 'nuxt/dist/app/composables'

/**
 * Sets up useFetch that works also outside <script setup> and lifecycle hooks
 * (does not rely on the Nuxt instance to work).
 *
 * @param {string} key Unique identifier for fetch
 * @param {object} options
 * @returns {Function}
 */
export function useFetchFactory<DataT> (
  key: string,
  { defaultValue }: { defaultValue?: DataT },
): (url: Ref<string>, opts?: UseFetchOptions<DataT>) => Promise<AsyncData<DataT, Error>> {
  // useState requires Nuxt instance, these need to be initialized during setup.
  const data = useState<DataT|null>(`${key}Data`, () => defaultValue)
  const pending = useState<boolean>(`${key}Pending`, () => false)
  const error = useState<Error|null>(`${key}Error`, () => null)
  const isInitialized = useState<boolean>(`${key}Initialized`, () => false)
  const unwatch = useState<Function|null>(`${key}Unwatch`)

  return async function (url: Ref<string>, opts?: UseFetchOptions<DataT>): Promise<AsyncData<DataT, Error>> {
    if (opts && typeof opts.default === 'undefined' && typeof defaultValue !== 'undefined') {
      opts.default = () => defaultValue
    }

    const refresh = async () => {
      if (url.value) {
        try {
          pending.value = true

          data.value = await $fetch(url.value, opts)

          pending.value = false
        } catch (e) {
          error.value = e
        }
      } else {
        data.value = defaultValue
      }
    }

    // Execute initial load only during first execution.
    if (!isInitialized.value) {
      isInitialized.value = true

      await refresh()
    }

    // Initialize URL watcher client-side only to avoid hydration errors in
    // case the URL changes during rendering.
    if (process.client) {
      // Clear old watcher
      if (typeof unwatch.value === 'function') {
        unwatch.value()
      }

      unwatch.value = watch(url, () => {
        refresh()
      })
    }

    return { data, pending, error, refresh }
  }
}
