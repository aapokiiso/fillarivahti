import { DefaultConnectionProvider, EnvConfiguration } from '@aapokiiso/fillarivahti-hsl-graphql-client';

const configuration = new EnvConfiguration();

const connectionProvider = new DefaultConnectionProvider(
    configuration,
);

export default connectionProvider.getConnection();
