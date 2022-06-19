<template>
  <div>
    <Html class="h-full bg-gray-100" />
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
