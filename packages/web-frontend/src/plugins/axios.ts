import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Plugin } from '@nuxt/types';

declare module '@nuxt/types' {
    interface Context {
        $hslGraphqlClient: NuxtAxiosInstance,
        $capacityClient: NuxtAxiosInstance,
        $addressSearchClient: NuxtAxiosInstance,
        $locationSearchClient: NuxtAxiosInstance,
    }
}

const axiosPlugin: Plugin = context => {
    context.$hslGraphqlClient = context.$axios.create({
        baseURL: process.env.hslGraphqlEndpointUrl,
        method: 'POST',
        responseType: 'json',
    });

    context.$capacityClient = context.$axios.create({
        baseURL: process.env.capacityEndpointUrl,
    });

    context.$addressSearchClient = context.$axios.create({
        baseURL: process.env.addressSearchEndpointUrl,
        method: 'GET',
    });
};

export default axiosPlugin;
