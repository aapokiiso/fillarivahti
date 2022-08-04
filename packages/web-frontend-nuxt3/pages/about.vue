<template>
  <div class="max-w-3xl mx-auto px-4 py-8 text-gray-900 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 class="text-2xl font-bold">
      {{ $t('about.title') }}
    </h1>

    <section>
      <p class="my-4">
        {{ $t("about.summary") }}
      </p>

      <p class="my-4">
        {{ $t("about.sources") }}
      </p>

      <p class="my-4">
        <a class="font-medium text-amber-700 hover:text-amber-900" href="https://github.com/aapokiiso/fillarivahti">{{ $t('about.githubLink') }}</a>
      </p>
    </section>

    <section>
      <h2 class="text-xl font-bold">
        {{ $t("credits.title") }}
      </h2>

      <p class="my-4">
        {{ $t("credits.hsl") }}
      </p>

      <h3 class="font-bold">
        {{ $t("credits.licensesTitle") }}
      </h3>
      <ul class="list-disc pl-8">
        <li class="my-2">
          <a class="font-medium text-amber-700 hover:text-amber-900" href="https://github.com/tailwindlabs/heroicons/blob/db29d11448c947c42822aca42026a9f14806530d/LICENSE">
            {{ $t("credits.heroicons") }}
          </a>
        </li>
        <li class="my-2">
          <a class="font-medium text-amber-700 hover:text-amber-900" href="https://github.com/FortAwesome/Font-Awesome/blob/701d64a8943214b9767733e7ac0b201f1a08a8b3/LICENSE.txt">
            {{ $t("credits.fontAwesome") }}
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
