<template>
  <div>
    <Html class="h-full bg-gray-100" />

    <Head>
      <Title>{{ $t('meta.title') }}</Title>
      <Meta name="description" :content="$t('meta.description')" />
      <Meta name="charset" content="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Link rel="manifest" href="/manifest.json" />
    </Head>

    <Body class="h-full" />

    <!-- Toggleable sidebar for mobile -->
    <ToggleableSidebar />

    <!-- Static sidebar for desktop -->
    <StaticSidebar />

    <div class="md:pl-64 flex flex-col flex-1">
      <TopBar />
      <main>
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
